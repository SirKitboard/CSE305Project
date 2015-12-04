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
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
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


@view_config(route_name='apiAuctionWin', renderer='json')
def apiAuctionWin(request):
    Authorizer.authorizeEmployee(request)
    auctionID = request.matchdict['id']

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = "SELECT * from Auctions where id = %s"
        cursor.execute(query, tuple([str(auctionID)]))
        auction = cursor.fetchone()

        if(auction['finished'] == 1):
            cursor.close()
            cnx.close()
            raise exc.HTTPBadRequest()
        elif(auction['closingTime'] > datetime.now()):
            cursor.close()
            cnx.close()
            raise exc.HTTPBadRequest()

        query = "UPDATE Auctions SET finished=1 WHERE id = %s"
        cursor.execute(query, tuple([str(auctionID)]))

        # query = "SELECT COUNT(*) as count, amount, id, customerID FROM Bids where auctionID = 1 ORDER BY amount DESC LIMIT 1"
        query = "SELECT COUNT(*) as count FROM Bids where auctionID = %s"
        cursor.execute(query, tuple([str(auctionID)]))
        bid = cursor.fetchone()
        if(bid['count'] == 0):
            cursor.close()
            cnx.commit()
            cnx.close()
            raise exc.HTTPOk()

        query = "SELECT amount, id, customerID FROM Bids WHERE auctionID = %s ORDER BY amount DESC LIMIT 1"
        cursor.execute(query, tuple([str(auctionID)]))
        bid = cursor.fetchone()

        if(bid['amount'] < auction['reserve']):
            cursor.close()
            cnx.commit()
            cnx.close()
            raise exc.HTTPOk()

        query = "INSERT INTO Wins (bidID, time, customerID, auctionID)\
                    VALUES (%s, NOW(), %s, %s);"
        cursor.execute(query, tuple([bid['id'], bid['customerID'], auction['id']]))

        query = "UPDATE Items\
                 SET CopiesSold = CopiesSold + 1, Stock=Stock-1\
                 WHERE ID=%s"
        cursor.execute(query, tuple([str(auction['itemID'])]))
        print('itemUpdated')
        query= "UPDATE Customers\
                SET ItemsSold=ItemsSold+1\
                WHERE ID = %s"
        cursor.execute(query, tuple([str(auction['sellerID'])]))
        print('seller')
        query= "UPDATE Customers\
                SET ItemsPurchased=ItemsPurchased+1\
                WHERE ID = %s"
        cursor.execute(query, tuple([str(bid['customerID'])]))
        print('customer')
        cursor.close()
        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        cursor.close()
        cnx.close()
        return Response("Something went wrong: {}".format(err), status=500)

    raise exc.HTTPOk()


