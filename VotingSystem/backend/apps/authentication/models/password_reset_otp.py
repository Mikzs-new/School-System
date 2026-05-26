from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
    )

    code = models.CharField(
        max_length=6,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    is_used = models.BooleanField(
        default=False,
    )

    @property
    def is_expired(self):
        return (
            timezone.now()
            > self.created_at + timedelta(minutes=5)
        )

    def __str__(self):
        return f'{self.user.username} - {self.code}'