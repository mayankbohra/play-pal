from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room

# Create your views here.
# ! class to get all the rooms in the database and return them in JSON format
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer   # converts model instances to JSON format

# ! class to get a specific room from the database and return it in JSON format based on the room code provided in the request URL
class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'                                                       # ? get the room code from the request URL

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        # check if the room code is provided in the request URL
        if code != None:
            room = Room.objects.filter(code=code)
            # check if the room exists in the database
            if len(room) > 0:
                data = RoomSerializer(room[0]).data                                 # ? get the room from the database
                data['is_host'] = self.request.session.session_key == room[0].host  # ? check if the user is the host of the room
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

# ! class to join a room in the database based on the room code provided in the request URL
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        # check if session exists and create one if it doesn't exist
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)

        # check if the room code is provided in the request URL
        if code != None:
            room_result = Room.objects.filter(code=code)
            # check if the room exists in the database
            if len(room_result) > 0:
                room = room_result[0]                           # ? get the room from the database
                self.request.session['room_code'] = code        # ? store the room code in the session
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

# ! class to create a room in the database based on the data provided in the request and return the room in JSON format
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # check if session exists and create one if it doesn't exist
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # get the data from the request and check if it is valid data to create a room
        serializer = self.serializer_class(data=request.data)

        # check if the data is valid and create a room if it is valid
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            # check if the host already has a room and update the room if it exists
            # or create a new room if it doesn't exist
            queryset = Room.objects.filter(host=host)   # ? check if the host already has a room
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)    # create a new room if the host doesn't have a room
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# ! class to leave a room in the database
class UserInRoom(APIView):
    def get(self, request, format=None):
        # check if session exists and create one if it doesn't exist
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')       # ? get the room code from the session
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

# ! class to leave a room in the database
class LeaveRoom(APIView):
    def post(self, request, format=None):
        # check if the user is in a room
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')               # ? remove the room code from the session
            host_id = self.request.session.session_key          # ? get the host id from the session
            room_results = Room.objects.filter(host=host_id)    # ? get the room from the database based on the host id
            # check if the user is the host of the room
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

# ! class to update a room in the database based on the data provided in the request
class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        # check if session exists and create one if it doesn't exist
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)                                 # ? get the data from the request
        # check if the data is valid and update the room if it is valid
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)                                           # ? get the room from the database based on the room code
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            # check if the user is the host of the room and update the room if the user is the host of the room
            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])

            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
