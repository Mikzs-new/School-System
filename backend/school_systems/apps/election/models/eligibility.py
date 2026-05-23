from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

from apps.election.models.election import Election
from apps.election.models.partylist import Partylist

from apps.school.models.course import Course

from shared.base_models.timestamped import TimeStampedModel

class PartylistElection(TimeStampedModel):
    description = models.CharField(max_length=255, blank=True)
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='partylists',
    )
    partylist = models.ForeignKey(
        Partylist,
        on_delete=models.CASCADE,
        related_name='elections',
    )
    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )
    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','partylist'],
                name='unique_partylist_per_election'
            ),
        )

        indexes = [
            models.Index(fields=['election']),
            models.Index(fields=['partylist']),
        ]

class ElectionEligiblePosition(TimeStampedModel):
    title = models.CharField(max_length=255)
    seat_count = models.SmallIntegerField(validators=[MinValueValidator(1)])
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='positions'
    )
    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','title'],
                name='unique_position_per_election'
            ),
        )

    def __str__(self):
        return f'Title: {self.title} Count: {self.seat_count}'

class ElectionEligibleCourse(models.Model):
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='valid_courses'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )
    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','course'],
                name='unique_course_per_election'
            ),
        )

    def __str__(self):
        return f"{self.election} - {self.course}"

class ElectionEligibleYearLevel(models.Model):
    year_level = models.SmallIntegerField(validators=[MinValueValidator(1)])
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='valid_year_levels'
    )
    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )
    def __str__(self):
        return f'{self.election.__str__()} {self.year_level}'
    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','year_level'],
                name='unique_year_level_per_election'
            ),
        )

    def clean(self):
        if self.year_level > 12:
            raise ValidationError('Level is too high')