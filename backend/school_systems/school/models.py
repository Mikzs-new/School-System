from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

from datetime import timedelta

User = get_user_model()

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Registration(TimeStampedModel):
    name = models.CharField(max_length=255)
    initials = models.CharField(max_length=25, blank=True)
    school_id = models.IntegerField()
    complete_address = models.TextField(blank=True)
    email = models.EmailField()
    status = models.BooleanField(default=False)
    
    def __str__(self):
        return f'Registration: {self.name}'

class School(TimeStampedModel):
    name = models.CharField(max_length=255)
    school_id = models.CharField(max_length=255, blank=True)

    country = models.CharField(max_length=255, blank=True)
    region = models.CharField(max_length=255, blank=True)
    province = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    barangay = models.CharField(max_length=255, blank=True)
    postal_code = models.CharField(max_length=255, blank=True)
    street = models.CharField(max_length=255, blank=True)

    email = models.EmailField()
    initials = models.CharField(max_length=25, blank=True)
    logo = models.ImageField(
        upload_to='',
        blank=True,
        null=True,
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['school_id'],
                name='unique_school_id_per_school'
            )
        )

    def clean(self):
        if School.objects.filter(initials=self.initials).exists():
            raise ValidationError('Initials is already taken')

    @property
    def complete_address(self):
        return f'{self.street}, {self.barangay}, {self.city}'

    def __str__(self):
        return self.name

class Facilitator(TimeStampedModel):
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

    class Meta:
        ordering = ['last_name','first_name']

        constraints = (
            models.UniqueConstraint(
                fields=['school','school_staff_id'],
                name='unique_facilitator_per_school'
            )
        )

        indexes = [
            models.Index(fields=['school_staff_id']),
            models.Index(fields=['school'])
        ]

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    def __str__(self):
        return self.first_name + ' ' + self.last_name

class SchoolYear(TimeStampedModel):
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255)

    start_date = models.DateField()
    end_date = models.DateField()

    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['school','name'],
                name='unique_school_year_per_school'
            )
        )

    def clean(self):
        if self.start_date >= self.end_date: 
            raise ValidationError('Starting date must be before end date')
        if self.end_date - self.start_date > timedelta(days=365):
            raise ValidationError('School year duration is too long')
        if self.end_date - self.start_date < timedelta(days=100):
            raise ValidationError('School year duration is too short')
        

        if SchoolYear.objects.filter(
            school=self.school,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date
        ).exclude(pk=self.pk).exists():
            raise ValidationError('School year overlaps with another school')

    @property
    def is_current_school_year(self):
        date = timezone.localdate()
        return self.start_date <= date <= self.end_date 
    
class Department(TimeStampedModel):
    name = models.CharField(max_length=255)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.name

class Course(TimeStampedModel):
    name = models.CharField(max_length=255)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='courses',
        null=True
    )
    
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    def __str__(self):
        return self.name

class Student(TimeStampedModel):
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
        related_name='students'
    )
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )

    class Meta:
        ordering = ['last_name','first_name']

        constraints = (
            models.UniqueConstraint(
                fields=['school','school_student_id'],
                name='unique_student_per_school'
            )
        )

        indexes = [
            models.Index(fields=['school']),
            models.Index(fields=['school_student_id']),
            models.Index(fields=['last_name'])
        ]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.first_name + ' ' + self.last_name
    
class SchoolYearStudentInfo(TimeStampedModel):
    school_year = models.ForeignKey(
        SchoolYear,
        on_delete=models.CASCADE
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )
    year_level = models.SmallIntegerField(validators=[MinValueValidator(1)])
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['school_year','student'],
                name='unique_student_info_per_school_year'
            )
        )

        indexes = [
            models.Index(fields=['school','student']),
            models.Index(fields=['year_level'])
        ]