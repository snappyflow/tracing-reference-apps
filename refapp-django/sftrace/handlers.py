import logging
from elasticapm.handlers.logging import Formatter

# we imported a custom Formatter from the Python Agent earlier
def get_logger():
    fh = logging.FileHandler('/var/log/snappyflow/sftrace.log')
    formatter = Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    fh.setFormatter(formatter)
    logging.getLogger().addHandler(fh)
    es_log = logging.getLogger()
    es_log.setLevel('INFO')
    return es_log