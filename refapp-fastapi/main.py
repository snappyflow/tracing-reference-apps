from typing import Optional
from fastapi import FastAPI
import logging 
import mysql.connector
# from elasticsearch.client import Elasticsearch
from elasticsearch import Elasticsearch

from elasticapm.handlers.logging import Formatter
from starlette.applications import Starlette
from elasticapm.contrib.starlette import make_apm_client, ElasticAPM
from sf_apm_lib.snappyflow import Snappyflow
import os

fh = logging.FileHandler('fastapi.log') 

# we imported a custom Formatter from the Python Agent earlier 
formatter = Formatter("[%(asctime)s] [%(levelname)s] [%(message)s]", "%d/%b/%Y %H:%M:%S") 
fh.setFormatter(formatter) 
logging.getLogger().addHandler(fh)

log = logging.getLogger()
log.setLevel('INFO')

project_name = os.getenv('SF_PROJECT_NAME')
app_name = os.getenv('SF_APP_NAME')
profile_key = os.getenv('SF_PROFILE_KEY')

sf = Snappyflow()
sf.init(profile_key, project_name, app_name)

SFTRACE_CONFIG = sf.get_trace_config()
trace_config = {
    'SERVICE_NAME': 'refapp-fastapi',
    'SERVER_URL': SFTRACE_CONFIG.get('SFTRACE_SERVER_URL'),
    'GLOBAL_LABELS': SFTRACE_CONFIG.get('SFTRACE_GLOBAL_LABELS'),
    'VERIFY_SERVER_CERT': SFTRACE_CONFIG.get('SFTRACE_VERIFY_SERVER_CERT'),
    'SPAN_FRAMES_MIN_DURATION': SFTRACE_CONFIG.get('SFTRACE_SPAN_FRAMES_MIN_DURATION'),
    'STACK_TRACE_LIMIT': SFTRACE_CONFIG.get('SFTRACE_STACK_TRACE_LIMIT'),
    'CAPTURE_SPAN_STACK_TRACES': SFTRACE_CONFIG.get('SFTRACE_CAPTURE_SPAN_STACK_TRACES'),
    'DEBUG': True,
    'METRICS_INTERVAL': '0s'
}
trace_config.update(SFTRACE_CONFIG)

apm = make_apm_client(trace_config)

app = FastAPI()

app.add_middleware(ElasticAPM, client=apm)


mysql_config = {
    'MYSQL_HOST': os.getenv('MYSQL_HOST'),
    'MYSQL_USERNAME': os.getenv('MYSQL_USERNAME'),
    'MYSQL_PASSWORD':os.getenv('MYSQL_PASSWORD'),
    'MYSQL_DATABASE': os.getenv('MYSQL_DATABASE')
}

elastic_config = {
    'ELASTIC_HOST': os.getenv('ELASTIC_HOST'),
    'ELASTIC_PORT': os.getenv('ELASTIC_PORT'),
    'ELASTIC_USERNAME': os.getenv('ELASTIC_USERNAME'),
    'ELASTIC_PASSWORD': os.getenv('ELASTIC_PASSWORD')
}

connection = None
es = None
# try:



@app.on_event("startup")
async def startup():
    print('Starting')
    global connection
    global es
    connection = mysql.connector.connect(
        host=mysql_config['MYSQL_HOST'],
        user=mysql_config['MYSQL_USERNAME'],
        passwd=mysql_config['MYSQL_PASSWORD'],
        database=mysql_config['MYSQL_DATABASE']
    )

    url = elastic_config['ELASTIC_HOST']
    http_auth= (elastic_config['ELASTIC_USERNAME'],
        elastic_config['ELASTIC_PASSWORD'])
    es = Elasticsearch([url], timeout=60,
        scheme="http", port=elastic_config['ELASTIC_PORT'], http_auth=http_auth)

@app.on_event("shutdown")
async def shutdown():
    print("Closing...")

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get('/database/handled')
async def database_api():
    log.info('Database handled API called')
    query = 'SELECT * FROM abcd;';
    cursor = connection.cursor()
    try:
        res = cursor.execute(query)
        print('res ', res)
    except Exception as e:
        print('exceptioon ', e)
        log.error('The error %s occurred', str(e), exc_info=True)
    return {'status': 'Success database'}
        

@app.get('/database/unhandled')
def database_unhandled():
    log.info('Database unhandled API called')
    query = 'SELECT * FROM abcd;';
    cursor = connection.cursor()
    res = cursor.execute(query)


@app.get('/elastic/handled')
async def elastic_api():
    log.info('Elastic handled API called')
    result = {'msg': 'Success elastic'}
    try:
        es.search(index='abcd')
        result['health'] = es.cluster.health()
        result['stats'] = es.cluster.stats()
    except Exception as ex:
        log.error('error %s', ex, exc_info=True)
        # print(ex)
    
    return result

@app.get('/elastic/unhandled')
def elastic_unhandled():
    log.info('Database unhandled API called')
    es.search(index='abcd')
