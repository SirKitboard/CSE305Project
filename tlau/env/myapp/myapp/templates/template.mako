<!DOCTYPE html>
<html lang="${request.locale_name}">
<head>
    <meta charset="utf-8">

    <meta name="description" content="Home Page">
    <meta name="author" content="Team ¯\_(ツ)_/¯">
    <link rel="shortcut icon" href="${request.static_url('myapp:static/pyramid-16x16.png')}">
% if currentUser == None:
    <script>
        window.currentUser = null;
    </script>
% else:
    <script>
        window.currentUser = "${currentUser}".replace(/&#39;/g,"\"");
        window.currentUser = JSON.parse(window.currentUser);
        console.log(window.currentUser)
    </script>
% endif


    <title>${self.title()}</title>

    <!-- Bootstrap core CSS -->
    <link type="text/css" href="${request.static_url('myapp:static/css/materialize/materialize.min.css')}" rel="stylesheet">
    <!-- Material Icons CSS -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!-- Custom styles for this scaffold -->
    <!-- <link href="${request.static_url('myapp:static/css/index.css')}" rel="stylesheet"> -->
    <link href="${request.static_url('myapp:static/css/template.css')}" rel="stylesheet">
    <link href="${request.static_url('myapp:static/css/login.css')}" rel="stylesheet">
    <script src="${request.static_url('myapp:static/js/jquery-2.1.4.min.js')}"></script>
    <script src="${request.static_url('myapp:static/js/materialize/materialize.js')}"></script>

    <script src="${request.static_url('myapp:static/js/underscore-min.js')}"></script>
    <script src="${request.static_url('myapp:static/js/react/react.js')}"></script>
    <script src="${request.static_url('myapp:static/js/react/react-dom.js')}"></script>
    <script src="${request.static_url('myapp:static/js/react/browser.min.js')}"></script>

    ${self.head()}
</head>

<body>
    <nav>
        <div class="nav-wrapper">
            <div class="top">
                <a href="/" class="brand-logo"><span class="black-alt">TOTALLY</span> LEGIT <span class="black-alt">ONLINE</span> AUCTIONS</a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
% if currentUser == None:
                    <li><a class="modal-trigger sign-in" href="#modalLogin">Why not sign in? <i class="tiny material-icons">person_add</i></a></li>
% else:
                    <li><a href="/profile">Hi ${currentUser['firstName']}</a></li>
                    <li><a id="logout" class="logout">Logout<i class="tiny material-icons">power_settings_new</i></a></li>
% endif
                </ul>
            </div>
            <div class="bottom">
                <span class="subtitle">We're not a scam!</span>
                <input class="searchbar" id="searchItem" type=search results=5 placeholder="What are you looking for?" name=s>
            </div>
        </div>
    </nav>
    ${self.body()}


    ${self.scripts()}

    <div id="modalLogin" class="modal">
        <div class="modal-content container login">
            <h2 class="flow-text">Login</h2>
            <div class="row">
                <div class="input-field col s12">
                    <input id="username" type="text" class="validate"/>
                    <label for="username">User Name</label>
                </div>
                <div class="input-field col s12">
                    <input id="password" type="password" class="validate" data-error="Invalid username or password"/>
                    <label for="password">Password</label>
                </div>
                <div class="col s12 row">
                    <p class="col s12 m6">
                        <input name="group1" type="radio" id="isCustomer"/>
                        <label for="isCustomer">Customer</label>
                    </p>
                    <p class="col s12 m6">
                        <input name="group1" type="radio" id="isEmployee"/>
                        <label for="isEmployee">Employees</label>
                    </p>
                </div>
                <button class="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
                  <i class="material-icons right">send</i>
                </button>
                <button class="btn waves-effect waves-light modal-action modal-close">Close
                  <i class="material-icons right">clear</i>
                </button>
                <span class="col s12">Not a member? Click <a href="/signup">here</a> to Sign up!</span>
            </div>
        </div>
    </div>

    <script src="${request.static_url('myapp:static/js/template.js')}"></script>

</body>
</html>
