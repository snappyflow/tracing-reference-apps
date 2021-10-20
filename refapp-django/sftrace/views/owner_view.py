from rest_framework.views import APIView, status
from django.http import JsonResponse
import requests
from django.conf import settings

class OwnerView(APIView):

    def post(self, request, owner_id):
        print('Owner id ', owner_id)
        return JsonResponse({'msg': 'OK'} , status=status.HTTP_200_OK, safe=False)
