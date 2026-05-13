from django.contrib import admin

from .models import (
    Registration,
    School,
    Facilitator,
    Department,
    Course,
    Student,
)

admin.site.register(Registration)
admin.site.register(School)
admin.site.register(Facilitator)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Student)