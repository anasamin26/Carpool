# yourappname/models.py

from django.db import models
# yourappname/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.postgres.fields import ArrayField


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        avatar = extra_fields.get('avatar', 'https://bootdey.com/img/Content/avatar/avatar1.png')
        user = self.model(         
            email=email,
            first_name=extra_fields.get('first_name', ''),
            last_name=extra_fields.get('last_name', ''),
            avatar=avatar,
            occupation=extra_fields.get('occupation', ''),
            gender=extra_fields.get('gender', ''),
        )        
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password=password, **extra_fields)


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    avatar = models.CharField(max_length=255,default="https://bootdey.com/img/Content/avatar/avatar1.png")
    occupation=models.CharField(max_length=255)
    gender=models.CharField(max_length=1)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Add any additional fields you need

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    
class Ride(models.Model):
    title = models.CharField(max_length=255)
    organizer_id=models.CharField(max_length=255)
    organizer= models.CharField(max_length=255)
    organizer_occupation=models.CharField(max_length=255)
    organizer_image= models.CharField(max_length=255,default="https://bootdey.com/img/Content/avatar/avatar1.png")
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=1)  # A for Available, C for Completed, etc.
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField()
    total_fare = models.DecimalField(max_digits=10, decimal_places=2)
    car = models.CharField(max_length=255)
    attendees = models.ManyToManyField(User, related_name='rides_attending')
    background_colors = ArrayField(models.CharField(max_length=10), default=list)  # Array of hex color codes
    title_color = models.CharField(max_length=10)  # Hex color code
    category = models.CharField(max_length=255) #females only, males only, all genders

    def __str__(self):
        return self.title    
