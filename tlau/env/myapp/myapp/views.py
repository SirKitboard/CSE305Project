# pylint: disable=W,C
from pyramid.view import view_config
from pyramid.renderers import render
from pyramid.response import Response


@view_config(route_name='home', renderer='myapp:templates/index.mako')
def home(request):
	values = {
		'currentUser' : 0,
		'id' : 1
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values

@view_config(route_name='items', renderer='myapp:templates/items.mako')
def item_view(request):
	itemID = request.matchdict['id']
	values = {
		'itemID': itemID,
		'currentUser' : 0
	}


@view_config(route_name='auctions', renderer='myapp:templates/auctions.mako')
def auction_view(request):
	auctionID = request.matchdict['id']
	values = {
		'auctionID': auctionID,
		currentUser : 0
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values
