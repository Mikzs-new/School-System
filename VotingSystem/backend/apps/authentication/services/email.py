from django.core.mail import send_mail

from .tokens import generate_password_reset_token

from dotenv import load_dotenv
import os

load_dotenv()

sender = os.getenv('EMAIL_USER')
FRONTEND_URL = os.getenv('FRONTEND_URL')



def send_password_reset_email(user):
    uid, token = generate_password_reset_token(user)
    reset_link = f'{FRONTEND_URL}password_reset/{uid}/{token}/'
    
    account = user.email
    
    name = user.username

    if hasattr(user, 'school_staff_profile'):
        name = user.school_staff_profile.first_name
    if hasattr(user, 'student_profile'):
        name = user.student_profile.first_name
    
    
    send_mail(
        'Password Reset',
        f'''
        Hello {name}

        Click this link to reset your password:

        {reset_link}

        If you did not request this,
        ignore this email.
        ''',
         sender,
         [account],
         fail_silently=False
    )
    

