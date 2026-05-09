from django.db import models

from school.models import School, Student, Facilitator, Course

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
        related_name='positions'
    )

    def __str__(self):
        return f'Title: {self.title} Count: {self.seat_count}'
    
class CourseValidItem(models.Model):
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='valid_courses'
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
        related_name='valid_year_levels'
    )
    def __str__(self):
        return f'{self.election.__str__()} {self.year_level}'

class Partylist(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='partylists'
    )
    def __str__(self):
        return f'{self.election.__str__()} Partylist: {self.name}'

class Candidate(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='candidate'
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='candidates'
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name='candidate'
    )
    partylist = models.ForeignKey(
        Partylist,
        on_delete=models.CASCADE,
        related_name='candidates',
        null=True
    )
    image_file = models.ImageField(
        upload_to='',
        blank=True,
        null=True
    )

    year_level = models.SmallIntegerField(default=0)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        null=True
    )

    description = models.TextField(blank=True)

    def __str__(self):
        return f'{self.election.__str__()} Candidate: {self.student.__str__()}'

class Vote(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    year_level = models.SmallIntegerField(default=0)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        null=True
    )

class VoteItem(models.Model):
    vote = models.ForeignKey(
        Vote,
        on_delete=models.CASCADE,
        related_name='vote_items'
    )
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
    )
