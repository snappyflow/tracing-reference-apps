// This is a Goji reference app for elastic instrumentation.

package main

import (
	_ "github.com/snappyflow/go-sf-apm-lib"

	"context"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"database/sql"

	"github.com/olivere/elastic"

	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"

	"github.com/snappyflow/sf-elastic-apm-go/module/apmgoji"
	"go.elastic.co/apm/module/apmhttp/v2"
	"go.elastic.co/apm/v2"

	"go.elastic.co/apm/module/apmelasticsearch/v2"
	"go.elastic.co/apm/module/apmsql/v2"
	_ "go.elastic.co/apm/module/apmsql/v2/sqlite3"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"go.elastic.co/apm/module/apmmongo/v2"
)

var client *http.Client
var db *sql.DB
var elasticClient, _ = elastic.NewClient(elastic.SetHttpClient(&http.Client{
	Transport: apmelasticsearch.WrapRoundTripper(http.DefaultTransport),
}))
var mongoClient, _ = mongo.Connect(
	context.Background(),
	options.Client().SetMonitor(apmmongo.CommandMonitor()).ApplyURI("mongodb://localhost:27017"),
)

// MongoStruct to unmarshal mongoDB data
type MongoStruct struct {
	Name string `json:"Name" bson:"Name,omitempty"`
	Age  int    `json:"age" bson:"age,omitempty"`
	City string `json:"city" bson:"city,omitempty"`
}

func main() {
	// wrapped http client for tracing external spans
	client = apmhttp.WrapClient(http.DefaultClient)

	var err error
	// db handler for tracing db spans
	db, err = apmsql.Open("sqlite3", ":memory:")
	if err != nil {
		Error.Println(err)
	}
	if _, err := db.Exec("CREATE TABLE stats (name TEXT PRIMARY KEY, count INTEGER);"); err != nil {
		Error.Println(err)
	}

	goji.Get("/", Root)
	goji.Get("/getregion", GetRegion)
	goji.Get("/hello/:name", HelloHandler)
	goji.Get("/elastic", ElasticHandler)
	goji.Get("/mongo", MongoHandler)

	// adding apmgoji middleware
	goji.Use(goji.DefaultMux.Router)
	goji.Use(apmgoji.Middleware())
	// middlewares for log and logrus packages
	goji.Use(GetContext)
	goji.Use(GetContextLogrus)

	goji.Serve()
}

// Root routes (GET "/")
func Root(w http.ResponseWriter, r *http.Request) {
	Info.Println("User has hit the url 127.0.0.1:8000/")
	io.WriteString(w, "Hello world")
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
	Debug.Println("Length if response body: ", len(sb))
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

// HelloHandler makes a db request
func HelloHandler(c web.C, w http.ResponseWriter, r *http.Request) {
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
		e := apm.CaptureError(r.Context(), err)
		e.Send()
	}
	var results []MongoStruct
	for cur.Next(r.Context()) {
		var elem MongoStruct
		err := cur.Decode(&elem)
		if err != nil {
			Error.Println("mongoDB unmarshal error: ", err)
			e := apm.CaptureError(r.Context(), err)
			e.Send()
		}
		results = append(results, elem)
	}
	if err := cur.Err(); err != nil {
		Error.Println("mongoDB cursor error: ", err)
		e := apm.CaptureError(r.Context(), err)
		e.Send()
	}
	cur.Close(r.Context())
	Debug.Printf("Found multiple documents: %+v\n", results)
	for i, result := range results {
		Info.Printf("row %d: %s, %d, %s\n", i, result.Name, result.Age, result.City)
	}
}
