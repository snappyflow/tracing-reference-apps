// Firstly we'll need to import the fs library
var fs = require("fs");
const moment = require('moment');

// next we'll want make our Logger object available
// to whatever file references it.
var Logger = (exports.Logger = {});
var apm;
var filePath;
// Create 3 sets of write streams for the 3 levels of logging we wish to do
// every time we get an error we'll append to our error streams, any debug message
// to our debug stream etc...
var logStream;

// Finally we create 3 different functions
// each of which appends our given messages to
// their own log files along with the current date as an
// iso string and a \n newline character
// 14/Jul/2021 10:13:42
function getMessageString(msg, level) {
    var traceId = 'None';
    var transactionId = 'None';
    var spanId = 'None';
    if (typeof(apm) !== 'undefined') {
        // console.log('APM ', apm.currentTraceIds);
        var apmTraceObj = apm.currentTraceIds;
        transactionId = apmTraceObj['transaction.id'] || 'None';
        traceId = apmTraceObj['trace.id'] || 'None';
        spanId = apmTraceObj['span.id'] || 'None';
    }
    var msg = `[${moment().format('DD/MMM/YYYY hh:mm:ss')}] [${level}] [${msg}] | elasticapm transaction.id=${transactionId} trace.id=${traceId} span.id=${spanId}\n`
    return msg;
}
Logger.init = function () {
    logStream = fs.createWriteStream(filePath, {flags: 'a'});
}

Logger.setLogFilePath = function(logFilePath) {
    filePath = logFilePath;
};

Logger.attachAPM = function(elasticapm) {
    apm = elasticapm;
};

Logger.info = function(msg) {
    var message = getMessageString(msg, 'INFO');
    logStream.write(message);
};

Logger.debug = function(msg) {
    var message = getMessageString(msg, 'DEBUG');
    logStream.write(message);
};

Logger.error = function(msg) {
    var message = getMessageString(msg, 'ERROR');
    logStream.write(message);
};