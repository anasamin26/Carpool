# yourappname/urls.py

from django.urls import path, include
from rest_framework import routers
from .views import UserList, UserDetail,user_registration,user_login,get_csrf_token,RideList, RideDetail,RideViewSet,join_ride,get_user_by_email,cancel_ride,get_rides_by_organizer,get_rides_by_attendee,delete_ride,update_ride

router = routers.DefaultRouter()
router.register(r'createrides', RideViewSet, basename='ride')

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('rides/', RideList.as_view(), name='ride-list'),
    path('rides/<int:pk>/', RideDetail.as_view(), name='ride-detail'),
    path('register/', user_registration, name='user_registration'),
    path('login/', user_login, name='user_login'),
    path('get-csrf-token/', get_csrf_token, name='get-csrf-token'),
    path('rides/<int:ride_id>/join/', join_ride, name='join_ride'),
    path('rides/<int:ride_id>/cancel/', cancel_ride, name='cancel_ride'),
    path('usersbyemail/', get_user_by_email, name='get_user_by_email'),
    path('get_rides_by_organizer/<int:organizer_id>/', get_rides_by_organizer, name='get_rides_by_organizer'),
    path('get_rides_by_attendee/', get_rides_by_attendee, name='get_rides_by_attendee'),
    path('delete_ride/', delete_ride, name='delete_ride'),
    path('updaterides/<int:ride_id>/', update_ride, name='update_ride'),

    path('', include(router.urls)),
]
