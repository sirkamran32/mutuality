from django.db import models
from connect.models.facebookuser import FacebookUser


# Create your models here.
class Friendship(models.Model):
    #id
    user = models.ForeignKey('Profile', related_name="friend_to" )
    friend = models.ForeignKey(FacebookUser, related_name="friend_from")
    date_created = models.DateTimeField( "Date Created", auto_now_add=True )
    date_updated = models.DateTimeField( "Date Updated", auto_now=True )
    
    class Meta:
        app_label = 'connect'

    def __unicode__(self):
        return "%s => %s" % ( self.user, self.friend )


