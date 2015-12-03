# pylint: disable=W,C
from pyramid.view import view_config
from pyramid.renderers import render
from pyramid.response import Response
from myapp import Authorizer


@view_config(route_name='signup', renderer='myapp:templates/signup.mako')
def home(request):
	values = {
		'currentUser': None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values


@view_config(route_name='addItem', renderer='myapp:templates/addItem.mako')
def addItem(request):
	values = {
		'currentUser': None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values


@view_config(route_name='createAuction', renderer='myapp:templates/createAuction.mako')
def createAuction(request):
	values = {
		'currentUser': None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values


@view_config(route_name='managerDashboard', renderer='myapp:templates/managerDashboard.mako')
def managerDashboard(request):
	Authorizer.authorizeManager(request)
	values = {
		'currentUser': None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values


@view_config(route_name='employeeDashboard', renderer='myapp:templates/employeeDashboard.mako')
def employeeDashboard(request):
	Authorizer.authorizeEmployee(request)
	values = {
		'currentUser': None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values

@view_config(route_name='receipts', renderer='myapp:templates/receipts.mako')
def receipt(request):
	# Authorizer.authorizeEmployee(request)
	values = {
		'currentUser': None,
	}
	if('currentUser' in request.session):
		values["currentUser"] = request.session['currentUser']
	return values
