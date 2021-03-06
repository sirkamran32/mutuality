from django.db import models
from connect.models.facebookuser import FacebookUser


class UserViewed( models.Model ):
    user = models.ForeignKey('Profile', related_name="viewed_by" )
    viewed = models.ForeignKey(FacebookUser, related_name="viewed_person")
    filter = models.CharField(max_length=255)
    date_last_viewed = models.DateTimeField( "Date Last Viewed", auto_now=True )

    class Meta:
        app_label = 'connect'

    def __unicode__(self):
        return "%s was viewed by %s" % ( self.viewed, self.user )
