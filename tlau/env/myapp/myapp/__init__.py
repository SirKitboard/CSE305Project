from pyramid.config import Configurator
from pyramid.response import Response

def hello_world(request):
	return Response('Hello')

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('hello','/hello')
    config.add_view(hello_world, route_name='hello')
    config.scan()
    return config.make_wsgi_app()
