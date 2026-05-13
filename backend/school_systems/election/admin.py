from django.contrib import admin

from .models import *

admin.site.register(Election)
admin.site.register(Position)
admin.site.register(Candidate)
admin.site.register(Vote)
admin.site.register(VoteItem)