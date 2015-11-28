# pylint: disable=W,C
from pyramid.view import view_config
from pyramid.renderers import render
from pyramid.response import Response


@view_config(route_name='signup', renderer='myapp:templates/signup.mako')
def home(request):
	values = {
		'currentUser' : None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values

@view_config(route_name='addItem', renderer='myapp:templates/addItem.mako')
def addItem(request):
	values = {
		'currentUser' : None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values
