# yourappname/serializers.py
from rest_framework import serializers
from carpoolbackend.models import User, Ride

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name','occupation','gender','email', 'password','avatar']  # Add other fields as needed

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
class RideSerializer(serializers.ModelSerializer):
    attendees = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Ride
        fields = '__all__'

    def create(self, validated_data):
        attendees_data = validated_data.pop('attendees', [])  # Extract attendees data if provided
        ride = Ride.objects.create(**validated_data)

        # Add attendees to the ride
        for attendee_data in attendees_data:
            attendee, _ = User.objects.get_or_create(**attendee_data)
            ride.attendees.add(attendee)

        return ride