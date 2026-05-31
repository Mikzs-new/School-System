from django.db import models

from apps.school.models.school import School

from shared.base_models.timestamped import TimeStampedModel

class Partylist(TimeStampedModel):
    name = models.CharField(max_length=255)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
        null=True
    )
    initials = models.CharField(max_length=20, blank=True)
    # added_by = models.ForeignKey(
    #     Facilitator,
    #     on_delete=models.CASCADE,
    #     null=True
    # )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['school','name'],
                name='unique_partylist_per_school'
            ),
        )

    def __str__(self):
        return f'Partylist: {self.name}'