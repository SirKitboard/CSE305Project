from pyramid.view import view_config
from pyramid.response import Response

import pyramid.httpexceptions as exc

import mysql.connector


@view_config(route_name='allItems', renderer='json')
def allItems(request):
    cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
    cursor = cnx.cursor()

    query = ("SELECT * FROM Items ")

    cursor.execute(query)

    items = []
    for (ID, Name, Type, ManufactureYear, CopiesSold, Stock) in cursor:
        items.append({
            'id': ID,
            'name': Name,
            'type': Type,
            'manufactureYear': ManufactureYear,
            'copiesSold': CopiesSold,
            'stock': Stock
        })

    cursor.close()
    cnx.close()

    if(len(items) == 0):
        raise exc.HTTPNoContent()

    return items


@view_config(route_name='getItem', renderer='json')
def getItem(request):
    itemID = request.matchdict['id']
    cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
    cursor = cnx.cursor()

    query = ("SELECT * FROM Items WHERE ID = %s")

    cursor.execute(query, tuple(itemID))

    item = None

    for (ID, Name, Type, ManufactureYear, CopiesSold, Stock) in cursor:
        item = {
            'id': ID,
            'name': Name,
            'type': Type,
            'manufactureYear': ManufactureYear,
            'copiesSold': CopiesSold,
            'stock': Stock
        }

    if(item is None):
        raise exc.HTTPNoContent()

    cursor.close()
    cnx.commit()
    cnx.close()

    return item


@view_config(route_name='addItem', renderer='json', request_method='POST')
def addItem(request):
    requiredKeys = ['name', 'type', 'manufactureYear', 'stock']
    postVars = request.POST
    acceptedKeys = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            raise exc.HTTPBadRequest()

    query = ("INSERT INTO Items (Name, Type, ManufactureYear, Stock) VALUES (%s, %s, %s, %s)")

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedKeys))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()
