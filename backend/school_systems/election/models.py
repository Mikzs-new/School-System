from django.db import models

from school.models import School, Student, Facilitator, Course, SchoolYear, SchoolYearStudentInfo

from django.utils import timezone

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_noew=True)

    class Meta:
        abstract = True

class ElectionStatus(models.TextChoices):
    ENABLED = 'enabled', 'Enabled'
    PAUSED = 'paused', 'Paused'
    CANCELLED = 'cancelled', 'Cancelled'
    HIDDEN = 'hidden', 'Hidden'
    DRAFTED = 'drafted', 'Drafted'

class Election(TimeStampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    school_year = models.ForeignKey(
        SchoolYear,
        on_delete=models.CASCADE,
        null=True
    )
    created_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE
    )

    start_datetime = models.DateTimeField()
    duration = models.DurationField(null=True)

    status = models.CharField(
        max_length=20,
        choices=ElectionStatus.choices,
        default=ElectionStatus.DRAFTED
    )

    class Meta:
        ordering = ['-start_datetime']

        indexes = [
            models.Index(fields=['school_year']),
            models.Index(fields=['start_datetime']),
            models.Index(fields=['status'])
        ]

    @property
    def end_datetime(self):
        return self.start_datetime + self.duration
    
    @property
    def is_active(self):
        time = timezone.now()
        return (self.start_datetime <= time <= self.end_datetime)

    def __str__(self):
        return self.school.__str__() + ' ' + self.name
    

class Position(TimeStampedModel):
    title = models.CharField(max_length=255)
    seat_count = models.SmallIntegerField()
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='positions'
    )
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','title'],
                name='unique_position_per_election'
            )
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
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )
    def __str__(self):
        return f"{self.election} - {self.course}"

class YearLevelValidItem(models.Model):
    year_level = models.SmallIntegerField()
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='valid_year_levels'
    )
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )
    def __str__(self):
        return f'{self.election.__str__()} {self.year_level}'

class Partylist(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
        null=True
    )
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )
    def __str__(self):
        return f'Partylist: {self.name}'
    
class PartylistElection(models.Model):
    school_year = models.ForeignKey(
        SchoolYear,
        on_delete=models.CASCADE,
        null=True
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='partylists',
    )
    partylist = models.ForeignKey(
        Partylist,
        on_delete=models.CASCADE,
        related_name='elections',
    )
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )
    class Meta:
        indexes = [
            models.Index(fields=['election']),
            models.Index(fields=['partylist']),
            models.Index(fields=['school_year'])
        ]

class Candidate(TimeStampedModel):
    student_info = models.ForeignKey(
        SchoolYearStudentInfo,
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
    added_by = models.ForeignKey(
        Facilitator,
        on_delete=models.CASCADE,
        null=True
    )
    image_file = models.ImageField(
        upload_to='',
        blank=True,
        null=True
    )

    description = models.TextField(blank=True)

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','student_info'],
                name='unique_candidate_per_election'
            )
        )

        indexes = [
            models.Index(fields=['position']),
            models.Index(fields=['partylist']),
            models.Index(fields=['election']),
        ]

    def __str__(self):
        return f'{self.election.__str__()} Candidate: {self.student_info.__str__()}'

class Vote(models.Model):
    student_info = models.ForeignKey(
        SchoolYearStudentInfo,
        on_delete=models.CASCADE,
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    vote_time = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['-vote_time']

        constraints = (
            models.UniqueConstraint(
                fields=['election','student_info'],
                name='unique_student_vote_per_election'
            )
        )

        indexes = [
            models.Index(fields=['vote_time']),
            models.Index(fields=['election']),
        ]

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
