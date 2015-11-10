from pyramid.config import Configurator
from pyramid.response import Response
import views


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Define all routes
    config.add_route('home', '/')

    # Item Routes
    config.add_route('allItems', 'api/items')
    config.add_route('getItem', 'api/items/{id}')
    config.add_route('addItem', 'api/items', request_method='POST')
    config.add_route('hello', '/hello')

    # User Routes
    config.add_route('login', 'api/login')

    config.scan()
    return config.make_wsgi_app()
