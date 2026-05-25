from django.db import models

from apps.election.models import Candidate

from shared.base_models.timestamped import TimeStampedModel

class CandidateAnalyticsSnapshot(TimeStampedModel):
    candidate = models.OneToOneField(
        Candidate,
        on_delete=models.CASCADE
    )

    total_votes = models.IntegerField(default=0)

    vote_percentage = models.FloatField(default=0)
 
    ranking = models.IntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)