@view_config(route_name='apiGetAuction', renderer='json')
def getAuction(request):
    auctionID = request.matchdict['id']
    auction = {}
    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Auctions where id = %s")

        cursor.execute(query, tuple([str(auctionID)]))

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
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM BidLogs LEFT JOIN (SELECT firstName, lastName, id FROM Customers) AS CustomerInfo ON BidLogs.customerID = CustomerInfo.id WHERE BidLogs.auctionID = %s ORDER BY BidLogs.id ASC")

        cursor.execute(query, tuple([str(auctionID)]))

        history = []
        for row in cursor:
            history.append({
                'id': row['id'],
                'time': row['time'].isoformat(),
                'amount': str(row['amount']),
                'customerID': row['customerID'],
                'auctionID': row['auctionID'],
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

    searchResults = {}

    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = "SELECT * FROM Auctions WHERE closingTime > NOW() AND itemID = %s"

        cursor.execute(query, tuple([str(getVars['itemID'])]))
        results = []
        for row in cursor:
            auctionInfo = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    auctionInfo[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    auctionInfo[key] = str(row[key])
                else:
                    auctionInfo[key] = row[key]
            results.append(auctionInfo)
        searchResults['current'] = results

        query = "SELECT * FROM Auctions WHERE closingTime < NOW() AND itemID = %s"

        cursor.execute(query, tuple([str(getVars['itemID'])]))
        results = []
        for row in cursor:
            auctionInfo = {}
            for key in row:
                if(isinstance(row[key], datetime)):
                    auctionInfo[key] = row[key].isoformat()
                elif(isinstance(row[key], Decimal)):
                    auctionInfo[key] = str(row[key])
                else:
                    auctionInfo[key] = row[key]
            results.append(auctionInfo)

        searchResults['past'] = results

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
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
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
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True, buffered=True)

        query = "SELECT COUNT(*) as count, itemID, increment, openingBid, sellerID FROM Auctions WHERE id = %s AND closingTime > NOW()"

        cursor.execute(query, tuple([str(auctionID)]))

        row = cursor.fetchone()
        auctionCount = row['count']

        if auctionCount == 0:
            cursor.close()
            cnx.close()
            raise exc.HTTPBadRequest()

        itemID = row['itemID']
        increment = row['increment']
        if(customer['id'] < row['sellerID']):
            raise exc.HTTPForbidden()

        postVars['value'] = Decimal(postVars['value'])
        postVars['maxBid'] = Decimal(postVars['maxBid'])

        if(postVars['value'] < row['openingBid']):
            raise exc.HTTPForbidden()

        # Check if bid already exists
        query = "SELECT * FROM Bids WHERE customerID = %s AND auctionID = %s"

        cursor.execute(query, tuple([customer['id'], auctionID]))
        print('rowcount', cursor.rowcount)
        if(cursor.rowcount > 0):
            row = cursor.fetchone()
            query = "UPDATE Bids SET amount = %s, maxBid = %s WHERE id = %s"
            cursor.execute(query, tuple([postVars['value'], postVars['maxBid'], row['id']]))

        else:
            query = "INSERT INTO Bids(itemID, customerID, maxBid, amount, time, auctionID) VALUES (%s, %s, %s, %s, NOW(), %s)"
            cursor.execute(query, tuple([str(itemID), str(customer['id']), postVars['maxBid'], postVars['value'], auctionID]))

        query = "INSERT INTO BidLogs (amount, customerID, auctionID, time) VALUES (%s, %s, %s, NOW())"

        cursor.execute(query, tuple([postVars['value'], customer['id'], auctionID]))

        query = "SELECT * from Bids WHERE auctionID = %s"

        cursor.execute(query, tuple([str(auctionID)]))

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

        currentMaxBid = 0

        while(changed):
            changed = False
            currentMaxBid = max([bid['amount'] for bid in bids])
            numOccurences = [bid['amount'] for bid in bids].count(currentMaxBid)
            print(numOccurences)
            # print(currentMaxBid)
            if(numOccurences == 1):
                for bid in bids:
                    print('\n')
                    print(bid['amount'])
                    print(increment)
                    if((bid['amount'] + increment) <= bid['maxBid'] and bid['amount'] < currentMaxBid):
                        bid['changed'] = True
                        changed = True
                        bid['amount'] = bid['amount'] + increment
            else:
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
                # print('wut')
                query = "UPDATE Bids SET amount = %s, time = NOW() WHERE id = %s"
                cursor.execute(query, tuple([bid['amount'], bid['id']]))
                # print('HIIII')
                query = "INSERT INTO BidLogs (customerID, amount, time, auctionID) VALUES (%s, %s, NOW(), %s)"
                cursor.execute(query, tuple([bid['customerID'], str(bid['amount']), auctionID]))

        query = "UPDATE Auctions SET currentBid = %s WHERE id = %s"
        cursor.execute(query, tuple([str(currentMaxBid), auctionID]))

        cursor.close()
        print('COMMITTING')
        cnx.commit()
        cnx.close()
    except mysql.connector.Error as err:
        cursor.close()
        cnx.close()
        return Response("Something went wrong: {}".format(err), 500)

    raise exc.HTTPOk()


@view_config(route_name='apiAuctionsUnapproved', renderer='json')
def apiAuctionsUnapproved(request):
    Authorizer.authorizeEmployee(request)
    auctions = []
    try:
        cnx = mysql.connector.connect(user='root', password='password', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Auctions where closingTime<NOW() AND finished=0")

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

        for auction in auctions:
            print(auction)

            query = ("SELECT * FROM Customers where id = %s")
            cursor.execute(query, tuple([str(auction["sellerID"])]))
            customer = cursor.fetchone()
            print('hii')
            auction['sellerName'] = customer['firstName'] + " " + customer['lastName']

            query = ("SELECT name FROM Items where id=%s")
            cursor.execute(query, tuple([str(auction["itemID"])]))
            item = cursor.fetchone()
            print('hiii')
            auction['itemName'] = item["name"]

            query = ("SELECT url from ItemsImages where itemID=%s")
            cursor.execute(query, tuple([str(auction["itemID"])]))
            # print('hi')
            imageArray = []
            for row in cursor:
                imageArray.append(row["url"])
            auction["itemImage"] = imageArray

            query = "SELECT COUNT(*) as count FROM Bids where auctionID = %s"
            # print(tuple(str(auction["id"])))
            print(auction["id"])
            cursor.execute(query, tuple([str(auction["id"])]))
            # print('loop started')
            bid = cursor.fetchone()
            if(bid["count"] == 0):
                print('no bids')
                auction["winner"] = None
            else:
                query = "SELECT amount, id, customerID FROM Bids WHERE auctionID = %s ORDER BY amount DESC LIMIT 1"
                cursor.execute(query, tuple([str(auction["id"])]))

                bid = cursor.fetchone()

                auction["amount"] = str(bid["amount"])

                query = ("SELECT * FROM Customers where id = %s")
                print('h')

                cursor.execute(query, tuple([str(bid["customerID"])]))
                print('hi')
                customer = cursor.fetchone()
                auction['winnerName'] = customer['firstName'] + " " + customer['lastName']



        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    return auctions
