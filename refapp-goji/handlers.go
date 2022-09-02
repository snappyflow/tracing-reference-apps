package main

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	_ "github.com/snappyflow/go-sf-apm-lib"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/zenazn/goji/web"

	"go.elastic.co/apm/v2"

	"github.com/go-redis/redis/v8"
)

func func1(ctx context.Context) {
	// logger.WithFields(logrusCtxLabel.contextMap).Info("Hit func1 from Root")
	span, c := apm.StartSpan(ctx, "func1", "custom.internal.functionCall1")
	// Here, "func1" is the span name, "custom" is the span type, "internal" is the subtype, and "functionCall1" is the action.
	spanChild, _ := apm.StartSpan(c, "internal operation", "custom") // nested span
	// logger.WithFields(logrusCtxLabel.contextMap).Info("Executing internal operation in func1...")
	// spanChild must end before parent span
	spanChild.End()
	span.End()
}

func func2(ctx context.Context) {
	// logger.WithFields(logrusCtxLabel.contextMap).Info("Hit func2 from Root")
	span, _ := apm.StartSpan(ctx, "func2", "custom")
	defer span.End()
}

// Root routes (GET "/")
func Root(w http.ResponseWriter, r *http.Request) {
	// Info.Println("User has hit the url 127.0.0.1:8000/")
	io.WriteString(w, "Hello world")
	// send the current request context to next functions to trace them
	func1(r.Context())
	func2(r.Context())
}

// GetRegion makes request to an external API
func GetRegion(w http.ResponseWriter, r *http.Request) {
	span, ctx := apm.StartSpan(r.Context(), "getRegion", "custom")
	defer span.End()
	req, _ := http.NewRequest("GET", "https://ipinfo.io/161.185.160.93/geo", nil)
	resp, err := client.Do(req.WithContext(ctx))
	if err != nil {
		e := apm.CaptureError(ctx, err)
		e.Send()
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	sb := string(body)
	// Debug.Println("Length if response body: ", len(sb))
	io.WriteString(w, sb)
}

// ElasticHandler makes an elasticsearch request
func ElasticHandler(w http.ResponseWriter, r *http.Request) {
	exists, err := elasticClient.IndexExists("index-01").Do(r.Context())
	if err != nil {
		Error.Println("elastic search error: ", err)
		e := apm.CaptureError(r.Context(), err)
		e.Send()
	}
	if exists {
		io.WriteString(w, "index index-01 exists")
	} else {
		io.WriteString(w, "index index-01 does not exists")
	}
	Info.Println("index exists: ", exists)

}

// SQLHandler makes a db request
func SQLHandler(c web.C, w http.ResponseWriter, r *http.Request) {
	userName := c.URLParams["name"]
	requestCount, _ := updateRequestCount(r.Context(), userName)
	fmt.Fprintf(w, "Hello, %s! (#%d)\n", userName, requestCount)
}

// updateRequestCount increments a count for name in db, returning the new count.
func updateRequestCount(ctx context.Context, name string) (int, error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return -1, err
	}
	row := tx.QueryRowContext(ctx, "SELECT count FROM stats WHERE name=?", name)
	var count int
	switch err := row.Scan(&count); err {
	case nil:
		logger.WithFields(logrusCtxLabel.contextMap).Debug("Row with name ", name, " already exists. So incrementing the count.")
		count++
		if _, err := tx.ExecContext(ctx, "UPDATE stats SET count=? WHERE name=?", count, name); err != nil {
			return -1, err
		}
	case sql.ErrNoRows:
		logger.WithFields(logrusCtxLabel.contextMap).Debug("Row with name ", name, " does not exit. So inserting a new row.")
		count = 1
		if _, err := tx.ExecContext(ctx, "INSERT INTO stats (name, count) VALUES (?, ?)", name, count); err != nil {
			return -1, err
		}
	default:
		logger.WithFields(logrusCtxLabel.contextMap).Error("Error in fetching database data:", err)
		return -1, err
	}
	return count, tx.Commit()
}

// MongoHandler handles mongoDb requests
func MongoHandler(w http.ResponseWriter, r *http.Request) {
	collection := mongoClient.Database("mydb").Collection("persons")
	cur, err := collection.Find(r.Context(), bson.D{})
	if err != nil {
		Error.Println("mongoDB find error: ", err)
	}
	var results []MongoStruct
	for cur.Next(r.Context()) {
		var elem MongoStruct
		err := cur.Decode(&elem)
		if err != nil {
			Error.Println("mongoDB unmarshal error: ", err)
		}
		results = append(results, elem)
	}
	if err := cur.Err(); err != nil {
		Error.Println("mongoDB cursor error: ", err)
	}
	cur.Close(r.Context())
	Debug.Printf("Found multiple documents: %+v\n", results)
	for i, result := range results {
		Info.Printf("row %d: %s, %d, %s\n", i, result.Name, result.Age, result.City)
	}
}

// RedisHandler handles redis calls
func RedisHandler(c web.C, w http.ResponseWriter, r *http.Request) {
	pong := redisClient.Ping(r.Context())
	Info.Println("redis ping status:", pong)

	res := redisClient.Set(r.Context(), "key1", "value1", 0)
	if res.Err() != nil {
		Error.Println("Set error in RedisHandler:", res.Err())
	}

	val, err := redisClient.Get(r.Context(), "key1").Result()
	if err != nil {
		logger.WithFields(logrusCtxLabel.contextMap).Error("Get error in RedisHandler:", err)
	}
	Info.Println("key1 =", val)

	val2, err := redisClient.Get(r.Context(), "key2").Result()
	if err == redis.Nil {
		logger.WithFields(logrusCtxLabel.contextMap).Error("Get error in RedisHandler:", err)
		Error.Println("key2 does not exist")
	} else if err != nil {
		logger.WithFields(logrusCtxLabel.contextMap).Error("Get error in RedisHandler:", err)
	} else {
		logger.WithFields(logrusCtxLabel.contextMap).Info("key2 =", val2)
	}
}
