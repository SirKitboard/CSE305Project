#pylint: disable=C
from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal
import Authorizer

import pyramid.httpexceptions as exc

import mysql.connector


# Get a list of all the customers
@view_config(route_name='allCustomers', renderer='json')
def allCustomers(request):
    Authorizer.authorizeEmployee(request)

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Customers")

        cursor.execute(query)

        items = []
        for customer in cursor:
            items.append({
                'id': customer['id'],
                'name': customer['firstName'] + customer['lastName'],
                'address': customer['address'],
                'city': customer['city'],
                'state': customer['state'],
                'zipCode': customer['zipCode'],
                'telephone': customer['telephone'],
                'email': customer['email'],
                'creditCardNumber': customer['creditCardNumber'],
                'itemsSold': customer['itemsSold'],
                'itemsPurchased': customer['itemsPurchased'],
                'rating': customer['rating']
            })

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(items) == 0):
        raise exc.HTTPNoContent()

    return items


# Get a List of a specific Customer by ID
@view_config(route_name='getCustomer', renderer='json')
def getCustomer(request):
    Authorizer.authorizeEmployee(request)

    customerID = request.matchdict['id']

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Customers WHERE id = %s")

        cursor.execute(query, tuple(str(customerID)))

        customer = {}
        for customer in cursor:
            customer = {
                'id': customer['id'],
                'name': customer['firstName'] + " " + customer['lastName'],
                'address': customer['address'],
                'city': customer['city'],
                'state': customer['state'],
                'zipCode': customer['zipCode'],
                'telephone': customer['telephone'],
                'email': customer['email'],
                'creditCardNumber': customer['creditCardNumber'],
                'itemsSold': customer['itemsSold'],
                'itemsPurchased': customer['itemsPurchased'],
                'rating': customer['rating']
            }

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(customer) == 0):
        raise exc.HTTPNoContent()

    return customer


# Add a customer
@view_config(route_name='addCustomer', renderer='json')
def addCustomer(request):
    Authorizer.authorizeEmployee(request)

    requiredKeys = ['lastName', 'firstName', 'address', 'city', 'state', 'zipCode', 'telephone', 'email', 'creditCardNumber']
    postVars = request.POST
    acceptedKeys = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            raise exc.HTTPBadRequest()

    query = ("INSERT INTO Customers(lastName, firstName, address, city, state, zipCode, telephone, email, creditCardNumber)\
             VALUES (%s,  %s,  %s,  %s,  %s,  %s,  %s, %s, %s);")

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


# Delete a customer
@view_config(route_name='deleteCustomer')
def deleteCustomer(request):
    Authorizer.authorizeEmployee(request)

    query = "DELETE FROM Customers WHERE id= %s"

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


# Update a customer
@view_config(route_name='updateCustomer')
def updateCustomer(request):
    Authorizer.authorizeEmployee(request)

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
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedValues))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()


# Get the sell history of a customer
@view_config(route_name='sellHistory', renderer='json')
def sellHistory(request):
    sellerID = request.matchdict['id']
    history = []

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Auctions WHERE id = %s")

        cursor.execute(query, tuple(str(sellerID)))

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

@view_config(route_name='auctionHistory', renderer='json')
def auctionHistory(request):
    sellerID = request.matchdict['id']
    history = []

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = """
            SELECT * FROM Auctions WHERE ID IN (
                SELECT AuctionID
                FROM Bids
                WHERE CustomerID = %s
            );
        """

        cursor.execute(query, tuple(str(sellerID)))

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
