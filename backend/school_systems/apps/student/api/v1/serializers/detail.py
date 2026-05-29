from rest_framework import serializers

from apps.student.models.student_enrollment import StudentEnrollment
from apps.authentication.models.student_profile import StudentProfile

from apps.school.api.v1.serializers.nested import SmallCourseSerializer, SmallSchoolYearSerializer
from apps.authentication.api.v1.serializers.profile.nested import SmallStudentSerializer


class StudentDetailSerializer(serializers.ModelSerializer):
    enrollments = SmallSchoolYearSerializer(many=True,read_only=True)
    class Meta:
        model = StudentProfile
        fields = ['school','full_name','school_student_id','enrollments','created_at']

class StudentEnrollmentDetailSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)
    school_years = SmallSchoolYearSerializer(read_only=True)
    class Meta:
        model = StudentEnrollment
        fields = ['school_years','course','year_level','added_by','created_at']
