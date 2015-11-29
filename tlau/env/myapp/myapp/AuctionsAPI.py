from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal
from myapp import Authorizer
from random import randint
import time

import pyramid.httpexceptions as exc

import mysql.connector

@view_config(route_name='apiGetOpenAuctions', renderer='json')
def openAuctions(request):
    auctions = []
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Auctions LEFT JOIN Items ON Auctions.itemID = Items.id where closingTime > NOW()")

        cursor.execute(query)

        for row in cursor:
            auctionInfo = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    auctionInfo[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    auctionInfo[key] = str(row[key])
                else:
                    auctionInfo[key] = row[key]
            auctions.append(auctionInfo)

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return auctions


@view_config(route_name='apiGetAuction', renderer='json')
def getAuction(request):
    auctionID = request.matchdict['id']
    auction = {}
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Auctions where id = %s")

        cursor.execute(query, tuple(str(auctionID)))

        for row in cursor:
            auctionInfo = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    auctionInfo[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    auctionInfo[key] = str(row[key])
                else:
                    auctionInfo[key] = row[key]
            auction = auctionInfo

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return auction


@view_config(route_name='apibidHistory', renderer='json')
def bidHistory(request):
    auctionID = request.matchdict['id']
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Bids LEFT JOIN (SELECT firstName, lastName, id FROM Customers) AS CustomerInfo ON Bids.customerID = CustomerInfo.id WHERE Bids.auctionID = %s ORDER BY Bids.time ASC")

        cursor.execute(query, tuple(str(auctionID)))

        history = []
        for row in cursor:
            history.append({
                'id': row['id'],
                'time': row['time'].isoformat(),
                'amount': str(row['amount']),
                'customerID': row['customerID'],
                'auctionID': row['auctionID'],
                'maxBid': str(row['maxBid']),
                'itemID': row['itemID'],
                'name': row['firstName'] + " " + row['lastName']
            })

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(history) == 0):
        raise exc.HTTPNoContent()

    return history


@view_config(route_name="apiSearchAuction", renderer='json')
def apiAuctionSearch(request):
    getVars = request.GET
    # requiredKeys = 'itemID'
    if('itemID' not in getVars):
        raise exc.HTTPBadRequest()

    searchResults = []

    try :
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = "SELECT * FROM Auctions WHERE closingTime > NOW() AND itemID = %s"

        cursor.execute(query, tuple(str(getVars['itemID'])))

        for row in cursor:
            auctionInfo = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    auctionInfo[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    auctionInfo[key] = str(row[key])
                else:
                    auctionInfo[key] = row[key]
            searchResults.append(auctionInfo)

    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return searchResults

# Add a customer
@view_config(route_name='apiAddAuction', renderer='json')
def addAuction(request):
    Authorizer.authorizeCustomer(request)

    requiredKeys = ['itemID', 'sellerID', 'closingTime', 'openingBid', 'reserve', 'increment']
    postVars = request.POST
    acceptedKeys = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            print(key)
            raise exc.HTTPBadRequest()

    # print(postVars['password'])
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        employees = []

        query = "SELECT id FROM Employees WHERE type = 1"

        cursor.execute(query)

        for row in cursor:
            employees.append(row['id'])

        acceptedKeys.append(employees[randint(0,len(employees)-1)])

        query = ("INSERT INTO Auctions(itemID, sellerID, openingTime, closingTime, openingBid, reserve, increment, employeeID)\
                 VALUES (%s,  %s,  NOW(),  %s,  %s,  %s,  %s, %s);")

        cursor.execute(query, tuple(acceptedKeys))

        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        cursor.close()
        cnx.close()
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()

# config.add_route('apiAddBid', renderer='json')
@view_config(route_name='apiAddBid', renderer='json')
def apiAddBid(request):
    Authorizer.authorizeCustomer(request)
    auctionID = request.matchdict['id']

    customer = request.session['currentUser']

    requiredKeys = ['value', 'maxBid']
    postVars = request.POST
    acceptedKeys = []

    for key in requiredKeys:
        if(key in postVars):
            acceptedKeys.append(postVars[key])
        else:
            print(key)
            raise exc.HTTPBadRequest()

    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = "SELECT COUNT(*) as count, itemID, increment FROM Auctions WHERE id = %s AND closingTime > NOW()"

        cursor.execute(query, tuple(str(auctionID)))

        row = cursor.fetchone()
        auctionCount = row['count']

        if auctionCount == 0:
            cursor.close()
            cnx.close()
            raise exc.HTTPBadRequest()

        itemID = row['itemID']
        increment = row['increment']

        query = "INSERT INTO Bids(itemID, customerID, maxBid, amount, time, auctionID) VALUES (%s, %s, %s, %s, NOW(), %s)"

        cursor.execute(query, tuple([str(itemID), str(customer['id']), postVars['maxBid'], postVars['value'], auctionID]))

        query = "SELECT * from Bids WHERE auctionID = %s"

        cursor.execute(query, tuple(str(auctionID)))

        bids = []

        for row in cursor:
            bid = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    bid[key] = row[key].isoformat()
                else:
                    bid[key] = row[key]
            bids.append(bid)

        changed = True

        while(changed):
            changed = False
            currentMaxBid = max([bid['amount'] for bid in bids])
            print(currentMaxBid)
            for bid in bids:
                print('\n')
                print(bid['amount'])
                print(increment)
                if((bid['amount'] + increment) <= bid['maxBid'] and bid['amount'] <= currentMaxBid):
                    bid['changed'] = True
                    changed=True
                    bid['amount'] = bid['amount'] + increment

        for bid in bids:
            if 'changed' in bid:
                query = "INSERT INTO Bids(itemID, customerID, maxBid, amount, time, auctionID) VALUES (%s, %s, %s, %s, NOW(), %s)"
                time.sleep(1)
                cursor.execute(query, tuple([str(itemID), str(bid['customerID']), bid['maxBid'], bid['amount'], str(auctionID)]))


        cursor.close()

        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        cursor.close()
        cnx.close()
        return Response("Something went wrong: {}".format(err))

    raise exc.HTTPOk()
