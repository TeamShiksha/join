from rest_framework import serializers
from .models import UploadedImage

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'converted_image', 'uploaded_at']
        read_only_fields = ['converted_image', 'uploaded_at']
