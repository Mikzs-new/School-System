from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()

class AuditLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    action = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    changes = models.JSONField()
    time = models.DateTimeField(auto_now=True)