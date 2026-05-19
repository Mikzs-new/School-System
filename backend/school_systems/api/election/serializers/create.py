from rest_framework import serializers

from election.models import Election, Position, CourseValidItem, YearLevelValidItem, Candidate, Partylist, Vote, PartylistElection

from api.utils.validators.image import validate_image

class PositionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['title','seat_count','election']
    
    def validate(self, data):
        election = data.get('election')
        title = data.get('title')

        if Position.objects.filter(election=election,title=title).exists():
            raise serializers.ValidationError('Position Already Exists')
        return data

class CourseValidItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseValidItem
        fields = ['course','election']
    
    def validate(self, data):
        election = data.get('election')
        course = data.get('course')

        if CourseValidItem.objects.filter(election=election,course=course).exists():
            raise serializers.ValidationError('Election Valid Course Already Exists')
        return data

class YearLevelValidItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearLevelValidItem
        fields = ['year_level','election']

    def validate(self, data):
        year_level = data.get('year_level')
        election = data.get('election')

        if YearLevelValidItem.objects.filter(election=election,year_level=year_level).exists():
            raise serializers.ValidationError('Election Valid Year Level Already Exists')
        return data

class CandidateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ['student','election','partylist','position','image']
    
    def validate(self, data):
        student = data.get('student')
        election = data.get('election')
        position = data.get('position')
        image = data.get('image')

        if image:
            validate_image(image)

        if Candidate.objects.filter(student=student,election=election).exists():
            raise serializers.ValidationError('Election Candidate Already Exists')
        if position.election != election:
            raise serializers.ValidationError('Position does not belong to this election')
        return data

class PartylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['name','description']

    def validate(self, data):
        name = data.get('name')
        request = data.context.get('request')
        school = request.user.facilitator.school
        if Partylist.objects.filter(name=name,school=school).exists():
            raise serializers.ValidationError('Partylist Already Exists')
        return data
    
class PartylistElectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartylistElection
        fields = ['partylist','election']
    
    def validate(self, data):
        request = data.context.get('request')
        school = request.user.facilitator.school

        election = data.get('election')
        partylist = data.get('partylist')

        if school != partylist or school != election.school:
            raise serializers.ValidationError('Using wrong data')
        elif PartylistElection.objects.filter(election=election,partylist=partylist).exists():
            raise serializers.ValidationError('Partylist already added to election')

        return data

class ElectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name','description','available','start_datetime','duration']

    def validate(self, data):
        user = data.get('request')
        school = user.facilitator.school
        name = data.get('name')
        if Election.objects.filter(school=school,name=name).exists():
            raise serializers.ValidationError('Election already exists')
        return data

class VoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['election']
    
    def validate(self, data):
        request = self.context.get('request')
        student = request.user.student
        election = data.get('election')

        if Vote.objects.filter(student=student,election=election).exists():
            raise serializers.ValidationError('Student already voted')
        return data
    
    def create(self, validated_data):
        return super().create(validated_data)


    
