from pyramid.view import view_config
from pyramid.response import Response

import pyramid.httpexceptions as exc

import mysql.connector

@view_config(route_name='allEmployees', renderer='json')
def allEmployees(request):
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['employeeType'] != 0):
        raise exc.HTTPForbidden()

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Employees")

        cursor.execute(query)

        items = []
        for employee in cursor:
            items.append({
                'type': employee['type'],
                'id': employee['id'],
                'name': employee['firstName'] + employee['lastName'],
                'address': employee['address'],
                'city': employee['city'],
                'state': employee['state'],
                'zipCode': employee['zipCode'],
                'telephone': employee['telephone'],
                'startDate': employee['startDate'].isoformat(),
                'hourlyRate': str(employee['hourlyRate']),
            })

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)


    if(len(items) == 0):
        raise exc.HTTPNoContent()

    return items

@view_config(route_name='addEmployee', renderer='json')
def addEmployee(request):
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['employeeType'] != 0):
        raise exc.HTTPForbidden()

    requiredKeys = ['ssn', 'lastName', 'firstName', 'address', 'city', 'state', 'zipCode', 'telephone', 'startDate', 'hourlyRate', 'type']
    postVars = request.POST
    acceptedKeys = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            raise exc.HTTPBadRequest()

    query = ("INSERT INTO Employees(ssn, lastName, firstName, address, city, state, zipCode, telephone, startDate, hourlyRate, type)\
             VALUES (%s,  %s,  %s,  %s,  %s,  %s,  %s, %s, %s, %s, %s);")

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
