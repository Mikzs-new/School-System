from django.db import models

from django.contrib.auth import get_user_model

from apps.school.models.school import School
from shared.base_models.timestamped import TimeStampedModel

User = get_user_model()

class SchoolStaffProfile(TimeStampedModel):
    class StaffType(models.TextChoices):
        FACILITATOR = "facilitator", "Facilitator"
        ADMIN = "admin", "Admin"
        REGISTRAR = "registrar", "Registrar" 

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='school_staff_profile'
    )

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    school_staff_id = models.CharField(max_length=255)
    staff_type = models.CharField(
        max_length=20,
        choices=StaffType,
        default=StaffType.FACILITATOR
    )
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )

    class Meta:
        ordering = ['last_name','first_name']

        constraints = (
            models.UniqueConstraint(
                fields=['school','school_staff_id'],
                name='unique_facilitator_per_school'
            ),
        )

        indexes = [
            models.Index(fields=['school_staff_id']),
            models.Index(fields=['school'])
        ]

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    def __str__(self):
        return f'{self.staff_type} - {self.full_name}'