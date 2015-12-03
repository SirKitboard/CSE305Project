# pylint: disable=C,F
from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from datetime import date
from decimal import Decimal
from myapp import Authorizer

import pyramid.httpexceptions as exc

import mysql.connector


@view_config(route_name='apisalesReport', renderer='json')
def salesReport(request):
    Authorizer.authorizeManager(request)

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


@view_config(route_name='apirevenueReport', renderer='json')
def revenueReport(request):
    Authorizer.authorizeManager(request)

    getVars = request.GET

    query = "SELECT ItemName, SUM(Amount) AS revenue, COUNT(Amount) AS copiesSold FROM Sales_Report WHERE "
    secondQuery = "SELECT ItemName, SUM(Amount) AS revenue, COUNT(Amount) AS copiesSold FROM Sales_Report WHERE MONTH(time) = MONTH(NOW()) AND YEAR(time) = YEAR(NOW()) AND "
    value = None
    if 'employeeID' in getVars and 'customerID' not in getVars and 'itemID' not in getVars:
        query = query + "monitorID = %s GROUP BY ItemName"
        secondQuery = secondQuery + "monitorID = %s GROUP BY ItemName"
        value = getVars['employeeID']
    elif 'employeeID' not in getVars and 'customerID' in getVars and 'itemID' not in getVars:
        query = query + "customerID = %s GROUP BY ItemName"
        secondQuery = secondQuery + "customerID = %s GROUP BY ItemName"
        value = getVars['customerID']
    elif 'employeeID' not in getVars and 'customerID' not in getVars and 'itemID' in getVars:
        query = query + "itemID = %s"
        secondQuery = secondQuery + "itemID = %s"
        value = getVars['itemID']
    else:
        raise exc.HTTPBadRequest()


    report = {}
    totalReport = []
    monthReport = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple(str(value)))

        for row in cursor:
            totalReportValues = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    totalReportValues[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    totalReportValues[key] = str(row[key])
                else:
                    totalReportValues[key] = row[key]
            totalReport.append(totalReportValues)
        report['total'] = totalReport


        cursor.execute(secondQuery, tuple(str(value)))

        for row in cursor:
            monthReportValues = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    monthReportValues[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    monthReportValues[key] = str(row[key])
                else:
                    monthReportValues[key] = row[key]
            monthReport.append(monthReportValues)
        report['month'] = monthReport

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return report

@view_config(route_name='apiRevenueStats', renderer='json')
def apiRevenueStats(request):
    Authorizer.authorizeManager(request)

    getVars = request.GET

    query1 = "SELECT SUM(Amount) AS revenue, COUNT(Amount) AS copiesSold, Items.* FROM Sales_Report LEFT JOIN Items on Items.id = Sales_Report.itemID GROUP BY itemID ORDER BY revenue DESC LIMIT 1"
    query2 = "SELECT SUM(Amount) AS revenue, COUNT(Amount) AS copiesSold, Customers.* FROM Sales_Report LEFT JOIN Customers on Customers.id = Sales_Report.sellerID GROUP BY customerID ORDER BY revenue DESC LIMIT 1;"
    query3 = "SELECT SUM(Amount) AS revenue, COUNT(Amount) AS copiesSold, Employees.* FROM Sales_Report LEFT JOIN Employees on Employees.id = Sales_Report.monitorID GROUP BY monitorID ORDER BY revenue DESC LIMIT 1;"

    stats = {}
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query1)
        row = cursor.fetchone()
        stat = {}
        for key in row:
            if(isinstance(row[key], datetime)):
                stat[key] = row[key].isoformat()
            elif(isinstance(row[key], Decimal)):
                stat[key] = str(row[key])
            else:
                stat[key] = row[key]

        stats['item'] = stat

        query1 = "SELECT * FROM ItemsImages WHERE itemID = %s"
        cursor.execute(query1, tuple(str(stat['id'])))
        images = []
        for row in cursor:
            images.append(row['url'])
        stats['item']['images'] = images

        cursor.execute(query2)
        row = cursor.fetchone()
        stat = {}
        for key in row:
            if(isinstance(row[key], datetime)):
                stat[key] = row[key].isoformat()
            elif(isinstance(row[key], Decimal)):
                stat[key] = str(row[key])
            else:
                stat[key] = row[key]

        stats['customer'] = stat

        cursor.execute(query3)
        row = cursor.fetchone()
        stat = {}
        for key in row:
            if(isinstance(row[key], datetime)):
                stat[key] = row[key].isoformat()
            if(isinstance(row[key], date)):
                stat[key] = row[key].isoformat()
            elif(isinstance(row[key], Decimal)):
                stat[key] = str(row[key])
            else:
                stat[key] = row[key]

        stats['employee'] = stat

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return stats


# -----------------------------------------------------------------------------------------------------------------------------


@view_config(route_name='apireceipt', renderer='json')
def receipt(request):
    getVars = request.GET
    customerID = getVars['id']
    receiptsOfCustomer = {}

    query = "SELECT * FROM Sales_Report WHERE customerID = %s"

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        cursor.execute(query, tuple([str(customerID)]))
        temp = []
        for row in cursor:
            receipt = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    receipt[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    receipt[key] = str(row[key])
                else:
                    receipt[key] = row[key]
            temp.append(receipt)

        receiptsOfCustomer['bought'] = temp

        query = "SELECT * FROM Sales_Report WHERE sellerID = %s"

        cursor.execute(query, tuple([str(customerID)]))
        temp = []
        for row in cursor:
            receipt = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    receipt[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    receipt[key] = str(row[key])
                else:
                    receipt[key] = row[key]
            temp.append(receipt)

        receiptsOfCustomer['sold'] = temp

        for key in receiptsOfCustomer:
            for row in receiptsOfCustomer[key]:
                # print(row)
                query = ("SELECT * FROM Customers WHERE id = %s")
                cursor.execute(query, tuple([str(row['sellerID'])]))
                line = cursor.fetchone()
                row['sellerName'] = line['firstName'] + " " + line['lastName']

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

    return receiptsOfCustomer

# -----------------------------------------------------------------------------------------------------------------------------

@view_config(route_name='apimailingList', renderer='json')
def mailingList(request):
    Authorizer.authorizeEmployee(request)

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
