from django.urls import path
from .views import (
    image_upload_view,
    convert_image_view,
    uploaded_images_list_view,
    download_converted_image_view,
    FrontendView,
)

urlpatterns = [
    path('upload/', image_upload_view, name='upload-image'),
    path('convert/<int:pk>/', convert_image_view, name='convert-image'),
    path('images/', uploaded_images_list_view, name='list-images'),
    path('download/<int:pk>/', download_converted_image_view, name='download-converted-image'),
    path('', FrontendView.as_view(), name='home'),
]
