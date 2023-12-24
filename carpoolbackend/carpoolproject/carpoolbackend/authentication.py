# carpoolbackend/authentication.py

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import make_password

from carpoolbackend.models import User

class CustomEmailBackend(ModelBackend):
    def authenticate(email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)
            print("User retrived from db: ",user)
            print("Password to verify: ",password)
            hashed_password = make_password(password)
            print("Password to verify: ",hashed_password)
            # Check the hashed password
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            pass

        return None

