from rest_framework import serializers

from school.models import Registration, School, Facilitator, Student, Course, Department

class RegistrationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['name','school_id','complete_address','email']
    
    def validate_school_id(self, value):
        if Registration.objects.filter(school_id=value).exists():
            raise serializers.ValidationError('Registration Already Exists')
        return value

class SchoolCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['name','school_id','complete_address','email']
    
    def validate_school_id(self, value):
        if School.objects.filter(school_id=value).exists():
            raise serializers.ValidationError('School Already Exists')
        return value

class DepartmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name','school']

    def validate(self, data):
        name = data.get('name')
        school = data.get('school')

        if Department.objects.filter(name=name, school=school).exists():
            raise serializers.ValidationError('Department Already Exists')
        
        return data

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name','school','department']

    def validate(self, data):
        name = data.get('name')
        school = data.get('school')

        if Course.objects.filter(name=name, school=school).exists():
            raise serializers.ValidationError('Course Already Exists')
        
        return data

class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['user','first_name','last_name','school_student_id','school','course','year_level','email']

    def validate(self, data):
        student_school_id = data.get('school_student_id')
        school = data.get('school')
        year_level = data.get('year_level')


        if Student.objects.filter(student_school_id=student_school_id,school=school,year_level=year_level).exists():
            raise serializers.ValidationError('Student record is up-to-date')

        return data

class FacilitatorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = '__all__'
    
    def validate(self, data):
        school_staff_id = data.get('school_staff_id')
        school = data.get('school')

        if Facilitator.objects.filter(school_staff_id=school_staff_id, school=school).exists():
            raise serializers.ValidationError('Staff Already Exists')
        return data