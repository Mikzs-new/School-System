from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

from datetime import timedelta

from shared.base_models.timestamped import TimeStampedModel

from apps.school.models.school import School

class SchoolYear(TimeStampedModel):
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255)

    start_date = models.DateField()
    end_date = models.DateField()

    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['school','name'],
                name='unique_school_year_per_school'
            ),
        )

    def clean(self):
        if self.start_date >= self.end_date: 
            raise ValidationError('Starting date must be before end date')
        if self.end_date - self.start_date > timedelta(days=365):
            raise ValidationError('School year duration is too long')
        if self.end_date - self.start_date < timedelta(days=100):
            raise ValidationError('School year duration is too short')
        

        if SchoolYear.objects.filter(
            school=self.school,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date
        ).exclude(pk=self.pk).exists():
            raise ValidationError('School year overlaps with another school')

    @property
    def is_current_school_year(self):
        date = timezone.localdate()
        return self.start_date <= date <= self.end_date 