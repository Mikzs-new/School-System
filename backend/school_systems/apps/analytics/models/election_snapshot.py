from django.db import models

from apps.election.models import Election

class ElectionAnalyticsSnapshot(models.Model):
    election = models.OneToOneField(
        Election,
        on_delete=models.CASCADE
    )

    total_eligible_vote = models.IntegerField(default=0)

    total_votes = models.IntegerField(default=0)

    turnout_percentage = models.FloatField(default=0)

    abstained_students = models.IntegerField(default=0)

    generated_at = models.DateTimeField(auto_now_add=True)
