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
        query = ("SELECT Type, ID FROM Users WHERE Username=%s AND Password=%s")

        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor1 = cnx.cursor()
        cursor2 = cnx.cursor(dictionary=True)

        cursor1.execute(query, (acceptedKeys[0], cryptedPassword))
        row = cursor1.fetchone()

        if(row[0] != int(acceptedKeys[2])):
            cursor1.close()
            cursor2.close(dictionary=True)
            cnx.close()
            raise exc.HTTPUnauthorized()

        if(row[0] == 0):
            query = ("SELECT * FROM Customers WHERE ID = %s")
            cursor2.execute(query, tuple(str(row[1])))

            for row in cursor2:
                print(row)
                user = {
                    'type': 0,
                    'id': row['ID'],
                    'name': row['FirstName'] + row['LastName'],
                    'address': row['Address'],
                    'city': row['City'],
                    'state': row['State'],
                    'zipCode': row['ZipCode'],
                    'telephone': row['Telephone'],
                    'email': row['Email'],
                    'itemsSold': row['ItemsSold'],
                    'itemsPurchased': row['ItemsPurchased'],
                    'rating': row['Rating']
                }
                session['currentUser'] = user
        else:
            query = ("SELECT * FROM Employees WHERE ID = %s")
            cursor2.execute(query, (row[1]))

            for row in cursor2:
                user = {
                    'type': 1,
                    'id': row['ID'],
                    'name': row['FirstName'] + row['LastName'],
                    'address': row['Address'],
                    'city': row['City'],
                    'state': row['State'],
                    'zipCode': row['ZipCode'],
                    'telephone': row['Telephone'],
                    'startDate': row['startDate'],
                    'hourlyRate': row['hourlyRate'],
                    'employeeType': row['type'],
                }
                session['currentUser'] = user

        cursor2.close()
        cursor1.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err))
        cursor2.close()
        cursor1.close()
        cnx.close()

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

# @view_config(route_name='allItems''], renderer='json')
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
