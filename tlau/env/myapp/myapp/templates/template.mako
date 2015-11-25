<!DOCTYPE html>
<html lang="${request.locale_name}">
<head>
    <meta charset="utf-8">

    <meta name="description" content="Home Page">
    <meta name="author" content="Team ¯\_(ツ)_/¯">
    <link rel="shortcut icon" href="${request.static_url('myapp:static/pyramid-16x16.png')}">

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
    <script src="${request.static_url('myapp:static/js/jquery-2.1.4.min.js')}"></script>

    ${self.head()}
</head>
<body>
    <nav>
        <div class="nav-wrapper">
            <div class="top">
                <a href="#" class="brand-logo"><span class="black-alt">TOTALLY</span> LEGIT <span class="black-alt">ONLINE</span> AUCTIONS</a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li><a class="sign-in">Why not sign in? <i class="tiny material-icons">person_add</i></a></li>
                </ul>
            </div>
            <div class="bottom">
                <span class="subtitle">We're not a scam!</span>
                <input class="searchbar" type=search results=5 placeholder="What are you looking for?" name=s>
            </div>
        </div>
    </nav>

    ${self.body()}

    ${self.scripts()}   

</body>
</html>
