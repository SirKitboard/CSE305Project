# pylint: disable=C,F
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
    config.add_route('apiallItems', 'api/items', request_method='GET')
    config.add_route('apisearch', 'api/items/search', request_method='GET')
    config.add_route('apiitemSuggestions', 'api/items/suggestions', request_method='GET')
    config.add_route('apigetItem', 'api/items/{id}', request_method='GET')
    config.add_route('apigetItemThumbnails', 'api/items/{id}/thumbnails', request_method='GET')
    config.add_route('apiaddItem', 'api/items', request_method='POST')
    config.add_route('apiupdateItem', 'api/items/{id}', request_method='PUT')
    config.add_route('apihello', '/hello')
    config.add_route('apideleteItem', 'api/items/{id}', request_method='DELETE')
    config.add_route('apisold', 'api/items/sold', request_method='POST')
    # config.add_route('apisessionTest', '/ses')

    # User Routes
    config.add_route('apilogin', 'api/login')
    config.add_route('apilogout', 'api/logout')
    config.add_route('apicurrentUser', 'api/currentUser')

    # Employee Routes
    config.add_route('apiallEmployees', 'api/employees', request_method='GET')
    config.add_route('apigetEmployee', 'api/employees/{id}', request_method='GET')
    config.add_route('apiaddEmployee', 'api/employees', request_method='POST')
    config.add_route('apiupdateEmployee', 'api/employees/{id}', request_method='PUT')
    config.add_route('apideleteEmployee', 'api/employees/{id}', request_method='DELETE')

    # Customer Routes
    config.add_route('apiallCustomers', 'api/customers', request_method='GET')
    config.add_route('apiCustomerStats', 'api/customers/{id}/stats', request_method='GET')
    config.add_route('apiaddCustomer', 'api/customers', request_method='POST')
    config.add_route('apigetCustomer', 'api/customers/{id}', request_method='GET')
    config.add_route('apideleteCustomer', 'api/customers/{id}', request_method='DELETE')
    config.add_route('apiupdateCustomer', 'api/customers/{id}', request_method='PUT')
    config.add_route('apisellHistory', 'api/customers/{id}/sellHistory', request_method='GET')
    config.add_route('apiauctionHistory', 'api/customers/{id}/auctionHistory', request_method='GET')

    # Auctions Routes
    config.add_route('apiGetOpenAuctions', 'api/auctions/open', request_method='GET')
    config.add_route('apiSearchAuction', 'api/auctions/search')
    config.add_route('apiGetAuction', 'api/auctions/{id}', request_method='GET')

    # Generators
    config.add_route('apisalesReport', 'api/generate/salesReport', request_method='GET')
    config.add_route('apireceipt', 'api/generate/receipt', request_method='GET')
    config.add_route('apimailingList', 'api/generate/mailingList', request_method='GET')

    # Bid Routes
    config.add_route('apibidHistory', 'api/auction/{id}/bids', request_method='GET')
    config.add_route('apirevenueReport', 'api/generate/revenueReport', request_method='GET')

    # Views
    config.add_route('items', 'item/{id}', request_method='GET')
    config.add_route('auctionSearch', 'auctions/search/{id}', request_method='GET')
    config.add_route('auctions', 'auction/{id}', request_method='GET')
    config.add_route('profile', 'profile', request_method='GET')
    config.add_route('signup', 'signup', request_method='GET')

    config.scan()
    return config.make_wsgi_app()
