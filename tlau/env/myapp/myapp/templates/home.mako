<!DOCTYPE html>
<html lang="${request.locale_name}">
  <head>
    <meta charset="utf-8">

    <meta name="description" content="Home Page">
    <meta name="author" content="Aditya Balwani">
    <link rel="shortcut icon" href="${request.static_url('myapp:static/pyramid-16x16.png')}">

    <title>Totally Legit Online Auctions</title>

    <!-- Bootstrap core CSS -->
    <link type="text/css" href="${request.static_url('myapp:static/css/materialize/materialize.min.css')}" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Custom styles for this scaffold -->
    <link href="${request.static_url('myapp:static/css/home.css')}" rel="stylesheet">
  </head>

  <body class="teal">
    <div class="starter-template valign-wrapper row" style="width:100%;height:100%;">
        <div class="login-card card-panel hoverble valign col s12 m6 offset-m3" style="text-align: center;">
          <span class="flow-text blue-text text-darken-2">Login</span>
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
          </div>
        </div>
    </div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="${request.static_url('myapp:static/js/jquery-2.1.4.min.js')}"></script>
    <script src="${request.static_url('myapp:static/js/materialize/materialize.js')}"></script>
    <script src="${request.static_url('myapp:static/js/home.js')}"></script>
  </body>
</html>