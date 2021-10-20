from os import times
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import requests
from django.conf import settings
import random
import json
import logging
import time

log = logging.getLogger("commands")

class Server1(APIView):
    def post(self, request):
        try:
            result = []
            sleep_val = random.randint(10,300)
            status_list = [status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR, status.HTTP_400_BAD_REQUEST]
            status_data =random.choice(status_list)
            if status_data != status.HTTP_200_OK:
                time.sleep(sleep_val/1000)
                return Response({}, status=status_data)
            log.info("Request body %s",request.body)
            data = json.loads(request.body)
            if data:
                time.sleep(sleep_val/1000)
                return Response(data, status=status_data)
            num1 = random.randint(1,5)
            num2 = random.randint(1,5)
            if num1 == num2:
                num2 = (num2+1) % 5
            num_list = [num1, num2]
            for num in num_list:
                url = "http://" + settings.HOST_URL + ":" + settings.HOST_PORT + "/app1/ser" + str(num)
                payload = {"service" : "ser"+str(num)}
                response = requests.post(url, data = json.dumps(payload), verify=False)
                response = response.json()
                result.append(response)
                response = "PROJ 2 APP 1 SER" + str(num) + " called"
                result.append(response)
            #time.sleep(sleep_val/1000)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as err:
            log.error(str(err), exc_info=True)
            result = {"error": str(err)}
            return Response(result,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Server2(APIView):
    def post(self, request):
        try:
            result = []
            sleep_val = random.randint(10,300)
            status_list = [status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR, status.HTTP_400_BAD_REQUEST]
            status_data =random.choice(status_list)
            if status_data != status.HTTP_200_OK:
                time.sleep(sleep_val/1000)
                return Response({}, status=status_data)
            log.info("Request body %s",request.body)
            data = json.loads(request.body)
            if data:
                time.sleep(sleep_val/1000)
                return Response(data, status=status_data)
            num1 = random.randint(1,5)
            num2 = random.randint(1,5)
            if num1 == num2:
                num2 = (num2+1) % 5
            num_list = [num1, num2]
            for num in num_list:
                url = "http://" + settings.HOST_URL + ":" + settings.HOST_PORT + "/app1/ser" + str(num)
                payload = {"service" : "ser"+str(num)}
                response = requests.post(url, data = json.dumps(payload), verify=False)
                response = response.json()
                result.append(response)
                response = "PROJ 2 APP 1 SER" + str(num) + " called"
                result.append(response)
            time.sleep(sleep_val/1000)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as err:
            log.error(str(err), exc_info=True)
            result = {"error": str(err)}
            return Response(result,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Server3(APIView):
    def post(self, request):
        try:
            result = []
            sleep_val = random.randint(10,300)
            status_list = [status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR, status.HTTP_400_BAD_REQUEST]
            status_data =random.choice(status_list)
            if status_data != status.HTTP_200_OK:
                time.sleep(sleep_val/1000)
                return Response({}, status=status_data)
            log.info("Request body %s",request.body)
            data = json.loads(request.body)
            if data:
                time.sleep(sleep_val/1000)
                return Response(data, status=status_data)
            num1 = random.randint(1,5)
            num2 = random.randint(1,5)
            if num1 == num2:
                num2 = (num2+1) % 5
            num_list = [num1, num2]
            for num in num_list:
                url = "http://" + settings.HOST_URL + ":" + settings.HOST_PORT + "/app1/ser" + str(num)
                payload = {"service" : "ser"+str(num)}
                response = requests.post(url, data = json.dumps(payload), verify=False)
                response = response.json()
                result.append(response)
                response = "PROJ 2 APP 1 SER" + str(num) + " called"
                result.append(response)
            time.sleep(sleep_val/1000)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as err:
            log.error(str(err), exc_info=True)
            result = {"error": str(err)}
            return Response(result,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Server4(APIView):
    def post(self, request):
        try:
            result = []
            sleep_val = random.randint(10,300)
            status_list = [status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR, status.HTTP_400_BAD_REQUEST]
            status_data =random.choice(status_list)
            if status_data != status.HTTP_200_OK:
                time.sleep(sleep_val/1000)
                return Response({}, status=status_data)
            log.info("Request body %s",request.body)
            data = json.loads(request.body)
            if data:
                time.sleep(sleep_val/1000)
                return Response(data, status=status_data)
            num1 = random.randint(1,5)
            num2 = random.randint(1,5)
            if num1 == num2:
                num2 = (num2+1) % 5
            num_list = [num1, num2]
            for num in num_list:
                url = "http://" + settings.HOST_URL + ":" + settings.HOST_PORT + "/app1/ser" + str(num)
                payload = {"service" : "ser"+str(num)}
                response = requests.post(url, data = json.dumps(payload), verify=False)
                response = response.json()
                result.append(response)
                response = "PROJ 2 APP 1 SER" + str(num) + " called"
                result.append(response)
            #time.sleep(sleep_val/1000)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as err:
            log.error(str(err), exc_info=True)
            result = {"error": str(err)}
            return Response(result,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Server5(APIView):
    def post(self, request):
        try:
            result = []
            sleep_val = random.randint(10,300)
            status_list = [status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR, status.HTTP_400_BAD_REQUEST]
            status_data =random.choice(status_list)
            if status_data != status.HTTP_200_OK:
                time.sleep(sleep_val/1000)
                return Response({}, status=status_data)
            log.info("Request body %s",request.body)
            data = json.loads(request.body)
            if data:
                time.sleep(sleep_val/1000)
                return Response(data, status=status_data)
            num1 = random.randint(1,5)
            num2 = random.randint(1,5)
            if num1 == num2:
                num2 = (num2+1) % 5
            num_list = [num1, num2]
            for num in num_list:
                url = "http://" + settings.HOST_URL + ":" + settings.HOST_PORT + "/app1/ser" + str(num)
                payload = {"service" : "ser"+str(num)}
                response = requests.post(url, data = json.dumps(payload), verify=False)
                response = response.json()
                result.append(response)
                response = "PROJ 2 APP 1 SER" + str(num) + " called"
                result.append(response)
            time.sleep(sleep_val/1000)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as err:
            log.error(str(err), exc_info=True)
            result = {"error": str(err)}
            return Response(result,status=status.HTTP_500_INTERNAL_SERVER_ERROR)