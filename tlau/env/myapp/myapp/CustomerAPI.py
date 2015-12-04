#pylint: disable=C
from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal
from myapp import Authorizer
from datetime import datetime
from decimal import Decimal
import crypt

import pyramid.httpexceptions as exc

import mysql.connector


# Get a list of all the customers
@view_config(route_name='apiallCustomers', renderer='json')
def allCustomers(request):
    Authorizer.authorizeEmployee(request)

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Customers")

        cursor.execute(query)

        items = []
        for customer in cursor:
            items.append({
                'id': customer['id'],
                'name': customer['firstName'] + customer['lastName'],
                'firstName': customer['firstName'],
                'lastName': customer['lastName'],
                'address': customer['address'],
                'city': customer['city'],
                'state': customer['state'],
                'zipCode': customer['zipCode'],
                'telephone': customer['telephone'],
                'email': customer['email'],
                'creditCardNumber': customer['creditCardNumber'],
                'itemsSold': customer['itemsSold'],
                'itemsPurchased': customer['itemsPurchased'],
                'rating': str(customer['rating'])
            })

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(items) == 0):
        raise exc.HTTPNoContent()

    return items


# Get a List of a specific Customer by ID
@view_config(route_name='apigetCustomer', renderer='json')
def getCustomer(request):
    # Authorizer.authorizeEmployee(request)

    customerID = request.matchdict['id']

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Customers WHERE id = %s")

        cursor.execute(query, tuple([str(customerID)]))

        customer = {}
        for customer in cursor:
            customer = {
                'id': customer['id'],
                'name': customer['firstName'] + " " + customer['lastName'],
                'firstName': customer['firstName'],
                'lastName': customer['lastName'],
                'address': customer['address'],
                'city': customer['city'],
                'state': customer['state'],
                'zipCode': customer['zipCode'],
                'telephone': customer['telephone'],
                'email': customer['email'],
                'creditCardNumber': customer['creditCardNumber'],
                'itemsSold': customer['itemsSold'],
                'itemsPurchased': customer['itemsPurchased'],
                'rating': str(customer['rating'])
            }

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(customer) == 0):
        raise exc.HTTPNoContent()

    return customer


# Get a List of a specific Customer by ID
@view_config(route_name='apiCustomerStats', renderer='json')
def customerStats(request):
    customerID = request.matchdict['id']

    responseDict = {}

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT SUM(currentBid) as stat FROM Auctions WHERE sellerID = %s AND finished='1'")

        cursor.execute(query, tuple([str(customerID)]))

        responseDict["moneyMade"] = (str(cursor.fetchone()['stat']))

        query = ("SELECT SUM(Auctions.currentBid) as stat FROM Auctions, Wins WHERE Auctions.id = Wins.auctionID AND Wins.customerID = %s")

        cursor.execute(query, tuple([str(customerID)]))

        responseDict["moneySpent"] = (str(cursor.fetchone()['stat']))

        query = ("SELECT COUNT(*) as stat FROM Auctions WHERE Auctions.sellerID = %s AND Auctions.finished='0'")

        cursor.execute(query, tuple([str(customerID)]))

        responseDict["activeAuctions"] = (str(cursor.fetchone()['stat']))

        query = ("SELECT COUNT(DISTINCT(Auctions.id)) as stat FROM Auctions, Bids WHERE Bids.auctionID = Auctions.id AND Bids.customerID = %s AND Auctions.finished='0'")

        cursor.execute(query, tuple([str(customerID)]))

        responseDict["activeBids"] = (str(cursor.fetchone()['stat']))

        # for row in cursor:
        #     statsRow = {}
        #     for key in row:
        #         if(isinstance(row[key], datetime)):
        #             statsRow[key] = row[key].isoformat()
        #         elif(isinstance(row[key], Decimal)):
        #             statsRow[key] = str(row[key])
        #         else:
        #             statsRow[key] = row[key]
        #     responseDict.append(statsRow)
        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return responseDict


# Add a customer
@view_config(route_name='apiaddCustomer', renderer='json')
def addCustomer(request):
    # Authorizer.authorizeCustomer(request)

    requiredCustomerKeys = ['lastName', 'firstName', 'address', 'city', 'state', 'zipCode', 'telephone', 'email', 'creditCardNumber']
    requiredUserKeys = ['username', 'password']
    postVars = request.POST
    acceptedKeys = []

    for key in requiredCustomerKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            print(key)
            raise exc.HTTPBadRequest()

    for key in requiredUserKeys:
        if(key not in postVars):
            print(key)
            raise exc.HTTPBadRequest()

    query = ("INSERT INTO Customers(lastName, firstName, address, city, state, zipCode, telephone, email, creditCardNumber)\
             VALUES (%s,  %s,  %s,  %s,  %s,  %s,  %s, %s, %s);")

    salt = 'qwerty'
    postVars['password'] = crypt.crypt(postVars['password'], salt)
    # print(postVars['password'])
    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedKeys))

        query = ("INSERT INTO Users(username, password, type, id) VALUES (%s, %s, 0, LAST_INSERT_ID())")

        cursor.execute(query, tuple([postVars['username'], postVars['password']]))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()


