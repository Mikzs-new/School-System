from rest_framework import serializers

from school.models import Student, Course
from election.models import VoteItem, Candidate, Position, Partylist, Election, YearLevelValidItem, CourseValidItem

class SmallCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name']

class SmallPartylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['name']

class SmallStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['full_name']

class SmallPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['title']

class SmallElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name']

class SmallCandidateSerializer(serializers.ModelSerializer):
    student = SmallStudentSerializer(read_only=True)
    partylist = SmallPartylistSerializer(read_only=True)
    course = SmallCourseSerializer(read_only=True)

    class Meta:
        model = Candidate
        fields = ['student','course','year_level','partylist']

class VoteItemSerializer(serializers.ModelSerializer):
    candidate = SmallCandidateSerializer(read_only=True)
    position = SmallPositionSerializer(read_only=True)

    class Meta:
        model = VoteItem
        fields = ['id','candidate','position']

class CourseValidItemSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)

    class Meta:
        model = CourseValidItem
        fields = ['id','course']


class YearLevelValidItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearLevelValidItem
        fields = ['id','year_level']

    
