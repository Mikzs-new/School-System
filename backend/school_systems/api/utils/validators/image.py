from PIL import Image
from rest_framework import serializers

MAX_IMAGE_SIZE = 5 * 1024 * 1024

ALLOWED_IMAGE_TYPES = ['image/png','image/jpg']

def validate_image(image):
    if image.size > MAX_IMAGE_SIZE:
        raise serializers.ValidationError('Image too large')
    
    if image.content_type not in MAX_IMAGE_SIZE:
        raise serializers.ValidationError('Invalid image type')
    
    try:
        img = Image.open(image)
        img.verify()
    
    except Exception:
        raise serializers.ValidationError('Corrupted image')

    return image
