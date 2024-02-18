import logging
import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import requests
import pandas as pd

## get api url of .env
load_dotenv()
API_URL = os.getenv('API_URL')
headers = {'Authorization': 'Bearer ' + os.getenv('TOKEN')}


def transform_response_sentiment(response, limit):
    transformed_response = []
    neutral = 0
    positive = 0
    negative = 0
    for item in response:
        transformed_item = {}
        for property_item in item:
            transformed_item[property_item['label']] = property_item['score']
            if property_item['label'] == 'NEU':
                neutral = neutral + property_item['score']
            if property_item['label'] == 'POS':
                positive = positive + property_item['score']
            if property_item['label'] == 'NEG':
                negative = negative + property_item['score']

        transformed_response.append(transformed_item)
    return {
        'results': transformed_response,
        'NEU': neutral/limit,
        'POS': positive/limit,
        'NEG': negative/limit
    }


def transform_response_emotion(response, limit):
    transform_response = {
        'results': [],
        'anger': 0,
        'disgust': 0,
        'joy': 0,
        'fear': 0,
        'surprise': 0,
        'sadness': 0,
        'others': 0
    }
    for item in response:
        transformed_item = {}
        for property_item in item:
            label = property_item['label']
            transformed_item[label] = property_item['score']
            transform_response[label] += property_item['score']

        transform_response['results'].append(transformed_item)

    for key in transform_response:
        if key in ['anger', 'disgust', 'joy', 'fear', 'surprise', 'sadness', 'others']:
            transform_response[key] = transform_response[key] / limit

    return transform_response


class UploadFileView(APIView):
    parser_classes = (MultiPartParser,)
    renderer_classes = [JSONRenderer]

    def get(self, request):
        data = {
            'success': True
        }
        return Response(data)

    def post_interaction(self, request, *args, **kwargs):
        try:
            file = request.FILES['file']
            limit = request.POST.get('limit', 200)
            offset = request.POST.get('offset', 0)
            # Leer el archivo CSV y procesarlo
            df = pd.read_csv(file)
            df.head()
            likes = 0
            comments = 0
            shares = 0
            reactions = 0
            for index, row in df.iterrows():

                if index < int(offset):
                    continue

                if index >= int(offset) + int(limit):
                    break

                likes += row['likes']
                comments += row['comments']
                shares += row['shares']
                reactions += row['reactions_count']

            return Response({
                'success': True,
                'data': {
                    'likes': likes,
                    'comments': comments,
                    'shares': shares,
                    'reactions': reactions
                }
            })

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            })

    def post_emotion(self, request, *args, **kwargs):
        try:
            file = request.FILES['file']
            limit = request.POST.get('limit', 200)
            offset = request.POST.get('offset', 0)
            # Leer el archivo CSV y procesarlo
            df = pd.read_csv(file)
            df.head()

            inputs = []
            for index, row in df.iterrows():

                if index < int(offset):
                    continue

                if index >= int(offset) + int(limit):
                    break

                inputs.append(row['text'])

            try:
                data = {
                    'inputs': inputs
                }
                response = requests.post(API_URL+"/beto-emotion-analysis", json=data, headers=headers)
                data_json = response.json()

                if response.status_code == 200:
                    results = transform_response_emotion(data_json, int(limit))
                    return Response({
                        'success': True,
                        'data': results
                    })
                else:
                    return Response({
                        'success': False,
                        'error': data_json
                    })
            except Exception as e:
                logging.info("Error UPLOAD: ", e)
                return Response({
                    'success': False,
                    'error': str(e)
                })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            })

    def post_sentiment(self, request, *args, **kwargs):
        try:
            file = request.FILES['file']
            limit = request.POST.get('limit', 200)
            offset = request.POST.get('offset', 0)
            # Leer el archivo CSV y procesarlo
            df = pd.read_csv(file)
            df.head()

            inputs = []
            for index, row in df.iterrows():

                if index < int(offset):
                    continue

                if index >= int(offset) + int(limit):
                    break

                inputs.append(row['text'])

            try:
                data = {
                    'inputs': inputs
                }
                response = requests.post(API_URL+'/beto-sentiment-analysis', json=data, headers=headers)
                data_json = response.json()

                if response.status_code == 200:
                    results = transform_response_sentiment(data_json, int(limit))
                    return Response({
                        'success': True,
                        'data': results
                    })
                else:
                    return Response({
                        'success': False,
                        'error': data_json
                    })
            except Exception as e:
                logging.info("Error UPLOAD: ", e)
                return Response({
                    'success': False,
                    'error': str(e)
                })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            })


    def post(self, request, *args, **kwargs):
        if request.path == '/analysis/interaction/':
            return self.post_interaction(request, *args, **kwargs)
        elif request.path == '/analysis/emotion/':
            return self.post_emotion(request, *args, **kwargs)
        elif request.path == '/analysis/sentiment/':
            return self.post_sentiment(request, *args, **kwargs)
        else:
            return Response({
                'success': False,
                'error': 'PATH not found'
            })
