from pyramid.config import Configurator
from pyramid.response import Response
import views


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Define all views
    config.add_route('home', '/')
    config.add_route('allItems', 'items/all')
    config.add_route('getItem', 'items/{id}')
    config.add_route('addItem', 'items', request_method='POST')
    config.add_route('hello', '/hello')

    config.scan()
    return config.make_wsgi_app()
