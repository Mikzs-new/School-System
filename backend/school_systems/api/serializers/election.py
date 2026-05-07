from rest_framework import serializers

from election.models import Election, Position, CourseValidItem, YearLevelValidItem, Candidate, Partylist, Vote, VoteItem

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
        fields = ['name','description','school','created_by','available','start_datetime','end_datetime']

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



    
