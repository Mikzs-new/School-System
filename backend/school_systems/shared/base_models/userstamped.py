from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()

class UserChangesModel(models.Model):

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    class Meta:
        abstract = True