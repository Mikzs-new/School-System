from rest_framework import serializers

from school.models import Registration, School, Facilitator, Student, Course, Department

class RegistrationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['id','name','school_id','time_registered']

class SchoolListSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id','name','school_id','email']

class DepartmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','name','school']

class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id','name','department','school']

class StudentListSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    class Meta:
        model = Student
        fields = ['id', 'full_name', 'student_school_id', 'school', 'course', 'year_level', 'email']

class FacilitatorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = ['id','full_name','school_staff_id','school']