from pyramid.view import view_config
from pyramid.response import Response

import pyramid.httpexceptions as exc
import crypt

import mysql.connector


@view_config(route_name='login', renderer='json')
def login(request):
    requiredKeys = ['username', 'password', 'type']
    postVars = request.POST
    acceptedKeys = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            raise exc.HTTPBadRequest()

    salt = 'qwerty'
    salt = '${}${}$'.format(6, salt)
    cryptedPassword = crypt.crypt(acceptedKeys['password'], salt)
    try:
        query = ("SELECT Type FROM Users WHERE Username=%s AND Password=%s")

        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedKeys))

        return cursor

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()


# @view_config(route_name='allItems', renderer='json')
# def allItems(request):
#     cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
#     cursor = cnx.cursor()
#
#     query = ("SELECT * FROM Items ")
#
#     cursor.execute(query)
#
#     items = []
#     for (ID, Name, Type, ManufactureYear, CopiesSold, Stock) in cursor:
#         items.append({
#             'id': ID,
#             'name': Name,
#             'type': Type,
#             'manufactureYear': ManufactureYear,
#             'copiesSold': CopiesSold,
#             'stock': Stock
#         })
#
#     cursor.close()
#     cnx.close()
#
#     if(len(items) == 0):
#         raise exc.HTTPNoContent()
#
#     return items


# @view_config(route_name='getItem', renderer='json')
# def getItem(request):
#     itemID = request.matchdict['id']
#     cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
#     cursor = cnx.cursor()
#
#     query = ("SELECT * FROM Items WHERE ID = " + str(itemID))
#
#     cursor.execute(query)
#
#     item = None
#
#     for (ID, Name, Type, ManufactureYear, CopiesSold, Stock) in cursor:
#         item = {
#             'id': ID,
#             'name': Name,
#             'type': Type,
#             'manufactureYear': ManufactureYear,
#             'copiesSold': CopiesSold,
#             'stock': Stock
#         }
#
#     if(item is None):
#         raise exc.HTTPNoContent()
#
#     cursor.close()
#     cnx.commit()
#     cnx.close()
#
#     return item
