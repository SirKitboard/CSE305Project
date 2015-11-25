from pyramid.view import view_config
from pyramid.renderers import render
from pyramid.response import Response


@view_config(route_name='home')
def my_view(request):
    if('currentUser' not in request.session):
        result = render('myapp:templates/index.mako', {}, request=request)
    else:
        result = render('myapp:templates/index.mako', {
            'name': request.session['currentUser']['name']
        }, request=request)
    return Response(result)


@view_config(route_name='items', renderer='myapp:templates/items.mako')
def item_view(request):
	itemID = request.matchdict['id']
	return {
		'itemID': itemID
	}

    # if('currentUser' not in request.session):
    #     result = render('myapp:templates/items.mako', {}, request=request)
    # else:
    #     result = render('myapp:templates/items.mako', {
    #         'name': request.session['currentUser']['name'],
    #         'itemID': itemID
    #     }, request=request)
    # return Response(result)


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
