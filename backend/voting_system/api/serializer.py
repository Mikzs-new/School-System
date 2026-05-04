from rest_framework import serializers

from candidates.models import Candidate, Partylist
from elections.models import Election, Position, CourseValidItem, YearLevelValidItem
from facilitators.models import Facilitator
from schools.models import School
from students.models import Student, Course
from votes.models import Vote, VoteItem

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'

class SchoolCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        exclude = ['id']
    
    def validate_school_id(self, value):
        if School.objects.filter(school_id=value).exists():
            raise serializers.ValidationError('School Already Exists')
        return value

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        exclude = ['id']

    def validate(self, data):
        name = data.get('name')
        school = data.get('school')

        if Course.objects.filter(name=name, school=school).exists():
            raise serializers.ValidationError('Course Already Exists')
        
        return data

class StudentSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'student_school_id', 'school', 'course', 'year_level', 'email']

class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        exclude = '__all__'

    def validate_student_school_id(self, value):
        if Student.objects.filter(student_school_id=value).exists():
            raise serializers.ValidationError('Student Already Exists')
        return value

class FacilitatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = '__all__'

class FacilitatorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = '__all__'
    
    def validate(self, data):
        school_staff_id = data.get('school_staff_id')
        school = data.get('school')

        if Facilitator.objects.filter(school_staff_id=school_staff_id, school=school).exists():
            raise serializers.ValidationError('Staff Already Exists')
        return data

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = '__all__'

class PositionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = '__all__'
    
    def validate(self, data):
        election = data.get('election')
        title = data.get('title')

        if Position.objects.filter(election=election,title=title).exists():
            raise serializers.ValidationError('Position Already Exists')
        return data

class CourseValidItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseValidItem
        fields = '__all__'

class CourseValidItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseValidItem
        fields = '__all__'
    
    def validate(self, data):
        election = data.get('election')
        course = data.get('course')

        if CourseValidItem.objects.filter(election=election,course=course).exists():
            raise serializers.ValidationError('Election Valid Course Already Exists')
        return data

class YearLevelValidItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearLevelValidItem
        fields = '__all__'

class YearLevelValidItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearLevelValidItem
        fields = '__all__'

    def validate(self, data):
        year_level = data.get('year_level')
        election = data.get('election')

        if YearLevelValidItem.objects.filter(election=election,year_level=year_level).exists():
            raise serializers.ValidationError('Election Valid Year Level Already Exists')
        return data


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'

class CandidateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'
    
    def validate(self, data):
        student = data.get('student')
        election = data.get('election')

        if Candidate.objects.filter(student=student,election=election).exists():
            raise serializers.ValidationError('Election Candidate Already Exists')
        return data

class PartylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = '__all__'

class PartylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = '__all__'

    def validate(self, data):
        name = data.get('name')
        election = data.get('school')

        if Partylist.objects.filter(name=name,election=election).exists():
            raise serializers.ValidationError('Election Partylist Already Exists')
        return data

class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = '__all__'

class ElectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = '__all__'

class VoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteItem
        fields = '__all__'

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'

class VoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'
    
    def validate(self, data):
        student = data.get('student')
        election = data.get('election')

        if Vote.objects.filter(student=student,election=election).exists():
            raise serializers.ValidationError('Student already voted')
        return data



    
