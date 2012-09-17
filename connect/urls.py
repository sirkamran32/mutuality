from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('Mutuality.connect.views',
    url(r'^/?$', "index", name="index"),
    url(r'^profile/(\d+)/$', "profile", name="profile"),
    url(r'^dashboard/?$', "dashboard", name="dashboard"),
    url(r'^fbinfo/?$', "fbinfo", name="fbinfo"),
    url(r'^spinSlotMachine$', spinSlotMachine, name="spinSlotMachine")
)
