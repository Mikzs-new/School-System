from rest_framework import serializers

from apps.authentication.models.student_profile import StudentProfile

class SmallStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['school_student_id','full_name']