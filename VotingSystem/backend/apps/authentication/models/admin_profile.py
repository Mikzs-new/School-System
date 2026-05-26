from django.db import models

class AdminProfile(models.Model):
    first_name = models.CharField(max_length=255)