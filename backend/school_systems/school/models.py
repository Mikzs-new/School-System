from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Registration(models.Model):
    time_registered = models.DateTimeField(auto_created=True)
    name = models.CharField(max_length=255)
    initials = models.CharField(max_length=25, null=True)
    school_id = models.IntegerField()
    complete_address = models.TextField(blank=True)
    email = models.EmailField()
    status = models.BooleanField(default=False)
    
    def __str__(self):
        return f'Registration: {self.name}'

class School(models.Model):
    name = models.CharField(max_length=255)
    school_id = models.IntegerField()
    complete_address = models.TextField(blank=True)
    email = models.EmailField()
    initials = models.CharField(max_length=25, null=True)
    logo = models.ImageField(
        upload_to='',
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.name
    
class Facilitator(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True
    )

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    school_staff_id = models.CharField(max_length=255)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    email = models.EmailField(null=True)
    created_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    def __str__(self):
        return self.first_name + ' ' + self.last_name
    
class Department(models.Model):
    name = models.CharField(max_length=255)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.name

class Course(models.Model):
    name = models.CharField(max_length=255)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        null=True
    )
    
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    def __str__(self):
        return self.name

class Student(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True
    )

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    school_student_id = models.CharField(max_length=255)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )
    year_level = models.SmallIntegerField()
    email = models.EmailField()

    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )
    created_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.first_name + ' ' + self.last_name