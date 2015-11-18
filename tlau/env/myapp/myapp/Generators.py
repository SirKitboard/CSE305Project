# pylint: disable=C,F
from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal


import pyramid.httpexceptions as exc

import mysql.connector


@view_config(route_name='salesReport', renderer='json')
def salesReport(request):
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['employeeType'] != 0):
        raise exc.HTTPForbidden()

    getVars = request.GET

    validKeys = ['month', 'year', 'itemID', 'customerID', 'itemType']

    acceptedValues = []
    queryAppend = []
    report = []

    query = "SELECT * FROM Sales_Report WHERE "

    for key in validKeys:
        if key in getVars:
            if(key == 'month'):
                queryAppend.append('MONTH(time) = %s')
                acceptedValues.append(getVars[key])
            elif(key == 'year'):
                queryAppend.append('YEAR(time) = %s')
                acceptedValues.append(getVars[key])
            else:
                queryAppend.append(key + " = %s")
                acceptedValues.append(getVars[key])

    query = query + ' AND '.join(queryAppend)

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple(acceptedValues))

        for row in cursor:
            reportValues = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    reportValues[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    reportValues[key] = str(row[key])
                else:
                    reportValues[key] = row[key]
            report.append(reportValues)

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return report

# --------------------------------------------------------------------------------------------------------------------------------------------


@view_config(route_name='revenueReport', renderer='json')
def revenueReport(request):
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['employeeType'] != 0):
        raise exc.HTTPForbidden()

    getVars = request.GET

    query = "SELECT ItemName, SUM(Amount) AS Revenue, COUNT(Amount) AS CopiesSold FROM Sales_Report WHERE "
    value = None
    if 'employeeID' in getVars and 'customerID' not in getVars:
        query = query + "monitorID = %s GROUP BY ItemName"
        value = getVars['employeeID']
    elif 'employeeID' not in getVars and 'customerID' in getVars:
        query = query + "customerID = %s GROUP BY ItemName"
        value = getVars['customerID']
    else:
        raise exc.HTTPBadRequest()

    report = []

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple(str(value)))

        for row in cursor:
            reportValues = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    reportValues[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    reportValues[key] = str(row[key])
                else:
                    reportValues[key] = row[key]
            report.append(reportValues)
        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return report

# -----------------------------------------------------------------------------------------------------------------------------


@view_config(route_name='receipt', renderer='json')
def receipt(request):
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()

    getVars = request.GET
    auctionID = getVars['auctionID']

    receiptOfCustomer = {}

    query = "SELECT * FROM Receipts WHERE auctionID = %s"

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple(str(auctionID)))

        for row in cursor:
            for key in row:
                if(isinstance(row[key], datetime)):
                    receiptOfCustomer[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    receiptOfCustomer[key] = str(row[key])
                else:
                    receiptOfCustomer[key] = row[key]

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(session['currentUser']['id'] != receiptOfCustomer['customerID']):
        raise exc.HTTPForbidden()

    return receiptOfCustomer

# -----------------------------------------------------------------------------------------------------------------------------

@view_config(route_name='mailingList', renderer='json')
def mailingList(request):
    session = request.session
    if('currentUser' not in session):
        raise exc.HTTPForbidden()
    elif(session['currentUser']['type'] == 0):
        raise exc.HTTPForbidden()

    query = """SELECT email, concat(lastName, ' ', firstName) AS name FROM Customers"""

    mailingList = []

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query)

        for row in cursor:
            customer = {}
            for key in row:
                customer[key] = row[key]
            mailingList.append(customer)

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return mailingList
