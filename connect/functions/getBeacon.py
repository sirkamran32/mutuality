from connect.models.beacon import Beacon

def GetBeacon(profile):
    if Beacon.objects.filter(user=profile).exists():
        beacon = Beacon.objects.filter(user=profile).latest('date_created')
        return beacon
    else:
        return []
