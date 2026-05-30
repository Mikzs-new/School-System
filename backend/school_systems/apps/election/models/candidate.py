from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from shared.base_models.timestamped import TimeStampedModel

from apps.student.models.student_enrollment import StudentEnrollment

from apps.election.models.election import Election
from apps.election.models.eligibility import PartylistElection, ElectionEligiblePosition

class Candidate(TimeStampedModel):
    student_enrollment = models.ForeignKey(
        StudentEnrollment,
        on_delete=models.CASCADE,
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='candidates'
    )
    position = models.ForeignKey(
        ElectionEligiblePosition,
        on_delete=models.CASCADE,
        related_name='candidates'
    )
    partylist = models.ForeignKey(
        PartylistElection,
        on_delete=models.CASCADE,
        related_name='candidates',
        null=True
    )
    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )
    image_file = models.ImageField(
        upload_to='',
        blank=True,
        null=True
    )

    description = models.TextField(blank=True)

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','student_enrollment'],
                name='unique_candidate_per_election'
            ),
        )

        indexes = [
            models.Index(fields=['position']),
            models.Index(fields=['partylist']),
            models.Index(fields=['election']),
        ]

    def clean(self):
        if self.election.school_year != self.student_enrollment.school_year:
            raise ValidationError('Student must belong to same school year as election')
        if self.election_id != self.position.election_id:
            raise ValidationError('Position must belong to same election')
        if self.partylist:
            if self.partylist.election_id != self.election_id:
                raise ValidationError('Partylist is not eligible for election')

    def __str__(self):
        return f'{self.election.__str__()} Candidate: {self.student_enrollment.__str__()}'