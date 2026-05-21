from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator

from school.models import School, Facilitator, Course, SchoolYear, SchoolYearStudentInfo

from datetime import timedelta

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
    end_datetime = models.DateTimeField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=ElectionStatus.choices,
        default=ElectionStatus.DRAFTED
    )

    class Meta:
        ordering = ['-start_datetime']

        constraints = (
            models.UniqueConstraint(
                fields=['school_year','name'],
                name='unique_election_per_school_year'
            )
        )

        indexes = [
            models.Index(fields=['school_year']),
            models.Index(fields=['start_datetime']),
            models.Index(fields=['status'])
        ]

    def clean(self):
        if self.start_datetime > self.end_datetime:
            raise ValidationError('Starting date must be before end date')

        duration =  self.end_datetime - self.start_datetime

        if duration > timedelta(hours=24):
            raise ValidationError('Election duration too long')
        
        if duration < timedelta(hours=1):
            raise ValidationError('Election duration too short')

        if (self.start_datetime.date() < self.school_year.start_date or self.end_datetime.date() > self.school_year.end_date):
            raise ValidationError('Election must be within school year')
    
    @property
    def is_active(self):
        if self.status != ElectionStatus.ENABLED:
            return False
        time = timezone.now()
        return (self.start_datetime <= time <= self.end_datetime)
    
    @property
    def has_started(self):
        return timezone.now() >= self.start_datetime
    
    def has_ended(self):
        return timezone.now() > self.end_datetime

    def __str__(self):
        return f'{self.school_year.school} {self.name}'
    

class Position(TimeStampedModel):
    title = models.CharField(max_length=255)
    seat_count = models.SmallIntegerField(validators=[MinValueValidator(1)])
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

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','course'],
                name='unique_course_per_election'
            )
        )

    def __str__(self):
        return f"{self.election} - {self.course}"

class YearLevelValidItem(models.Model):
    year_level = models.SmallIntegerField(validators=[MinValueValidator(1)])
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
    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['election','year_level'],
                name='unique_year_level_per_election'
            )
        )

class Partylist(models.Model):
    name = models.CharField(max_length=255)
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

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['school','name'],
                name='unique_partylist_per_school'
            )
        )

    def __str__(self):
        return f'Partylist: {self.name}'
    
class PartylistElection(models.Model):
    description = models.CharField(max_length=255, blank=True)
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
        constraints = (
            models.UniqueConstraint(
                fields=['election','partylist'],
                name='unique_partylist_per_election'
            )
        )

        indexes = [
            models.Index(fields=['election']),
            models.Index(fields=['partylist']),
            models.Index(fields=['school_year'])
        ]
        
    def clean(self):
        if self.school_year != self.election.school_year:
            raise ValidationError('Partylist must belong to same school year as election')

class Candidate(TimeStampedModel):
    student_info = models.ForeignKey(
        SchoolYearStudentInfo,
        on_delete=models.CASCADE,
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name='candidates'
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
    )
    partylist = models.ForeignKey(
        PartylistElection,
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

    def clean(self):
        if self.election.school_year != self.student_info.school_year:
            raise ValidationError('Student must belong to same school year as election')
        if self.election_id != self.position.election_id:
            raise ValidationError('Position must belong to same election')
        if not CourseValidItem.objects.filter(election=self.election,course=self.student_info.course).exists():
            raise ValidationError('Student is not eligible to become a candidate')
        if self.partylist:
            if self.partylist.election_id != self.election_id:
                raise ValidationError('Partylist is not eligible for election')

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
    vote_time = models.DateTimeField(auto_now=True)

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
    
    def clean(self):
        if self.student_info.school_year != self.election.school_year:
            raise ValidationError('Student is not eligible to vote')

class VoteItem(models.Model):
    vote = models.ForeignKey(
        Vote,
        on_delete=models.CASCADE,
        related_name='vote_items'
    )
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        null=True
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=['vote','candidate'],
                name='unique_candidate_per_vote'
            )
        )
    
    def clean(self):
        if self.position != self.candidate.position:
            raise ValidationError('Candidate does not belong to this position')
