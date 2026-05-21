from rest_framework import serializers
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group    
from django.db import transaction

from api.utils.validators.csv import validate_students_csv
from api.utils.validators.create import create_user
import csv

from school.models import SchoolYear, Student, SchoolYearStudentInfo

from ..serializers.create import StudentCSVRowSerializer

User = get_user_model()

def import_students_csv(file,facilitator,group):
    with transaction.atomic():
        validate_students_csv(file)

        decoded = file.read().decode('utf-8')

        reader = csv.DictReader(decoded.splitlines())

        create_students = []
        created_student_data = {}
        errors = []
        users_to_update = []
        student_infos_to_create = []
        seen_student_ids = set()

        school = facilitator.school

        school_year = SchoolYear.objects.filter(school=school).order_by('-created_at').first()

        if not school_year:
            raise serializers.ValidationError('No school year configured')

        if not school_year.is_current_school_year:
            raise serializers.ValidationError('Update the current school year') 

        existing_students = {s.school_student_id: s for s in Student.objects.filter(school=school)}

        existing_student_ids = set(SchoolYearStudentInfo.objects.filter(school_year=school_year).values_list('student_id',flat=True))

        for index,row in enumerate(reader):

            row_number = index + 2
            
            serializer = StudentCSVRowSerializer(data=row)

            if not serializer.is_valid():
                errors.append({
                    'row': row_number,
                    'error': serializer.errors
                })
                continue

            validated = serializer.validated_data

            sid = validated['school_student_id']

            if sid in seen_student_ids:
                errors.append({'row': row_number, 'error': 'Duplicated Student'})
                continue

            seen_student_ids.add(sid)

            existing_student = existing_students.get(sid)

            if not existing_student:
                username = f'{school.initials.lower()}_{sid}'

                try:
                    user = create_user(
                        username=username,
                        email=validated['email'],
                        school=school,
                        group=group
                    )
                except serializers.ValidationError as e:
                    errors.append({'row': row_number, 'error': str(e)})
                    continue
                
                student = Student(
                    user=user,
                    school=school,
                    added_by=facilitator,
                    school_student_id=sid,
                    first_name=validated['first_name'],
                    last_name=validated['last_name']
                )

                create_students.append(student)
                created_student_data[sid] = {
                    'course': validated['course'],
                    'year_level': validated['year_level']
                }
            
            else:
                student = existing_student
                
                if student.id in existing_student_ids:
                    errors.append({'row': row_number, 'error': 'Student info already exists'})
                    continue

                if validated['email'] != student.user.email:
                    student.user.email = validated['email']

                    users_to_update.append(student.user)
                
                student_info = SchoolYearStudentInfo(
                    student=student,
                    school_year=school_year,
                    course=validated['course'],
                    year_level=validated['year_level'],
                    added_by=facilitator
                )

                student_infos_to_create.append(student_info)    

        created_students = Student.objects.bulk_create(create_students)

        student_map = {
            s.school_student_id: s
            for s in created_students
        }


        for sid,data in created_student_data.items():
            student = student_map[sid]

            student_info = SchoolYearStudentInfo(
                student=student,
                school_year=school_year,
                added_by=facilitator,
                course=data['course'],
                year_level=data['year_level']
            )
            
            student_infos_to_create.append(student_info)

        SchoolYearStudentInfo.objects.bulk_create(student_infos_to_create)
        User.objects.bulk_update(
            users_to_update,
            ['email']
        )
        context = {
            'Errors': errors,
            'Updated_count': len(student_infos_to_create),
            'Created_count': len(create_students)
        }

        return context