from pyramid.view import view_config
from pyramid.response import Response

import pyramid.httpexceptions as exc

import mysql.connector


# @view_config(route_name='allItems', renderer='json')
# def insertEmployee(request):
#     requiredKeys = ['SSN', 'LastName', 'FirstName', 'Address', 'City', 'State', 'ZipCode', 'Telephone', 'StartDate', 'HourlyRate', 'Type']
#     postVars = request.POST
#     acceptedKeys = []
#
#     for key in requiredKeys:
#         if(key in postVars):
#             acceptedKeys.append(postVars[key])
#         else:
#             raise exc.HTTPBadRequest()
#
#     query = ("INSERT INTO Employees(SSN, LastName, FirstName, Address, City, State, ZipCode, Telephone, StartDate, HourlyRate, Type)
#              "VALUES (?ssn, ?lastName, ?firstName, ?address, ?city, ?state, ?zipcode,?phone,?startDate,?hourlyRate,?type);")
