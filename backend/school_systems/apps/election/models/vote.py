from django.db import models
from django.core.exceptions import ValidationError

from apps.election.models.election import Election
from apps.election.models.eligibility import ElectionEligiblePosition
from apps.election.models.candidate import Candidate

from apps.student.models.student_enrollment import StudentEnrollment


class Vote(models.Model):
    student_enrollment = models.ForeignKey(
        StudentEnrollment,
        on_delete=models.CASCADE,
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    vote_time = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-vote_time']

        constraints = (
            models.UniqueConstraint(
                fields=['election','student_enrollment'],
                name='unique_student_vote_per_election'
            ),
        )

        indexes = [
            models.Index(fields=['vote_time']),
            models.Index(fields=['election']),
        ]
    
    def clean(self):
        if self.student_enrollment.school_year != self.election.school_year:
            raise ValidationError('Student is not eligible to vote')
        
class VoteItem(models.Model):
    vote = models.ForeignKey(
        Vote,
        on_delete=models.CASCADE,
        related_name='vote_items'
    )
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        null=True
    )
    position = models.ForeignKey(
        ElectionEligiblePosition,
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['vote','candidate'],
                name='unique_candidate_per_vote'
            ),
        )
    
    def clean(self):
        if self.position != self.candidate.position:
            raise ValidationError('Candidate does not belong to this position')
