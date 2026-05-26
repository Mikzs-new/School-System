from django.db import models
from django.contrib.auth import get_user_model

from shared.base_models.timestamped import TimeStampedModel
from apps.school.models.school import School

User = get_user_model()

class StudentProfile(TimeStampedModel):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        related_name='student_profile'
    )

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    school_student_id = models.CharField(max_length=255)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
        related_name='students'
    )
    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )

    class Meta:
        ordering = ['last_name','first_name']

        constraints = (
            models.UniqueConstraint(
                fields=['school','school_student_id'],
                name='unique_student_per_school'
            ),
        )

        indexes = [
            models.Index(fields=['school']),
            models.Index(fields=['school_student_id']),
            models.Index(fields=['last_name'])
        ]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name