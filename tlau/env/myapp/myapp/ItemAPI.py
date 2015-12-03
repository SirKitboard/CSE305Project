#pylint: disable=W,C
from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal
from myapp import Authorizer

import pyramid.httpexceptions as exc

import mysql.connector

@view_config(route_name='apiallItems', renderer='json')
def allItems(request):
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        query = ("SELECT * FROM Items ORDER BY copiesSold DESC")

        cursor.execute(query)

        items = []
        for (ID, Name, Type, ManufactureYear, CopiesSold, Stock, Description) in cursor:
            items.append({
                'id': ID,
                'name': Name,
                'type': Type,
                'manufactureYear': ManufactureYear,
                'copiesSold': CopiesSold,
                'stock': Stock,
                'description' : Description
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

@view_config(route_name='apiItemTypes', renderer='json')
def apiItemTypes(request):
    types = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT DISTINCT(type) as type FROM Items")

        cursor.execute(query)

        for row in cursor:
            types.append(row['type'])

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return types


@view_config(route_name='apigetItem', renderer='json')
def getItem(request):
    itemID = request.matchdict['id']

    item = None

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        query = ("SELECT * FROM Items WHERE ID = " + str(itemID))

        cursor.execute(query)

        for (ID, Name, Type, ManufactureYear, CopiesSold, Stock, Description) in cursor:
            item = {
                'id': ID,
                'name': Name,
                'type': Type,
                'manufactureYear': ManufactureYear,
                'copiesSold': CopiesSold,
                'stock': Stock,
                'description' : Description
            }

        if(item is None):
            cursor.close()
            cnx.close()
            raise exc.HTTPNoContent()

        cursor.close()
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT url FROM ItemsImages WHERE itemID = %s")
        cursor.execute(query, tuple(str(item['id'])))
        urls = []
        for row in cursor:
            urls.append(row['url'])
        item['images'] = urls

        if 'currentUser' in request.session:
            customer = request.session['currentUser']
            cursor.close()
            cursor = cnx.cursor(dictionary=True, buffered=True)
            if customer['type'] == 0:
                query = "SELECT * from Searches WHERE customerID = %s AND itemID = %s"
                cursor.execute(query, tuple([str(customer['id']), str(item['id'])]))
                numRows = cursor.rowcount
                print(numRows)
                if numRows > 0:
                    frequency = cursor.fetchone()['frequency']
                    query = "UPDATE Searches SET frequency = %s WHERE customerID = %s AND itemID = %s"
                    cursor.execute(query, tuple([frequency+1, customer['id'], item['id']]))
                else:
                    for row in cursor:
                        print('hi')
                    query = "INSERT INTO Searches (frequency, customerID, itemID) VALUES (1, %s, %s)"
                    cursor.execute(query, tuple([str(customer['id']), str(item['id'])]))
                    print('something')

        cursor.close()
        cnx.commit()
        cnx.close()

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)


    return item


@view_config(route_name='apigetItemThumbnails', renderer='json')
def getItemThumbnails(request):
    itemID = request.matchdict['id']

    thumbnails = []

    item = None

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        query = ("SELECT * FROM Items WHERE ID = " + str(itemID))

        cursor.execute(query)

        for (ID, Name, Type, ManufactureYear, CopiesSold, Stock, Description) in cursor:
            item = {
                'id': ID,
                'name': Name,
                'type': Type,
                'manufactureYear': ManufactureYear,
                'copiesSold': CopiesSold,
                'stock': Stock,
                'description' : Description
            }

        cursor.close()

        if(item is None):
            cnx.close()
            raise exc.HTTPNoContent()

        cursor.close()
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT url FROM ItemsImages WHERE itemID = %s")
        cursor.execute(query, tuple(str(item['id'])))
        urls = []
        for row in cursor:
            urls.append(row['url'])

        cursor.close()
        cnx.close()

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return urls


@view_config(route_name='apiaddItem', renderer='json', request_method='POST')
def addItem(request):
    requiredKeys = ['name', 'type', 'manufactureYear', 'description']
    postVars = request.POST
    acceptedValues = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedValues.append(postVars[key])
        else:
            raise exc.HTTPBadRequest()

    query = ("INSERT INTO Items (name, type, manufactureYear, description) VALUES (%s, %s, %s, %s)")

    item = {}

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedValues))

        query = ("SELECT * FROM Items WHERE ID = LAST_INSERT_ID()")

        cursor.execute(query)

        for (ID, Name, Type, ManufactureYear, CopiesSold, Stock, Description) in cursor:
            item = {
                'id': ID,
                'name': Name,
                'type': Type,
                'manufactureYear': ManufactureYear,
                'copiesSold': CopiesSold,
                'stock': Stock,
                'description' : Description
            }

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return item


