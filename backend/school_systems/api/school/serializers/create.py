from rest_framework import serializers

from school.models import Registration, School, Facilitator, Student, Course, Department, SchoolYearStudentInfo, SchoolYear

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

class SchoolYearCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolYear
        fields = ['name','school','start_date','end_date']

class DepartmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name','school']
    def validate(self, data):
        name = data.get('name')
        request = self.context.get('request')
        user = request.user

        if user.is_staff:
            school = data.get('school')
        elif hasattr(user, 'Facilitator'):
            school = user.facilitator.school
        else:
            raise serializers.ValidationError('No Permission')

        if Department.objects.filter(name=name, school=school).exists():
            raise serializers.ValidationError('Department Already Exists')
        
        return data

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name','school','department']

    def validate(self, data):
        name = data.get('name')
        request = self.context.get('request')
        user = request.user

        if user.is_staff:
            school = data.get('school')
        elif hasattr(user, 'Facilitator'):
            school = user.facilitator.school
        else:
            raise serializers.ValidationError('No Permission')

        if Course.objects.filter(name=name, school=school).exists():
            raise serializers.ValidationError('Course Already Exists')
        
        return data

class StudentInfoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolYearStudentInfo
        fields = ['school_year','student','course','year_level']

class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['first_name','last_name','school_student_id']

    def validate(self, data):
        school_student_id = data.get('school_student_id')

        request = self.context.get('request')
        user = request.user

        if user.is_staff:
            school = data.get('school')
        elif hasattr(user, 'facilitator'):
            school = user.facilitator.school
        else:
            raise serializers.ValidationError('No Permission')


        if Student.objects.filter(school_student_id=school_student_id,school=school).exists():
            raise serializers.ValidationError('Student already exists')

        return data

class FacilitatorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilitator
        fields = ['first_name','last_name','school','school_staff_id','email']
    
    def validate(self, data):
        school_staff_id = data.get('school_staff_id')
        request = self.context.get('request')
        user = request.user

        if user.is_staff:
            school = data.get('school')
        elif hasattr(user, 'Facilitator'):
            school = user.facilitator.school
        else:
            raise serializers.ValidationError('No Permission')

        if Facilitator.objects.filter(school_staff_id=school_staff_id, school=school).exists():
            raise serializers.ValidationError('Staff Already Exists')
        return data
    
class StudentCSVRowSerializer(serializers.Serializer):
    school_student_id = serializers.CharField(max_length=255)
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)

    course = serializers.IntegerField()
    year_level = serializers.IntegerField(min_value=1)

    email = serializers.EmailField()