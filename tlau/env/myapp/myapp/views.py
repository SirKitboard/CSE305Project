from pyramid.config import Configurator
from pyramid.response import Response

@view_config(route_name='home', renderer='templates/mytemplate.pt')
def my_view(request):
    return {'project': 'myapp'}
