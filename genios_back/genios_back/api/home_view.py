from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

class HomeView(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        # ... your view logic ...
        data = {
            'version': '1.0.0',
            'name': 'Genios',
            'description': 'Genios API'
        }
        return Response(data)
