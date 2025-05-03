from rest_framework import generics, mixins
from rest_framework.response import Response
from django.core.files.base import ContentFile
from PIL import Image
from io import BytesIO
from .models import UploadedImage
from .serializers import UploadedImageSerializer
from django.views.generic import TemplateView

class ImageUploadAPIView(generics.CreateAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer

image_upload_view = ImageUploadAPIView.as_view()

class ConvertImageAPIView(generics.UpdateAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.image:
            img = Image.open(instance.image)
            img = img.resize((512, 512))

            buffer = BytesIO()
            img.save(fp=buffer, format='JPEG')
            file_name = f"converted_{instance.id}.jpg"
            instance.converted_image.save(file_name, ContentFile(buffer.getvalue()), save=True)

convert_image_view = ConvertImageAPIView.as_view()

class UploadedImageListAPIView(generics.ListAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer

uploaded_images_list_view = UploadedImageListAPIView.as_view()

class DownloadConvertedImageAPIView(generics.RetrieveAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.converted_image:
            from django.http import FileResponse
            return FileResponse(instance.converted_image.open(), content_type='image/jpeg')
        return Response({"detail": "Converted image not found."}, status=404)

download_converted_image_view = DownloadConvertedImageAPIView.as_view()

class FrontendView(TemplateView):
    template_name = "imageucgd/client.html"