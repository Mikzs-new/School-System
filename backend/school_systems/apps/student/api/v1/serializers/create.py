from rest_framework import serializers

from apps.student.models.student_enrollment import StudentEnrollment
from apps.school.models.course import Course
from apps.school.models.school import School

class StudentEnrollmentCreateSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all()
    )
    class Meta:
        model = StudentEnrollment
        fields = ['school_year','student','course','year_level','school']
    
class StudentCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)
    school_student_id = serializers.CharField(max_length=255)
    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.none()
    )
    year_level = serializers.IntegerField(min_value=1)
    email = serializers.EmailField()

    def __init__(self, *args, school=None, **kwargs):
        super().__init__(*args, **kwargs)

        if school:
            self.fields['course'].queryset = (
                Course.objects.filter(school=school)
            )
