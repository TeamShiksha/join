from django.db import models


class UploadedImage(models.Model):
    image = models.ImageField(upload_to='originals/')
    converted_image = models.ImageField(upload_to='converted/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
