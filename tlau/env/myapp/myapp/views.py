#pylint: disable=W,C
from pyramid.view import view_config
from pyramid.renderers import render
from pyramid.response import Response


@view_config(route_name='home', renderer='myapp:templates/index.mako')
def home(request):
	values = {}
	if('currentUser' in request.session):
		values["name"] = request.session['currentUser']['name']
	return values

@view_config(route_name='items', renderer='myapp:templates/items.mako')
def item_view(request):
	itemID = request.matchdict['id']
	return {
		'itemID': itemID
	}
