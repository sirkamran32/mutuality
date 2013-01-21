from rest_framework import serializers
from connect.models.profile import Profile
from connect.models.friendship import Friendship
from connect.models.facebookuser import FacebookUser
from connect.models.userFavorite import UserFavorite
from connect.classes.meetPeopleProfile import MeetPeopleProfile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('facebookID', 'user', 'bio', 'name', 'birthdayString', 'birthdayDate', 'location', 'state', 'gender', 'relationshipStatus', "date_created", "date_updated")

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ('user', 'friend')

class FacebookUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacebookUser
        fields = ('facebookID', 'name', 'birthdayString', 'birthdayDate', 'location', 'state', 'gender', 'relationshipStatus', "date_created", "date_updated")


class MeetPeopleProfileSerializer(serializers.Serializer):
    gender = serializers.Field()
    relationshipStatus = serializers.Field()
    college = serializers.Field()
    age = serializers.Field()
    location = serializers.Field()
    employer = serializers.Field()

class UserFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFavorite
        fields = ('user', 'favorite', 'date_created')

