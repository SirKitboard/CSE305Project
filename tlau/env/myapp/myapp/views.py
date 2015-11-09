from pyramid.view import view_config

import mysql.connector


@view_config(route_name='home', renderer='templates/mytemplate.pt')
def my_view(request):
    return {'project': 'myapp'}


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

    return items


def getItem(request):
    itemID = request.matchdict['id']
    cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
    cursor = cnx.cursor()

    query = ("SELECT * FROM Items WHERE ID = " + str(itemID))

    cursor.execute(query)

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

    return item
