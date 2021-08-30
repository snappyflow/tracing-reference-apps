import requests
import time
import elasticapm
import logging 
from elasticapm.handlers.logging import Formatter
from sf_apm_lib.snappyflow import Snappyflow
import os

# in app.py 
fh = logging.FileHandler('python_sciprt_trace.log') 

# we imported a custom Formatter from the Python Agent earlier 
formatter = Formatter("[%(asctime)s] [%(levelname)s] [%(message)s]", "%d/%b/%Y %H:%M:%S") 
fh.setFormatter(formatter) 
logging.getLogger().addHandler(fh)

log = logging.getLogger()
log.setLevel('INFO')

def main():
    sess = requests.Session()
    for url in [ 'https://www.elastic.co', 'https://benchmarks.elastic.co' ]:
        resp = sess.get(url)
        time.sleep(1)

if __name__ == '__main__':

    project_name = os.getenv('PROJECT_NAME') #'sftrace'
    app_name = os.getenv('APP_NAME') #'reference-apps'
    profile_key = os.getenv('SF_PROFILE_KEY')
    sf = Snappyflow()
    sf.init(profile_key, project_name, app_name)
    trace_config = sf.get_trace_config()

    client = elasticapm.Client(service_name="python-script",
        server_url=trace_config.get('SFTRACE_SERVER_URL'),
        verify_cert=trace_config['SFTRACE_VERIFY_SERVER_CERT'],
        global_labels=trace_config['SFTRACE_GLOBAL_LABELS']
    )
    
    elasticapm.instrument()  # Only call this once, as early as possible.
    client.begin_transaction(transaction_type="script")
    log.info('Begin transaction')
    main()
    # Record an exception
    try:
        1/0
    except ZeroDivisionError:
        pass
        ident = client.capture_exception()
        print ("Exception caught; reference is %s" % ident)
        log.error('Error ', exc_info=True)

    log.info('End transaction')
    client.end_transaction(name=__name__, result="success")