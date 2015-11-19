import pyramid.httpexceptions as exc

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
