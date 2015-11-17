#pylint: disable=W,C
from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal

import pyramid.httpexceptions as exc

import mysql.connector


@view_config(route_name='allItems', renderer='json')
def allItems(request):
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        query = ("SELECT * FROM Items")

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

        cursor = cnx.cursor(dictionary=True)

        for item in items:
            query = ("SELECT url FROM ItemsImages WHERE itemID = %s")
            cursor.execute(query, tuple(str(item['id'])))
            urls = []
            for row in cursor:
                urls.append(row['url'])
            item['images'] = urls


        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(items) == 0):
        raise exc.HTTPNoContent()

    return items


@view_config(route_name='getItem', renderer='json')
def getItem(request):
    itemID = request.matchdict['id']

    item = None

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        query = ("SELECT * FROM Items WHERE ID = " + str(itemID))

        cursor.execute(query)

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
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT url FROM ItemsImages WHERE itemID = %s")
        cursor.execute(query, tuple(str(item['id'])))
        urls = []
        for row in cursor:
            urls.append(row['url'])
        item['images'] = urls

        cursor.close()
        cnx.close()

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return item


@view_config(route_name='addItem', renderer='json', request_method='POST')
def addItem(request):
    requiredKeys = ['name', 'type', 'manufactureYear', 'stock']
    postVars = request.POST
    acceptedValues = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedValues.append(postVars[key])
        else:
            raise exc.HTTPBadRequest()

    query = ("INSERT INTO Items (name, type, manufactureYear, stock) VALUES (%s, %s, %s, %s)")

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedValues))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    raise exc.HTTPOk()


@view_config(route_name='updateItem')
def updateItem(request):
    postVars = request.POST
    validKeys = ['name', 'type', 'manufactureYear', 'stock']
    acceptedValues = []
    queryAppend = []

    query = "UPDATE Items SET "

    for key in validKeys:
        if key in postVars:
            queryAppend.append(key + " = %s")
            acceptedValues.append(postVars[key])

    acceptedValues.append(request.matchdict['id'])
    query = query + ', '.join(queryAppend) + " WHERE ID = %s"

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedValues))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()


@view_config(route_name= 'deleteItem')
def deleteItem(request):
    query= "DELETE FROM Items WHERE id= %s"

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple([request.matchdict['id']]))

        cursor.close()

        cnx.commit()
        cnx.close()

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()

@view_config(route_name='itemSuggestions', renderer='json')
def itemSuggestions(request):
    session = request.session
    customerID = None
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        customerID = session['currentUser']['id']
    else:
        if('customerID' in request.GET):
            customerID = request.GET['customerID']
        else:
            raise exc.HTTPBadRequest()

    query = """
        SELECT * FROM Items WHERE type IN (
            SELECT type FROM Items WHERE id IN (
                SELECT itemID FROM Searches WHERE customerID = %s
                )
            )
        AND Items.name NOT IN (
            SELECT name FROM Items WHERE id IN (
                SELECT itemID FROM Auctions WHERE id IN (
                    SELECT auctionID FROM Bids
                    )
                )
            )
        """

    suggestedItems = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple(str(customerID)))

        for row in cursor:
            item = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    item[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    item[key] = str(row[key])
                else:
                    item[key] = row[key]
            suggestedItems.append(item)

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return suggestedItems
