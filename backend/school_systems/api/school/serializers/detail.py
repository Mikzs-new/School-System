from rest_framework import serializers

from school.models import Registration, School, Facilitator, Student, Course, Department

from .custom import SmallCourseSerializer, SmallSchoolSerializer, SmallDepartmentSerializer

class RegistrationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['name','school_id','complete_address','email','status','time_registered']

class SchoolDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['name','school_id','complete_address','email']

class DepartmentDetailSerializer(serializers.ModelSerializer):
    school = SmallSchoolSerializer(read_only=True)
    class Meta:
        model = Department
        fields = ['name','school']

class CourseDetailSerializer(serializers.ModelSerializer):
    department = SmallDepartmentSerializer(read_only=True)
    class Meta:
        model = Course
        fields = ['name','department','school']

class StudentDetailSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)
    school = SmallSchoolSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ['full_name', 'school_student_id', 'school', 'course', 'year_level', 'email','created_at']

class FacilitatorDetailSerializer(serializers.ModelSerializer):
    school = SmallSchoolSerializer(read_only=True)
    
    class Meta:
        model = Facilitator
        fields = ['full_name', 'school_staff_id', 'school', 'email','created_at']