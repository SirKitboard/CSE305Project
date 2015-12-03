import pyramid.httpexceptions as exc
import mysql.connector

def isLoggedIn(request):
    if('currentUser' in request.session):
        return True
    else:
        return False

def getCurrentUser(request):
    if(isLoggedIn(request)):
        return request.session['currentUser']
    else:
        return None

def getCurrentUserType(request):
    if(isLoggedIn(request)):
        return request.session['currentUser']['type']

def authorizeCustomer(request):
    if(isLoggedIn(request)):
        return True
    raise exc.HTTPForbidden()

def authorizeEmployee(request):
    if(isLoggedIn(request)):
        if(getCurrentUserType(request) == 1):
            return True
    raise exc.HTTPForbidden()

def authorizeManager(request):
    authorizeEmployee(request)
    if(getCurrentUser(request)['employeeType'] == 0):
        return True
    raise exc.HTTPForbidden()

def refreshSession(request):
    authorizeCustomer(request)
    session = request.session
    try:
        query = ("SELECT type, id FROM Users WHERE username=%s AND password=%s")

        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor1 = cnx.cursor(dictionary=True)

        if(request.session['currentUser']['type'] == 0):
            query = ("SELECT * FROM Customers WHERE id = %s")
            cursor1.execute(query, tuple(str(request.session['currentUser']['id'])))

            for row in cursor1:
                print(row)
                user = {
                    'type': 0,
                    'id': row['id'],
                    'name': row['firstName'] + " " + row['lastName'],
                    'firstName': row['firstName'],
                    'lastName': row['lastName'],
                    'address': row['address'],
                    'city': row['city'],
                    'state': row['state'],
                    'zipCode': row['zipCode'],
                    'telephone': row['telephone'],
                    'email': row['email'],
                    'itemsSold': row['itemsSold'],
                    'itemsPurchased': row['itemsPurchased'],
                    'rating': str(row['rating']),
                    'creditCardNumber' : row['creditCardNumber']
                }
                session['currentUser'] = user
        else:
            query = ("SELECT * FROM Employees WHERE id = %s")
            cursor1.execute(query, tuple(str(request.session['currentUser']['id'])))

            for row in cursor1:
                user = {
                    'type': 1,
                    'id': row['id'],
                    'name': row['firstName'] + " " + row['lastName'],
                    'firstName': row['firstName'],
                    'lastName': row['lastName'],
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
    except mysql.connector.Error as err:
        cursor1.close()
        cnx.close()
        # raise
