from django.contrib.auth.models import Group

def get_student_group():
    return Group.objects.get(name='Student')

def get_facilitator_group():
    return Group.objects.get(name='Facilitator')