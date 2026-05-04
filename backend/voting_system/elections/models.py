from django.db import models

from students.models import Course
from schools.models import School
from facilitators.models import Facilitator

class Election(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
    )
    created_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE
    )

    available = models.BooleanField()

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    def __str__(self):
        return self.school.__str__() + ' ' + self.name

class Position(models.Model):
    title = models.CharField(max_length=255)
    seat_count = models.SmallIntegerField()
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'Title: {self.title} Count: {self.seat_count}'
class CourseValidItem(models.Model):
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )
    def __str__(self):
        return self.election.__str__() + ' ' + self.course.__str__()

class YearLevelValidItem(models.Model):
    year_level = models.SmallIntegerField()
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
    )
    def __str__(self):
        return self.election.__str__() + ' ' + self.year_level