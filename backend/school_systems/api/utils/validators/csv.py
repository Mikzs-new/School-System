import csv
from rest_framework import serializers

MAX_CSV_SIZE = 2 * 1024 * 1024

REQUIRED_COLUMNS = ['student_id','first_name','last_name','course','year_level','email']

def validate_students_csv(file):
    if file.size > MAX_CSV_SIZE:
        raise serializers.ValidationError('CSV too large')

    if not file.name.endswith('.csv'):
        raise serializers.ValidationError('Invalid CSV File')
    
    try:
        decoded = file.read().decode('utf-8')

        rows = csv.DictReader(decoded.splitlines())

        columns = rows.fieldnames

        for col in REQUIRED_COLUMNS:
            if col not in columns:
                raise serializers.ValidationError(f'Missing column {col}')
            
    except UnicodeDecodeError:
        raise serializers.ValidationError('CSV encoding invalid')
    except  Exception:
        raise serializers.ValidationError('Invalid CSV')
    
    finally:
        file.seek(0)

    return file