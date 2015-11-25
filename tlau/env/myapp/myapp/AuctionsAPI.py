from pyramid.view import view_config
from pyramid.response import Response

import pyramid.httpexceptions as exc

import mysql.connector


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
