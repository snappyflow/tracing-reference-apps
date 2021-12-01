if (process.env.NODE_ENV == 'development') 
    require('dotenv').config();

const Snappyflow = require('sf-apm-lib');

let projectName = process.env.PROJECT_NAME;
let appName = process.env.APP_NAME;
let profileKey = process.env.SF_PROFILE_KEY;

var sfObj = new Snappyflow();
sfObj.init(profileKey, projectName, appName); // Manual override
let sfTraceConfig = sfObj.getTraceConfig();
var apm;
try {
    // let sfTraceConfig = JSON.parse(String.fromCharCode.apply(String, require('child_process').execSync("/opt/sfagent/sftrace/sftrace")))
    
    // console.log('sfTraceConfig ', sfTraceConfig);
    apm = require('elastic-apm-node').start({
        serviceName: 'refapp-node',
        serverUrl: sfTraceConfig['SFTRACE_SERVER_URL'],
        globalLabels: sfTraceConfig['SFTRACE_GLOBAL_LABELS'],
        verifyServerCert: sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'] === undefined ? false : sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'],
        active: sfTraceConfig['SFTRACE_SERVER_URL'] === undefined ? false : true,
        stackTraceLimit: sfTraceConfig['SFTRACE_STACK_TRACE_LIMIT'],
        captureSpanStackTraces: sfTraceConfig['SFTRACE_CAPTURE_SPAN_STACK_TRACES'],
        metricsInterval: '0s',
        usePathAsTransactionName: true
        // logLevel: 'debug',
        // payloadLogFile: 'elasticapmagent.log'
    });
} catch (e) {
    console.log(e);
}

const mysql = require('mysql');
const { Client } = require('@elastic/elasticsearch');
// console.log('env ', process.env);
const elasticHost = process.env.ELASTIC_HOST;
const elasticPort = process.env.ELASTIC_PORT;

const client = new Client({ node: `http://${elasticHost}:${elasticPort}` });


// console.log(elasticHost, elasticPort);

const mysqlHost = process.env.MYSQL_HOST;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const mysqlDatabase = process.env.MYSQL_DATABASE;

const con = mysql.createConnection({
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPassword,
    database: mysqlDatabase
});

con.connect(function(err) {
    if (err){
        apm.captureError(err);
    }
});

const logger = require("./logger").Logger;

logger.attachAPM(apm);
logger.setLogFilePath('/var/log/trace/ntrace.log');
logger.init();

const app = require('express')();

app.get('/', function (req, res) {
    logger.info('Hello world get api called')
    res.send('Hello World!');
});

// DB Section
app.get('/database/error', function (req, res) {
    logger.info('Get database error API called');
    // console.log("Connected!");
    var query = 'SELECT * FROM abcd;';
    con.query(query, function (err, result) {
        if (err) {
            apm.captureError(err);
            logger.error(`Error mysql query ${err}`);
            return res.status(500).send({
                'msg': 'Error: ' + err
            });
        }
        //   console.log("Result: " + result);
        return res.send({
            'msg': 'Success'
        });
    });
});

app.get('/database', function (req, res) {
    logger.info('Get database API called');
    // console.log("Connected!");
    var query = 'SELECT * FROM Person;';
    con.query(query, function (err, result) {
        if (err) {
            apm.captureError(err);
            logger.error(`Error mysql query ${err}`);
            return res.send({
                'msg': 'Error: ' + err
            });
        }
        //   console.log("Result: " + result);
        return res.send({
            'msg': 'Database Success'
        });
    });
});

// Elastic section 
app.get('/elastic/error', function(req, res){
    // callback API
    client.search({
        index: 'my-index',
    }, (err, result) => {
        if (err) {
            logger.error(`Error elastic search ${err}`);
            apm.captureError(err);
            return res.status(500).send({'msg': 'Error search API'});
        }
        res.send({msg: 'Success', result: result});
    });
});

app.get('/elastic', function(req, res){
    // callback API
    let result = client.cluster.health();
    res.send({msg: 'Success', result: result});
});

app.listen(3000);