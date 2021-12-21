/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on any of these options, check out:
 * https://sailsjs.com/config/globals
 * 
 */
if (process.env.NODE_ENV == 'development') 
  require('dotenv').config();

let logger = require("./logger").Logger;

let projectName = process.env.PROJECT_NAME;
let appName = process.env.APP_NAME;
let profileKey = process.env.SF_PROFILE_KEY;

const Snappyflow = require('sf-apm-lib');
var sfObj = new Snappyflow();
sfObj.init(profileKey, projectName, appName);
let sfTraceConfig = sfObj.getTraceConfig();

// Start Trace to log feature section
// Add below line of code to enable Trace to log feature:
sfTraceConfig['SFTRACE_GLOBAL_LABELS'] += ',_tag_redact_body=true'
// Option Configs for trace to log
// Add below line to provide custom documentType (Default:"user-input"):
sfTraceConfig['SFTRACE_GLOBAL_LABELS'] += ',_tag_documentType=<document-type>'
// Add below line to provide destination index (Default:"log"):
sfTraceConfig['SFTRACE_GLOBAL_LABELS'] += ',_tag_IndexType=<index-type>' // Applicable values(log, metric)
// End trace to log section

var apm =  require('elastic-apm-node').start({
  serviceName: 'refapp-node-sailjs',
  serverUrl: sfTraceConfig['SFTRACE_SERVER_URL'],
  globalLabels: sfTraceConfig['SFTRACE_GLOBAL_LABELS'],
  verifyServerCert: sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'] === undefined ? false : sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'],
  active: sfTraceConfig['SFTRACE_SERVER_URL'] === undefined ? false : true,
  stackTraceLimit: sfTraceConfig['SFTRACE_STACK_TRACE_LIMIT'],
  captureSpanStackTraces: sfTraceConfig['SFTRACE_CAPTURE_SPAN_STACK_TRACES'],
  metricsInterval: '0s',
  usePathAsTransactionName: true,
  captureBody: 'all' // Required to enable trace to log feature
});

logger.attachAPM(apm);
logger.setLogFilePath('/var/log/trace/n1trace.log');
logger.init();

module.exports.globals = {

  /****************************************************************************
  *                                                                           *
  * Whether to expose the locally-installed Lodash as a global variable       *
  * (`_`), making  it accessible throughout your app.                         *
  *                                                                           *
  ****************************************************************************/

  _: require('@sailshq/lodash'),

  /****************************************************************************
  *                                                                           *
  * This app was generated without a dependency on the "async" NPM package.   *
  *                                                                           *
  * > Don't worry!  This is totally unrelated to JavaScript's "async/await".  *
  * > Your code can (and probably should) use `await` as much as possible.    *
  *                                                                           *
  ****************************************************************************/

  async: false,

  /****************************************************************************
  *                                                                           *
  * Whether to expose each of your app's models as global variables.          *
  * (See the link at the top of this file for more information.)              *
  *                                                                           *
  ****************************************************************************/

  models: true,

  /****************************************************************************
  *                                                                           *
  * Whether to expose the Sails app instance as a global variable (`sails`),  *
  * making it accessible throughout your app.                                 *
  *                                                                           *
  ****************************************************************************/

  sails: true,
  apm : apm,
  logger: logger

};
