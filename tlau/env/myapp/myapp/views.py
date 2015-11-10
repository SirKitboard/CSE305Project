from pyramid.view import view_config
from pyramid.response import Response


@view_config(route_name='home', renderer='templates/mytemplate.pt')
def my_view(request):
    return {'project': 'myapp'}


@view_config(route_name='sessionTest', renderer='json')
def sessionTest(request):
    session = request.session
    if 'access_token' in session:
        return {
            'logged_in': 'yes'
        }
    else:
        session['access_token'] = 'true'
        return {
            'logged_in': 'no'
        }