# Delete a customer
@view_config(route_name='apideleteCustomer')
def deleteCustomer(request):
    Authorizer.authorizeEmployee(request)

    query = "DELETE FROM Customers WHERE id= %s"

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple([request.matchdict['id']]))

        cursor.close()

        cnx.commit()
        cnx.close()

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()


# Update a customer
@view_config(route_name='apiupdateCustomer')
def updateCustomer(request):
    Authorizer.authorizeCustomer(request)

    postVars = request.POST
    validKeys = ['lastName', 'firstName', 'address', 'city', 'state', 'zipCode', 'telephone', 'email', 'creditCardNumber']
    acceptedValues = []
    queryAppend = []

    query = "UPDATE Customers SET "

    for key in validKeys:
        if key in postVars:
            queryAppend.append(key + " = %s")
            acceptedValues.append(postVars[key])

    acceptedValues.append(request.matchdict['id'])
    query = query + ', '.join(queryAppend) + " WHERE ID = %s"

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedValues))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))
    Authorizer.refreshSession(request)
    raise exc.HTTPOk()


# Get the sell history of a customer
@view_config(route_name='apisellHistory', renderer='json')
def sellHistory(request):
    sellerID = request.matchdict['id']
    history = []

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Auctions WHERE id = %s")

        cursor.execute(query, tuple([str(sellerID)]))

        for row in cursor:
            historyRow = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    historyRow[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    historyRow[key] = str(row[key])
                else:
                    historyRow[key] = row[key]
            history.append(historyRow)

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return history

# -----------------------------------------------------------------------------------------------------------------------------

@view_config(route_name='apiRateCustomer', renderer='json')
def apiRateCustomer(request):
    customerID = request.matchdict['id']
    rating = request.POST['rating']

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query= "UPDATE Customers SET rating = (rating*numRatings + %s)/(numRatings+1), numRatings = numRatings + 1 WHERE id = %s"

        cursor.execute(query, tuple([rating, customerID]))

        cursor.close()
        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    raise exc.HTTPOk()

@view_config(route_name='apiauctionHistory', renderer='json')
def auctionHistory(request):
    customerID = request.matchdict['id']
    history = {}

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)
        temp = []
        query = "SELECT * from Auctions where sellerID = %s ORDER BY closingTime DESC"
        cursor.execute(query, tuple([str(customerID)]))
        for row in cursor:
            historyRow = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    historyRow[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    historyRow[key] = str(row[key])
                else:
                    historyRow[key] = row[key]
            temp.append(historyRow)
        history['created'] = temp
        temp = []
        query = "SELECT * from Auctions JOIN (select auctionID from Bids where customerID = %s) as BidInfo ON Auctions.id = BidInfo.auctionID ORDER BY closingTime DESC"
        cursor.execute(query, tuple([str(customerID)]))
        for row in cursor:
            historyRow = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    historyRow[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    historyRow[key] = str(row[key])
                else:
                    historyRow[key] = row[key]
            temp.append(historyRow)
        history['participated'] = temp

        temp = []
        query = "SELECT * from Auctions JOIN (select auctionID from Wins where customerID = %s) as BidInfo ON Auctions.id = BidInfo.auctionID ORDER BY closingTime DESC"
        cursor.execute(query, tuple([str(customerID)]))
        for row in cursor:
            historyRow = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    historyRow[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    historyRow[key] = str(row[key])
                else:
                    historyRow[key] = row[key]
            temp.append(historyRow)
        history['won'] = temp

        for key in history:
            for row in history[key]:
                # print(row)
                query = ("SELECT name, description FROM Items WHERE id = %s")
                cursor.execute(query, tuple([str(row['itemID'])]))
                line = cursor.fetchone()
                row['itemName'] = line['name']
                row['description'] = line['description']
                query = ("SELECT url FROM ItemsImages WHERE itemID = %s")
                cursor.execute(query, tuple([str(row['itemID'])]))
                urls = []
                for line in cursor:
                    urls.append(line['url'])
                print(urls)
                row['images'] = urls

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return history
