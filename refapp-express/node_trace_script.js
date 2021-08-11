const sf = require('sf-apm-lib');
const mysql = require('mysql');

let projectName = process.env.PROJECT_NAME;
let appName = process.env.APP_NAME;
let profileKey = process.env.SF_PROFILE_KEY;
var sfObj = new sf.Snappyflow();
sfObj.init(profileKey, projectName, appName);
var apm;
try {
    
    let sfTraceConfig = sfObj.getTraceConfig();
    apm = require('elastic-apm-node').start({
      serviceName: 'refapp-node-lambda',
      serverUrl: sfTraceConfig['SFTRACE_SERVER_URL'],
      globalLabels: sfTraceConfig['SFTRACE_GLOBAL_LABELS'],
      verifyServerCert: sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'] === undefined ? false : sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'],
      active: sfTraceConfig['SFTRACE_SERVER_URL'] === undefined ? false : true,
      stackTraceLimit: sfTraceConfig['SFTRACE_STACK_TRACE_LIMIT'],
      captureSpanStackTraces: sfTraceConfig['SFTRACE_CAPTURE_SPAN_STACK_TRACES'],
      captureBody: 'all'
    })
} catch (e) {
    console.log(e)
}

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'sample'
});

var trans = apm.startTransaction('database transaction', 'script');
var span = apm.startSpan('parse json');

try {
    JSON.parse('{"app": "test"}')
} catch (e) {
    apm.captureError(e);
}

// when we've processed the json, stop the custom span
if (span) span.end()

con.connect(function(err) {
    if (err){
        apm.captureError(err);
        trans.result = err ? 'error' : 'success';
        // end the transaction
        trans.end();
        return;
        // process.exit(1);
    }
    console.log("Connected!");
    var query = 'SELECT * FROM abcd;';
    var dbspan = apm.startSpan('db query span');
    con.query(query, function (err, result) {
        if (err) {
            apm.captureError(err);
            if (dbspan) dbspan.end();
            trans.result = err ? 'error' : 'success';
            // end the transaction
            trans.end();
            console.log('Inside query error block');
            return result;
        }
        console.log('After query error block');
        
        if (dbspan) dbspan.end();
        trans.result ='success';
        // end the transaction
        trans.end();
        return;
    });
    
});



