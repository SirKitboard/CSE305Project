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
    session = request.session

    if('currentUser' in session):
        return session['currentUser']

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            raise exc.HTTPBadRequest()

    salt = 'qwerty'
    cryptedPassword = crypt.crypt(acceptedKeys[1], salt)
    print(cryptedPassword)
    try:
        query = ("SELECT type, id FROM Users WHERE username=%s AND password=%s")

        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor1 = cnx.cursor(dictionary=True)

        cursor1.execute(query, (acceptedKeys[0], cryptedPassword))
        row = cursor1.fetchone()
        print(row)
        if(row['type'] != int(acceptedKeys[2])):
            cursor1.close()
            cnx.close()
            raise exc.HTTPUnauthorized()

        if(row['type'] == 0):
            query = ("SELECT * FROM Customers WHERE id = %s")
            cursor1.execute(query, tuple(str(row['id'])))

            for row in cursor1:
                print(row)
                user = {
                    'type': 0,
                    'id': row['id'],
                    'name': row['firstName'] + " " + row['lastName'],
                    'address': row['address'],
                    'city': row['city'],
                    'state': row['state'],
                    'zipCode': row['zipCode'],
                    'telephone': row['telephone'],
                    'email': row['email'],
                    'itemsSold': row['itemsSold'],
                    'itemsPurchased': row['itemsPurchased'],
                    'rating': row['rating']
                }
                session['currentUser'] = user
        else:
            query = ("SELECT * FROM Employees WHERE id = %s")
            cursor1.execute(query, tuple(str(row['id'])))

            for row in cursor1:
                user = {
                    'type': 1,
                    'id': row['id'],
                    'name': row['firstName'] + " " + row['lastName'],
                    'address': row['address'],
                    'city': row['city'],
                    'state': row['state'],
                    'zipCode': row['zipCode'],
                    'telephone': row['telephone'],
                    'startDate': row['startDate'].isoformat(),
                    'hourlyRate': str(row['hourlyRate']),
                    'employeeType': row['type'],
                }
                session['currentUser'] = user

        cursor1.close()
        cnx.close()
    except mysql.connector.Error as err:
        cursor1.close()
        cnx.close()
        return Response("Something went wrong: {}".format(err))

    return session['currentUser']
    raise exc.HTTPOk()


@view_config(route_name='logout')
def logout(request):
    session = request.session

    if 'currentUser' not in session:
        raise exc.HTTPOk()
    else:
        session.pop('currentUser')
        raise exc.HTTPOk()


@view_config(route_name='currentUser', renderer='json')
def currentUser(request):
    session = request.session
    if 'currentUser' in session:
        return session['currentUser']
    else:
        raise exc.HTTPUnauthorized()
