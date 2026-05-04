from django.db import models


class Registeration(models.Model):
    time_registered = models.DateTimeField(auto_created=True)
    name = models.CharField(max_length=255)
    school_id = models.IntegerField()
    complete_address = models.TextField(blank=True)
    email = models.EmailField()
    status = models.BooleanField(default=False)
    
    def __str__(self):
        return f'Registration: {self.name}'