@view_config(route_name='apiupdateItem')
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


@view_config(route_name='apideleteItem')
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


@view_config(route_name='apiitemSuggestions', renderer='json')
def itemSuggestions(request):
    Authorizer.authorizeCustomer(request)

    session = request.session
    customerID = None
    if(Authorizer.getCurrentUserType(request) == 0):
        customerID = Authorizer.getCurrentUser(request)['id']
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
                    SELECT auctionID FROM Bids WHERE customerID = %s
                    )
                )
            )
        LIMIT 5
        """

    suggestedItems = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple([str(customerID), str(customerID)]))

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

        for item in suggestedItems:
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

    return suggestedItems


#  Items available by type or keyword
@view_config(route_name='apisearch', renderer='json')
def search(request):
    getVars = request.GET

    query = """
          SELECT *
          FROM Items
          WHERE
         """

    items = []
    validValues = []

    if 'type' in getVars and 'keyword' in getVars:
        query = query + ' Type = %s AND Name LIKE %s' + ';'
        validValues.append(getVars['type'])
        validValues.append('%' + getVars['keyword'] + '%')
    elif 'type' in getVars:
        query = query + ' Type = %s' + ';'
        validValues.append(getVars['type'])
    elif 'keyword' in getVars:
        query = query + ' Name LIKE %s' + ';'
        validValues.append('%' + getVars['keyword'] + '%')

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple(validValues))

        for row in cursor:
            searches = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    searches[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    searches[key] = str(row[key])
                else:
                    searches[key] = row[key]
            items.append(searches)

        for item in items:
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

    return items


# Record a sale
@view_config(route_name='apisold', renderer='json')
def sold(request):
    Authorizer.authorizeEmployee(request)

    postVars = request.POST
    requiredKeys = ['bidID', 'customerID', 'auctionID', 'itemID']
    for key in requiredKeys:
        if(key not in postVars):
            raise exc.HTTPBadRequest()
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = """
        INSERT INTO Wins (BidID, Time, CustomerID, AuctionID)
        VALUES (%s,NOW(),%s, %s);
        """

        cursor.execute(query, tuple([str(postVars['bidID']), str(postVars['customerID']), str(postVars['auctionID'])]))

        query = """
        UPDATE Items
        SET CopiesSold = CopiesSold + 1, Stock=Stock-1
        WHERE ID= %s
        """

        cursor.execute(query, tuple(str(postVars['itemID'])))

        query = """
        UPDATE Customers
        SET ItemsSold=ItemsSold+1
        WHERE ID = (SELECT SellerID
            FROM Auctions
            WHERE ID = %s);
        """
        cursor.execute(query, tuple(str(postVars['auctionID'])))

        query = """
        UPDATE Customers
        SET ItemsPurchased=ItemsPurchased+1
        WHERE ID = %s

            """
        cursor.execute(query, tuple(str(postVars['customerID'])))

        cursor.close()
        cnx.commit()
        cnx.close()

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    raise exc.HTTPOk()

@view_config(route_name='apiHotItems', renderer='json')
def apiHotItems(request):
    query = """
        SELECT * FROM Items LEFT JOIN ( Select itemID, SUM(frequency) as frq FROM Searches GROUP BY itemID) AS Search on Items.id = Search.itemID ORDER BY (Search.frq) DESC LIMIT 5
        """

    hotItems = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query)

        for row in cursor:
            item = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    item[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    item[key] = str(row[key])
                else:
                    item[key] = row[key]
            hotItems.append(item)

        for item in hotItems:
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

    return hotItems

@view_config(route_name='apiBestSellers', renderer='json')
def apiBestSellers(request):
    query = """
        SELECT * FROM Items ORDER BY copiesSold DESC LIMIT 5
        """

    hotItems = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query)

        for row in cursor:
            item = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    item[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    item[key] = str(row[key])
                else:
                    item[key] = row[key]
            hotItems.append(item)

        for item in hotItems:
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

    return hotItems
