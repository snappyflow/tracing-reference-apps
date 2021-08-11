from rest_framework.views import APIView, status
from django.http import JsonResponse
import requests
from elasticsearch6 import Elasticsearch
from django.conf import settings
import logging
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
# from sftrace.handlers import get_logger

log = logging.getLogger('application')
es_log = logging.getLogger('elasticapm')

class ElasticView(APIView):
    def __init__(self):
        self.es = None

    def connect(self):
        err = None
        try:
            url = '{}://{}:{}/'.format(settings.ELASTIC_PROTOCOL, settings.ELASTIC_HOST, settings.ELASTIC_PORT)
            if settings.ELASTIC_PROTOCOL == "https":
                if settings.ELASTIC_USERNAME != '':
                    self.es = Elasticsearch([url], use_ssl=True, verify_certs=False, scheme="https",
                        timeout=60, http_auth=(settings.ELASTIC_USERNAME, settings.ELASTIC_PASSWORD))
                else:
                    self.es = Elasticsearch([url], use_ssl=True, verify_certs=False, scheme="https",
                        timeout=60)
            else:
                url = "http://{}:{}".format(settings.ELASTIC_HOST, settings.ELASTIC_PORT)
                if settings.ELASTIC_USERNAME != '':
                    self.es = Elasticsearch([url], timeout=60,
                        http_auth=(settings.ELASTIC_USERNAME, settings.ELASTIC_PASSWORD))
                else:
                    self.es = Elasticsearch([url], timeout=60)
        except Exception as ex:
            print(ex)
            err = ex
        return err

    def get(self, request):
        es_log.info('Elastic api get call')
        err = self.connect()
        result = {'msg': 'Success elastic'}

        if not err:
            try:
                self.es.search(index='abcd')
            except Exception as ex:
                es_log.error('error %s', ex, exc_info=True)
            result['health'] = self.es.cluster.health()
            result['stats'] = self.es.cluster.stats()
        
        if self.es:
            return JsonResponse(result , status=status.HTTP_200_OK, safe=False)
        else:
            return JsonResponse({'status': 'error', 'error': str(err)} , status=status.HTTP_200_OK, safe=False)