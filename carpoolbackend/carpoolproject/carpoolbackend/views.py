from django.shortcuts import render,redirect

from rest_framework import generics, viewsets
from carpoolbackend.models import User, Ride
from .serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt
from .authentication import CustomEmailBackend
from .serializers import UserSerializer,RideSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.shortcuts import get_object_or_404


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
class RideList(generics.ListCreateAPIView):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer

class RideDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    
@ensure_csrf_cookie
def get_csrf_token(request):
    # This view only needs to send the CSRF token as a cookie in the response
    return JsonResponse({'detail': 'CSRF token set'})

@api_view(['POST'])
@permission_classes([AllowAny])
def user_registration(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'detail': 'Registration successful'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Invalid registration data'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'detail': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        print ("Email: ",email)
        print("Password: ",password)
        user = CustomEmailBackend.authenticate( email=email, password=password)
        print("User after auth: ",user)

        if user:
            return Response({'detail': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({'detail': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def join_ride(request, ride_id):
    try:
        ride = Ride.objects.get(id=ride_id)
        print("USer: ",request.data['id'])

        user=User.objects.get(id=request.data['id'])
        print("User Id: ", (user.id))
        print("Organizer Id: ",(ride.organizer_id))


        if ride.attendees.count() < ride.capacity and int(ride.organizer_id) != user.id:
            ride.attendees.add(user)
            ride.save()
            serializer = RideSerializer(ride)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Ride is already full or User is creator"}, status=status.HTTP_400_BAD_REQUEST)
    except Ride.DoesNotExist:
        return Response({"detail": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def cancel_ride(request, ride_id):
    try:
        ride = Ride.objects.get(id=ride_id)
        user = User.objects.get(id=request.data['id'])

        if user in ride.attendees.all():
            ride.attendees.remove(user)
            ride.save()
            serializer = RideSerializer(ride)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "User is not in the attendees list"}, status=status.HTTP_400_BAD_REQUEST)
    except Ride.DoesNotExist:
        return Response({"detail": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_by_email(request):
    email = request.GET.get('email')
    user = get_object_or_404(User, email=email)
    # # You can serialize the user data using a serializer if needed
    # serializer = UserSerializer(user)
    # return Response(serializer.data)
    return Response({
        'id': user.id,
        'first_name': user.first_name,
        'last_name':user.last_name,
        'email': user.email,
        'occupation':user.occupation,
        'avatar':user.avatar,
        'gender':user.gender,
        # Add other user fields as needed
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_rides_by_organizer(request, organizer_id):
    try:
        rides = Ride.objects.filter(organizer_id=organizer_id)
        serializer = RideSerializer(rides, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_rides_by_attendee(request):
    # Get the user ID from query parameters
    user_id = request.query_params.get('user_id')

    # Validate user_id
    if not user_id:
        return Response({'error': 'user_id parameter is required'}, status=400)

    # Get the user instance based on the user_id
    user = get_object_or_404(User, id=user_id)

    # Fetch rides attended by the user
    rides_attending = Ride.objects.filter(attendees=user)
    
    # Serialize the rides and return the response
    serializer = RideSerializer(rides_attending, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([AllowAny])  
def delete_ride(request):
    try:
        ride_id = request.query_params.get('rideId')
        user_id = request.query_params.get('userId')
        if not ride_id or not user_id:
            return Response({'error': 'rideId and userId are required in the request body'}, status=status.HTTP_400_BAD_REQUEST)

        ride = get_object_or_404(Ride, id=ride_id, organizer_id=user_id)
        ride.delete()

        return Response({'detail': 'Ride deleted successfully'}, status=status.HTTP_200_OK)

    except Ride.DoesNotExist:
        return Response({'detail': 'Ride not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([AllowAny])
def update_ride(request, ride_id):
    try:
        ride = get_object_or_404(Ride, id=ride_id)
        ride.start_date = request.data.get('start_date', ride.start_date)
        ride.end_date = request.data.get('end_date', ride.end_date)
        ride.start_time = request.data.get('start_time', ride.start_time)
        ride.end_time = request.data.get('end_time', ride.end_time)
        ride.from_location = request.data.get('from_location', ride.from_location)
        ride.to_location = request.data.get('to_location', ride.to_location)
        ride.capacity = request.data.get('capacity', ride.capacity)
        ride.total_fare = request.data.get('total_fare', ride.total_fare)
        ride.car = request.data.get('car', ride.car)
        ride.category = request.data.get('category', ride.category)
        ride.save()
        serializer = RideSerializer(ride)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Ride.DoesNotExist:
        return Response({'detail': 'Ride not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RideViewSet(viewsets.ModelViewSet):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


