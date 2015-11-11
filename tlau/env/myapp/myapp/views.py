from pyramid.view import view_config
from pyramid.renderers import render
from pyramid.response import Response


@view_config(route_name='home')
def my_view(request):
    if('currentUser' not in request.session):
        result = render('myapp:templates/home.pt', {}, request=request)
    else:
        result = render('myapp:templates/home.pt', {
            'name': request.session['currentUser']['name']
        }, request=request)
    return Response(result)


# @view_config(route_name='sessionTest', renderer='json')
# def sessionTest(request):
#     session = request.session
#     if 'access_token' in session:
#         # session['access_token'] = session['access_token'] + 1
#         return {
#             'access_token': session['access_token']
#         }
#     else:
#         session['access_token'] = 1
#         return {
#             'access_token': session['access_token']
#         }
