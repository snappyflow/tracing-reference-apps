from rest_framework.views import APIView, status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import mysql.connector
from mysql.connector import Error
import logging
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


log = logging.getLogger('application')
es_log = logging.getLogger('elasticapm')

class DatabaseUnhandledView(APIView):

    def create_mysql_connection(self):
        try:
            connection = mysql.connector.connect(
                host=settings.MYSQL_HOST,
                user=settings.MYSQL_USERNAME,
                passwd=settings.MYSQL_PASSWORD,
                database='sample'
            )
            print("Connection to MySQL DB successful")
            
        except Exception as e:
            err = e
            print(f"The error '{e}' occurred")
        return connection


    @csrf_exempt
    def get(self, request):
        es_log.info('Database api get call')
        result = {'status': 'Success database'}

        connection = self.create_mysql_connection()
        query = 'SELECT * FROM abcd;';
        cursor = connection.cursor()
        res = cursor.execute(query)
        if connection:
            return JsonResponse(result , status=status.HTTP_200_OK, safe=False)
        else:
            return JsonResponse({'status': 'error', 'msg': str(err)} , status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)        
