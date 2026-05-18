from django.contrib import admin

from .models import Student, School, Facilitator, Course, Department

admin.site.register(School)
admin.site.register(Facilitator)
admin.site.register(Student)
admin.site.register(Course)
admin.site.register(Department)