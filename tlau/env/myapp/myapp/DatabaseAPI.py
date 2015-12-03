from pyramid.view import view_config
from pyramid.response import Response
from myapp import Authorizer
import subprocess

import pyramid.httpexceptions as exc

@view_config(route_name='apiGetBackup', renderer='json')
def openAuctions(request):
    proc = subprocess.Popen("mysqldump --user=root --password=SmolkaSucks69 --databases 305 > myapp/static/databases/bak.sql", stdout=subprocess.PIPE, shell=True)
    (out, err) = proc.communicate()
    print ("program output:", out)

    raise exc.HTTPOk()
