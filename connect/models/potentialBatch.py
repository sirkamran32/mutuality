from django.db import models
from connect.models.profile import Profile
from time import mktime


class PotentialBatch(models.Model):
    profile = models.ForeignKey(Profile, related_name='potential_batch_for')
    date_created = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField()

    class Meta:
        app_label = 'connect'


    @property
    def expiration_timestamp(self):
        return mktime(self.date_expiration.timetuple())*1000

