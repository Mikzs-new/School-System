from rest_framework import serializers

from apps.school.models import Registration, School, Facilitator, Student, Course, Department, SchoolYear, SchoolYearStudentInfo

class RegistrationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['id','name','school_id','time_registered']

class SchoolListSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id','name','school_id','email']

class SchoolYearListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolYear
        fields = ['id','name','start_date','end_date']

class DepartmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','name','school']

class CourseListSerializer(serializers.ModelSerializer):
    department = SmallDepartmentSerializer(read_only=True)
    class Meta:
        model = Course
        fields = ['id','name','department','school']

class StudentListSerializer(serializers.ModelSerializer):
    student = SmallStudentInfoSerializer(many=True,read_only=True)
    class Meta:
        model = Student
        fields = ['id', 'full_name', 'student_school_id','student']

class FacilitatorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = ['id','full_name','school_staff_id','school']

class StudentInfoListSerializer(serializers.ModelSerializer):
    student = SmallStudentSerializer(many=True,read_only=True)
    school_year = SmallStudentSerializer(many=True,read_only=True)
    class Meta:
        model = SchoolYearStudentInfo
        fields = ['id','school_year','student']