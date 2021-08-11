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
let logger = require("./logger").Logger;

let projectName = 'sftrace';
let appName = 'reference-apps';
let profileKey = 'ExQdG2PEDE8o3XOJ8RPnYU0jfvLDitaIO+rNQ54w0ESpUSwMU2NmLGPS3y4YsmLyhe55+NadzipnZxzqVEiJODOqnj3seRJPMZ0UZ0/33qA7Tah/4Fv2Zzoap+R8cnNDPs2r6MfWpXTKc792UzwF8wpLAsJvdH69Re2VYko8z5sLDd9k4GuZoDYrxMNh/netQKnJsWeACm4Slz4VkIYgKpN9lyAgud6I6BECQUYOu6yfKjRUFhIFIU/NlYivO49oWgtFtv4fye3ovmvDmaxdTcI0CD1C3m8VbAvTf+JVoJHWHlqmpgNWfA2x+amIB8raULzeHFu2ztJGHcIPdp5L6F0snOKrCVplS/UEPiqRPc+cS2PwO5TYYR4WuOeksze8TQr+NvlVN5eW2mqSMSDQhg==';
const sf = require('sf-apm-lib');
var sfObj = new sf.Snappyflow();
sfObj.init(profileKey, projectName, appName);
let sfTraceConfig = sfObj.getTraceConfig();

var apm =  require('elastic-apm-node').start({
  serviceName: 'refapp-node-sailjs',
  serverUrl: sfTraceConfig['SFTRACE_SERVER_URL'],
  globalLabels: sfTraceConfig['SFTRACE_GLOBAL_LABELS'],
  verifyServerCert: sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'] === undefined ? false : sfTraceConfig['SFTRACE_VERIFY_SERVER_CERT'],
  active: sfTraceConfig['SFTRACE_SERVER_URL'] === undefined ? false : true,
  stackTraceLimit: sfTraceConfig['SFTRACE_STACK_TRACE_LIMIT'],
  captureSpanStackTraces: sfTraceConfig['SFTRACE_CAPTURE_SPAN_STACK_TRACES']
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
