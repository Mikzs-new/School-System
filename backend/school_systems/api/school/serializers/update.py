from rest_framework import serializers

from school.models import Student, Facilitator

class StudentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['first_name','last_name','email','course','year_level']

class FacilitatorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = ['first_name','last_name','email']