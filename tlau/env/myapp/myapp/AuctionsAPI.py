from pyramid.view import view_config
from pyramid.response import Response
from datetime import datetime
from decimal import Decimal
from myapp import Authorizer

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

@view_config(route_name='apibidHistory', renderer='json')
def bidHistory(request):
    try:
        cnx = mysql.connector.connect(user='root', password='SmolkaSucks69', host='127.0.0.1', database='305')
        cursor = cnx.cursor(dictionary=True)

        query = ("SELECT * FROM Bids")

        cursor.execute(query)

        history = []
        for row in cursor:
            history.append({
                'id': row['id'],
                'time': row['time'].isoformat(),
                'amount': str(row['amount']),
                'customerID': row['customerID'],
                'auctionID': row['auctionID'],
                'maxBid': str(row['maxBid']),
                'itemID': row['itemID']
            })

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        return Response("Something went wrong: {}".format(err), status=500)

    if(len(history) == 0):
        raise exc.HTTPNoContent()

    return history
