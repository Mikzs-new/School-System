import uuid

def candidate_upload_path(instance, filename):
    ext = filename.split('.')[-1]

    return f'candidates/{uuid.uuid4()}.{ext}'