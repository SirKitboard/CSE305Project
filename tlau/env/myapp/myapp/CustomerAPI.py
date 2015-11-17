from pyramid.view import view_config
from pyramid.response import Response

import pyramid.httpexceptions as exc

import mysql.connector


# Get a list of all the customers
@view_config(route_name='allCustomers', renderer='json')
def allCustomers(request):
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()

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
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()

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
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()

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


# Update a customer


