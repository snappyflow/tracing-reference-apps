import os
from flask import Flask
import mysql.connector
from elasticsearch.client import Elasticsearch
from elasticapm.contrib.flask import ElasticAPM
import logging 
from elasticapm.handlers.logging import Formatter
from sf_apm_lib.snappyflow import Snappyflow

fh = logging.FileHandler('/var/log/trace/flask.log') 

# we imported a custom Formatter from the Python Agent earlier 
formatter = Formatter("[%(asctime)s] [%(levelname)s] [%(message)s]", "%d/%b/%Y %H:%M:%S") 
fh.setFormatter(formatter) 
logging.getLogger().addHandler(fh)

log = logging.getLogger()
log.setLevel('INFO')


app = Flask(__name__)

project_name = os.getenv('PROJECT_NAME')
app_name = os.getenv('APP_NAME')
profile_key = os.getenv('SF_PROFILE_KEY')

sf = Snappyflow()
sf.init(profile_key, project_name, app_name)

SFTRACE_CONFIG = sf.get_trace_config()

# Start Trace to log feature section
# Add below line of code to enable Trace to log feature:
SFTRACE_CONFIG['SFTRACE_GLOBAL_LABELS'] += ',_tag_redact_body=true'
# Option Configs for trace to log
# Add below line to provide custom documentType (Default:"user-input"):
SFTRACE_CONFIG['SFTRACE_GLOBAL_LABELS'] += ',_tag_documentType=<document-type>'
# Add below line to provide destination index (Default:"log"):
SFTRACE_CONFIG['SFTRACE_GLOBAL_LABELS'] += ',_tag_IndexType=<index-type>' # Applicable values(log, metric)
# End trace to log section

app.config['ELASTIC_APM'] = {
    'SERVICE_NAME': 'refapp-flask',
    'SERVER_URL': SFTRACE_CONFIG.get('SFTRACE_SERVER_URL'),
    'GLOBAL_LABELS': SFTRACE_CONFIG.get('SFTRACE_GLOBAL_LABELS'),
    'VERIFY_SERVER_CERT': SFTRACE_CONFIG.get('SFTRACE_VERIFY_SERVER_CERT'),
    'SPAN_FRAMES_MIN_DURATION': SFTRACE_CONFIG.get('SFTRACE_SPAN_FRAMES_MIN_DURATION'),
    'STACK_TRACE_LIMIT': SFTRACE_CONFIG.get('SFTRACE_STACK_TRACE_LIMIT'),
    'CAPTURE_SPAN_STACK_TRACES': SFTRACE_CONFIG.get('SFTRACE_CAPTURE_SPAN_STACK_TRACES'),
    'DEBUG': True,
    'METRICS_INTERVAL': '0s',
    'CAPTURE_BODY':'all' # Required for trace to log feature
}

apm = ElasticAPM(app)

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USERNAME'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DATABASE'] = 'sample'
app.config['ELASTIC_HOST'] = os.getenv('ELASTIC_HOST')
app.config['ELASTIC_PORT'] = os.getenv('ELASTIC_PORT')

connection = None
es = None
# try:
connection = mysql.connector.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USERNAME'],
    passwd=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DATABASE']
)
# except Exception as err:
#     log.error("Can't connect to mysql")

# Elastic 

url = "http://{}:{}".format(app.config['ELASTIC_HOST'], app.config['ELASTIC_PORT'])
es = Elasticsearch([url], timeout=60)

@app.route('/')
def hello():
    return 'Welcome to Home'


@app.route('/database/handled')
def database_api():
    log.info('Database handled API called')
    query = 'SELECT * FROM abcd;';
    cursor = connection.cursor()
    try:
        res = cursor.execute(query)
        print('res ', res)
    except Exception as e:
        log.error('The error %s occurred', str(e), exc_info=True)
    return {'status': 'Success database'}
        

@app.route('/database/unhandled')
def database_unhandled():
    log.info('Database unhandled API called')
    query = 'SELECT * FROM abcd;';
    cursor = connection.cursor()
    res = cursor.execute(query)


@app.route('/elastic/handled')
def elastic_api():
    log.info('Elastic handled API called')
    result = {'msg': 'Success elastic'}
    try:
        es.search(index='abcd')
    except Exception as ex:
        log.error('error %s', ex, exc_info=True)
        print(ex)
    result['health'] = es.cluster.health()
    result['stats'] = es.cluster.stats()
    return result

@app.route('/elastic/unhandled')
def elastic_unhandled():
    log.info('Database unhandled API called')
    es.search(index='abcd')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)