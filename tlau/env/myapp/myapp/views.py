from pyramid.view import view_config
from pyramid.response import Response


@view_config(route_name='home', renderer='templates/mytemplate.pt')
def my_view(request):
    return {'project': 'myapp'}


@view_config(route_name='sessionTest', renderer='json')
def sessionTest(request):
    session = request.session
    if 'access_token' in session:
        session['access_token'] = session['access_token'] + 1
        return {
            'access_token': session['access_token']
        }
    else:
        session['access_token'] = 1
        return {
            'access_token': session['access_token']
        }
