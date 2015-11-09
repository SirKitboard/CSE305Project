from pyramid.config import Configurator
from pyramid.response import Response

def hello_world(request):
    return Response('Hello EOD')


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
    config.add_route('hello', '/hello')

    # Define Views
    config.add_view(hello_world, route_name='hello')
    config.add_view(allItems, route_name='allItems', renderer='json')
    config.add_view(getItem, route_name='getItem', renderer='json')
    config.scan()
    return config.make_wsgi_app()
