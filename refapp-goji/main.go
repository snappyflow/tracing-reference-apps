// This is a Goji reference app for elastic instrumentation.

package main

import (
	_ "github.com/snappyflow/go-sf-apm-lib"

	"context"
	"net/http"

	"database/sql"

	"github.com/olivere/elastic"

	"github.com/zenazn/goji"

	"github.com/snappyflow/sf-elastic-apm-go/module/apmgoji"
	"go.elastic.co/apm/module/apmhttp/v2"

	"go.elastic.co/apm/module/apmelasticsearch/v2"
	"go.elastic.co/apm/module/apmsql/v2"
	_ "go.elastic.co/apm/module/apmsql/v2/sqlite3"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/snappyflow/sf-elastic-apm-go/module/apmmongo"

	"github.com/go-redis/redis/v8"
	"github.com/snappyflow/sf-elastic-apm-go/module/apmgoredisv8"
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
var redisClient = redis.NewClient(&redis.Options{
	Addr:     "localhost:6379",
	Password: "",
	DB:       0,
})

// MongoStruct to unmarshal mongoDB data
type MongoStruct struct {
	Name string `json:"Name" bson:"Name,omitempty"`
	Age  int    `json:"age" bson:"age,omitempty"`
	City string `json:"city" bson:"city,omitempty"`
}

func main() {
	// wrapped http client for tracing external spans
	client = apmhttp.WrapClient(http.DefaultClient)

	// add the apmgoredisv8 hook to redis client
	redisClient.AddHook(apmgoredisv8.NewHook())

	var err error
	// open the database connection using apmsql.Open for tracing sql spans
	db, err = apmsql.Open("sqlite3", ":memory:")
	if err != nil {
		Error.Println(err)
	}
	if _, err := db.Exec("CREATE TABLE stats (name TEXT PRIMARY KEY, count INTEGER);"); err != nil {
		Error.Println(err)
	}

	goji.Get("/", Root)
	goji.Get("/getregion", GetRegion)
	goji.Get("/sql/:name", SQLHandler)
	goji.Get("/elastic", ElasticHandler)
	goji.Get("/mongo", MongoHandler)
	goji.Get("/redis", RedisHandler)

	// adding apmgoji middleware
	goji.Use(goji.DefaultMux.Router)
	goji.Use(apmgoji.Middleware())
	// middlewares for log and logrus to get the current request context
	goji.Use(GetContext)
	goji.Use(GetContextLogrus)

	goji.Serve()
}
