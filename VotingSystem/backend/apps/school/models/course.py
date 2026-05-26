from django.db import models

from shared.base_models.timestamped import TimeStampedModel

from apps.school.models.school import School
from apps.school.models.department import Department

class Course(TimeStampedModel):
    name = models.CharField(max_length=255)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='courses',
    )
    initials = models.CharField(max_length=15, blank=True)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['name','department'],
                name='unique_course_per_department'
            ),
        )
    
    def __str__(self):
        return self.name