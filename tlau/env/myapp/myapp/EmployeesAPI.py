#pylint: disable=C,F
from pyramid.view import view_config
from pyramid.response import Response
import crypt

import pyramid.httpexceptions as exc

import mysql.connector
from myapp import Authorizer


@view_config(route_name='apiallEmployees', renderer='json')
def allEmployees(request):
    Authorizer.authorizeEmployee(request)

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Employees")

        cursor.execute(query)

        employees = []
        for employee in cursor:
            employees.append({
                'type': employee['type'],
                'id': employee['id'],
                'name': employee['firstName'] + " " + employee['lastName'],
                'firstName' : employee['firstName'],
                'lastName' : employee['lastName'],
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

    if(len(employees) == 0):
        raise exc.HTTPNoContent()

    return employees


# --------------------------------------------------------------------------------------------------------------------------------------------
@view_config(route_name='apigetEmployee', renderer='json')
def getEmployee(request):
    Authorizer.authorizeManager(request)

    employeeID = request.matchdict['id']

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Employees WHERE id = %s")

        cursor.execute(query, tuple(str(employeeID)))

        employee = {}
        for employee in cursor:
            employee = {
                'type': employee['type'],
                'id': employee['id'],
                'name': employee['firstName'] + " " + employee['lastName'],
                'firstName' : employee['firstName'],
                'lastName' : employee['lastName'],
                'address': employee['address'],
                'city': employee['city'],
                'state': employee['state'],
                'zipCode': employee['zipCode'],
                'telephone': employee['telephone'],
                'startDate': employee['startDate'].isoformat(),
                'hourlyRate': str(employee['hourlyRate']),
            }

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(employee) == 0):
        raise exc.HTTPNoContent()

    return employee


# --------------------------------------------------------------------------------------------------------------------------------------------


@view_config(route_name='apiaddEmployee', renderer='json')
def addEmployee(request):
    Authorizer.authorizeManager(request)

    requiredKeys = ['ssn', 'lastName', 'firstName', 'address', 'city', 'state', 'zipCode', 'telephone', 'startDate', 'hourlyRate', 'type']
    requiredUserKeys = ['username','password']
    postVars = request.POST
    acceptedKeys = []
    accepteduserKeys = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            print(key)
            raise exc.HTTPBadRequest()

    for key in requiredUserKeys:
        if(key not in postVars):
            raise exc.HTTPBadRequest()

    salt = 'qwerty'
    postVars['password'] = crypt.crypt(postVars['password'], salt)

    query = ("INSERT INTO Employees(ssn, lastName, firstName, address, city, state, zipCode, telephone, startDate, hourlyRate, type)\
             VALUES (%s,  %s,  %s,  %s,  %s,  %s,  %s, %s, %s, %s, %s);")

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(acceptedKeys))

        query = ("INSERT INTO Users(username, password, type, id) VALUES (%s, %s, 1, LAST_INSERT_ID())")

        cursor.execute(query, tuple([postVars['username'], postVars['password']]))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), 500)

    raise exc.HTTPOk()

# --------------------------------------------------------------------------------------------------------------------------------------------

@view_config(route_name='apideleteEmployee')
def deleteEmployee(request):
    Authorizer.authorizeManager(request)

    employeeID = request.matchdict['id']

    query= "DELETE FROM Employees WHERE id= %s"

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor()

        cursor.execute(query, tuple(employeeID))

        cursor.close()

        cnx.commit()
        cnx.close()

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()

# --------------------------------------------------------------------------------------------------------------------------------------------

@view_config(route_name='apiupdateEmployee')
def updateEmployee(request):
    Authorizer.authorizeManager(request)

    employeeID = request.matchdict['id']

    postVars = request.POST
    validKeys = ['ssn', 'lastName', 'firstName', 'address', 'city', 'state', 'zipCode', 'telephone', 'hourlyRate', 'type']
    acceptedValues = []
    queryAppend = []

    query = "UPDATE Employees SET "

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

    raise exc.HTTPOk()
