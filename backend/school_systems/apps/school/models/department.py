from django.db import models

from shared.base_models.timestamped import TimeStampedModel

from apps.school.models.school import School

class Department(TimeStampedModel):
    name = models.CharField(max_length=255, unique=True)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    initials = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.name