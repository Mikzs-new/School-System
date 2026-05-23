from django.db import models

from shared.base_models.timestamped import TimeStampedModel

class School(TimeStampedModel):
    name = models.CharField(max_length=255)
    school_id = models.CharField(max_length=255, blank=True, unique=True)

    country = models.CharField(max_length=255, blank=True)
    region = models.CharField(max_length=255, blank=True)
    province = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    barangay = models.CharField(max_length=255, blank=True)
    postal_code = models.CharField(max_length=255, blank=True)
    street = models.CharField(max_length=255, blank=True)

    email = models.EmailField()
    initials = models.CharField(max_length=25, blank=True)
    logo = models.ImageField(
        upload_to='',
        blank=True,
        null=True,
    )

    @property
    def complete_address(self):
        return f'{self.street}, {self.barangay}, {self.city}'

    def __str__(self):
        return f'{self.initials} {self.name}'