#pylint: disable=W,C
from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal
from myapp import Authorizer

import pyramid.httpexceptions as exc

import mysql.connector


@view_config(route_name='apiAllMailingLists', renderer='json')
def apiAllMailingLists(request):
    Authorizer.authorizeEmployee(request)
    mailingLists = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM MailingLists")
        cursor.execute(query)
        for row in cursor:
            mailingLists.append({
                'id' : row['id'],
                'createdBy': row['createdBy'],
                'name' : row['name']
            })

        query = "SELECT C.* from MailingListsMappings JOIN (SELECT id, firstName, lastName, email FROM Customers) as C ON C.id = MailingListsMappings.customerID and MailingListsMappings.listID = %s"

        for mailingList in mailingLists:
            cursor.execute(query, tuple([str(mailingList['id'])]))
            customers = []
            for row in cursor:
                print(row)
                customers.append({
                    'id' : row['id'],
                    'name' : row['firstName'] + " " + row['lastName'],
                    'email' : row['email']
                })
                mailingList['customers'] = customers


        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return mailingLists

@view_config(route_name='apiGetMailingList', renderer='json')
def apiGetMailingList(request):
    Authorizer.authorizeEmployee(request)
    mailingListID = request.matchdict['id']
    mailingLists = {}
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM MailingLists where id = %s")
        cursor.execute(query, tuple([str(mailingListID)]))

        for row in cursor:
            mailingList = {
                'id' : row['id'],
                'createdBy': row['createdBy'],
                'name' : row['name']
            }

        query = "SELECT C.* from MailingListsMappings LEFT JOIN (SELECT id, firstName, lastName, email FROM Customers) as C ON C.id = MailingListsMappings.customerID and MailingListsMappings.listID = %s"

        cursor.execute(query, tuple([str(mailingList['id'])]))
        customers = []
        for row in cursor:
            customers.append({
                'id' : row['id'],
                'name' : row['firstName'] + " " + row['lastName'],
                'email' : row['email']
            })
            mailingList['customers'] = customers


        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return mailingLists

@view_config(route_name='apiAddMailingList', renderer='json')
def apiAddMailingList(request):
    Authorizer.authorizeEmployee(request)
    postVars = request.POST
    print(postVars)
    if 'name' not in postVars:
        raise exc.HTTPBadRequest()

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = "INSERT INTO MailingLists(name, createdBy) VALUES(%s, %s)"
        cursor.execute(query, tuple([postVars['name'], Authorizer.getCurrentUser(request)['id']]))

        if 'customers[]' in postVars:
            # postVars.getall('customers[]')
            query = "SELECT LAST_INSERT_ID() as id"
            cursor.execute(query)
            mailingListID = cursor.fetchone()['id']
            print (mailingListID)
            for customerID in postVars.getall('customers[]'):
                print(customerID)
                query = "SELECT COUNT(*) as count FROM Customers where id = %s"
                cursor.execute(query, tuple([str(customerID)]))
                count = cursor.fetchone()['count']
                if(count!=0):
                    query = "INSERT INTO MailingListsMappings(listID, customerID) VALUES (%s, %s)"
                    cursor.execute(query, tuple([mailingListID, customerID]))
                else:
                    raise exc.HTTPBadRequest()

        cursor.close()
        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    raise exc.HTTPOk()
    # return mailingLists

@view_config(route_name='apiAddCustomerToList', renderer='json')
def apiAddCustomerToList(request):
    Authorizer.authorizeEmployee(request)
    mailingListID = request.matchdict['id']
    postVars = request.POST
    if('customerID' not in postVars):
        raise exc.HTTPBadRequest()

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = "SELECT COUNT(*) as count FROM MailingLists where id = %s"
        cursor.execute(query, tuple([str(mailingListID)]))
        count = cursor.fetchone()['count']

        if(count!=0):
            query = "SELECT COUNT(*) as count FROM Customers where id = %s"
            cursor.execute(query, tuple([str(customerID)]))
            count = cursor.fetchone()['count']
            if(count!=0):
                query = "INSERT INTO MailingListsMappings(listID, customerID) VALUES (%s, %s)"
                cursor.execute(query, tuple([mailingListID, customerID]))
            else:
                raise exc.HTTPBadRequest()
        else:
            raise exc.HTTPBadRequest()

        cursor.close()
        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return mailingLists

@view_config(route_name='apiDeleteCustomerFromList', renderer='json')
def apiDeleteCustomerFromList(request):
    Authorizer.authorizeEmployee(request)
    mailingListID = request.matchdict['id']
    postVars = request.POST
    if('customerID' not in postVars):
        raise exc.HTTPBadRequest()

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = "SELECT COUNT(*) as count FROM MailingLists where id = %s"
        cursor.execute(query, tuple([str(mailingListID)]))
        count = cursor.fetchone()['count']

        if(count!=0):
            query = "SELECT COUNT(*) as count FROM Customers where id = %s"
            cursor.execute(query, tuple([str(customerID)]))
            count = cursor.fetchone()['count']
            if(count!=0):
                query = "DELETE FROM MailingListsMappings WHERE listID = %s AND customerID = %s"
                cursor.execute(query, tuple([mailingListID, customerID]))
            else:
                raise exc.HTTPBadRequest()
        else:
            raise exc.HTTPBadRequest()

        cursor.close()
        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return mailingLists
