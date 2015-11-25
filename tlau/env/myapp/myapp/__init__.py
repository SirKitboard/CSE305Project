#pylint: disable=C,F
from pyramid.config import Configurator
import os

from pyramid.session import SignedCookieSessionFactory
my_session_factory = SignedCookieSessionFactory('itsaseekreet')


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    here = os.path.abspath(os.path.dirname(__file__))
    settings['mako.directories'] = os.path.join(here, 'templates')
    config = Configurator(settings=settings)
    config.include('pyramid_mako')
    config.include('pyramid_scss')
    config.add_route('css', 'static/css/{css_path:[^\.]*}.css')
    config.add_view(route_name='css', view='pyramid_scss.controller.get_scss', renderer='scss', request_method='GET')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.set_session_factory(my_session_factory)

    # Define all routes
    config.add_route('home', '/')

    # Item Routes
    config.add_route('allItems', 'api/items', request_method='GET')
    config.add_route('search', 'api/items/search', request_method='GET')
    config.add_route('itemSuggestions', 'api/items/suggestions', request_method='GET')
    config.add_route('getItem', 'api/items/{id}', request_method='GET')
    config.add_route('getItemThumbnails', 'api/items/{id}/thumbnails', request_method='GET')
    config.add_route('addItem', 'api/items', request_method='POST')
    config.add_route('updateItem', 'api/items/{id}', request_method='PUT')
    config.add_route('hello', '/hello')
    config.add_route('deleteItem', 'api/items/{id}', request_method='DELETE')
    config.add_route('sold','api/items/sold', request_method='POST')
    # config.add_route('sessionTest', '/ses')

    # User Routes
    config.add_route('login', 'api/login')
    config.add_route('logout', 'api/logout')
    config.add_route('currentUser', 'api/currentUser')

    # Employee Routes
    config.add_route('allEmployees', 'api/employees', request_method='GET')
    config.add_route('getEmployee', 'api/employees/{id}', request_method='GET')
    config.add_route('addEmployee', 'api/employees', request_method='POST')
    config.add_route('updateEmployee', 'api/employees/{id}', request_method='PUT')
    config.add_route('deleteEmployee', 'api/employees/{id}', request_method='DELETE')

    # Customer Routes
    config.add_route('allCustomers', 'api/customers', request_method='GET')
    config.add_route('addCustomer', 'api/customers', request_method='POST')
    config.add_route('getCustomer', 'api/customers/{id}', request_method='GET')
    config.add_route('deleteCustomer', 'api/customers/{id}', request_method='DELETE')
    config.add_route('updateCustomer', 'api/customers/{id}', request_method='PUT')
    config.add_route('sellHistory', 'api/customers/{id}/sellHistory', request_method='GET')
    config.add_route('auctionHistory', 'api/customers/{id}/auctionHistory', request_method='GET')

    # Generators
    config.add_route('salesReport', 'api/generate/salesReport', request_method='GET')
    config.add_route('receipt', 'api/generate/receipt', request_method='GET')
    config.add_route('mailingList', 'api/generate/mailingList', request_method='GET')

    # Bid Routes
    config.add_route('bidHistory', 'api/auction/{id}/bids', request_method='GET')
    config.add_route('revenueReport', 'api/generate/revenueReport', request_method='GET')

    config.scan()
    return config.make_wsgi_app()
