from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config

import mysql.connector

cnx = None;

@view_config(renderer='json')
def allItems(request):
    cursor = cnx.cursor()

    query = ("SELECT * FROM Items")

    cursor.execute(query)

    items = [];
    for (ID, Name, Type, ManufactureYear, CopiesSold, Stock) in cursor:
        items.append({
            'id' : ID,
            'name' : Name,
            'type' : Type,
            'manufactureYear' : ManufactureYear,
            'copiesSold' : CopiesSold
            'stock' : Stock
        })

    return items

def hello_world(request):
	return Response('Hello EOD')

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)
    
    #Define all views
    config.add_route('home', '/')
    config.add_route('items/all')
    config.add_route('hello','/hello')

    #Define Views
    config.add_view(hello_world, route_name='hello')
    confif.add_view(allItems, route_name='items/all')
    config.scan()
    return config.make_wsgi_app()
