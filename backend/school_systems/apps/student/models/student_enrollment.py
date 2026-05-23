from django.db import models
from django.core.validators import MinValueValidator
from shared.base_models.timestamped import TimeStampedModel

from apps.school.models.school_year import SchoolYear
from apps.school.models.course import Course
from apps.authentication.models.student_profile import StudentProfile

class StudentEnrollment(TimeStampedModel):
    school_year = models.ForeignKey(
        SchoolYear,
        on_delete=models.CASCADE,
        related_name='enrollment'
    )
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='school_years'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )
    year_level = models.SmallIntegerField(validators=[MinValueValidator(1)])
    # added_by = models.ForeignKey(
    #     ,
    #     on_delete=models.CASCADE,
    #     null=True
    # )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['school_year','student'],
                name='unique_student_enrollment_per_school_year'
            ),
        )

        indexes = [
            models.Index(fields=['school_year','student']),
            models.Index(fields=['year_level'])
        ]