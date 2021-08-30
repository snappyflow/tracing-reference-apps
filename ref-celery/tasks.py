from celery import Celery

# <SFTRACE-CONFIG> add the below agent specific configuration
from sf_apm_lib.snappyflow import Snappyflow
from elasticapm import Client, instrument
from elasticapm.contrib.celery import register_exception_tracking, register_instrumentation
import os

from celery.signals import after_setup_logger
import logging
from elasticapm.handlers.logging import Formatter

logger = logging.getLogger(__name__)
logger.setLevel('INFO')

instrument()

try:
    # project_name = '' # Replace with appropriate snappyflow project name
    # app_name = '' # Replace with appropriate snappyflow app name
    # profile_key = '' # Replace Snappyflow Profile key

    project_name = os.getenv('PROJECT_NAME')
    app_name = os.getenv('APP_NAME')
    profile_key = os.getenv('SF_PROFILE_KEY')
    sf = Snappyflow()
    sf.init(profile_key, project_name, app_name)

    SFTRACE_CONFIG = sf.get_trace_config()
    #     'SERVER_URL': 'http://52.33.147.154:8200',
    apm_client = Client(service_name= 'python-celery', # Replace service name for tracing
                        server_url=  SFTRACE_CONFIG.get('SFTRACE_SERVER_URL'),
                        global_labels= SFTRACE_CONFIG.get('SFTRACE_GLOBAL_LABELS'),
                        verify_server_cert= SFTRACE_CONFIG.get('SFTRACE_VERIFY_SERVER_CERT'))
    register_exception_tracking(apm_client)
    register_instrumentation(apm_client)
except Exception as error:
    print("Error while fetching snappyflow tracing configurations", error)

# sfagent config finish

app = Celery('tasks', broker='redis://localhost:6379/0')


# Configure log correlation
@after_setup_logger.connect
def setup_loggers(logger, *args, **kwargs):
    fh = logging.FileHandler('python_celery.log') 

    # we imported a custom Formatter from the Python Agent earlier 
    formatter = Formatter("[%(asctime)s] [%(levelname)s] [%(message)s]", "%d/%b/%Y %H:%M:%S") 
    fh.setFormatter(formatter) 
    logger.addHandler(fh)

    # log = logging.getLogger()
    # log.setLevel('INFO')

@app.task
def add(x, y):
    logger.info('Add task called')
    return x + y

@app.task
def exception_example():
    logger.info('Excpetion example task called')
    try:
        1/0
    except ZeroDivisionError:
        ident = apm_client.capture_exception()

add.delay(10, 20)
exception_example.delay()