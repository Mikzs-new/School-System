from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from shared.base_models.timestamped import TimeStampedModel

from apps.school.models.school_year import SchoolYear

from datetime import timedelta

class ElectionStatus(models.TextChoices):
    ENABLED = 'enabled', 'Enabled'
    PAUSED = 'paused', 'Paused'
    CANCELLED = 'cancelled', 'Cancelled'
    HIDDEN = 'hidden', 'Hidden'
    DRAFTED = 'drafted', 'Drafted'

class Election(TimeStampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    school_year = models.ForeignKey(
        SchoolYear,
        on_delete=models.CASCADE,
        null=True
    )
    # created_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE
    # )

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=ElectionStatus.choices,
        default=ElectionStatus.DRAFTED
    )

    class Meta:
        ordering = ['-start_datetime']

        constraints = (
            models.UniqueConstraint(
                fields=['school_year','name'],
                name='unique_election_per_school_year'
            ),
        )

        indexes = [
            models.Index(fields=['school_year']),
            models.Index(fields=['start_datetime']),
            models.Index(fields=['status'])
        ]

    def clean(self):
        if self.start_datetime > self.end_datetime:
            raise ValidationError('Starting date must be before end date')

        duration =  self.end_datetime - self.start_datetime

        if duration > timedelta(hours=24):
            raise ValidationError('Election duration too long')
        
        if duration < timedelta(hours=1):
            raise ValidationError('Election duration too short')

        if (self.start_datetime.date() < self.school_year.start_date or self.end_datetime.date() > self.school_year.end_date):
            raise ValidationError('Election must be within school year')
    
    @property
    def is_editable(self):
        return self.status == ElectionStatus.DRAFTED

    @property
    def is_active(self):
        if self.status != ElectionStatus.ENABLED:
            return False
        time = timezone.now()
        return (self.start_datetime <= time <= self.end_datetime)
    
    @property
    def has_started(self):
        return timezone.now() >= self.start_datetime
    
    def has_ended(self):
        return timezone.now() > self.end_datetime

    def __str__(self):
        return f'{self.school_year.school} {self.name}'