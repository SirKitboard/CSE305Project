<html>
<head>
    <link href="${request.static_url('myapp:static/css/navbar.css')}" rel="stylesheet">
    <link type="text/css" href="${request.static_url('myapp:static/css/materialize/materialize.min.css')}" rel="stylesheet">
    <title>${self.title()}</title>
</head>
<body>
    <nav>
        <div class="nav-wrapper">
            <a href="#" class="brand-logo">Totally Legit Online Auctions</a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a class="sign-in">Why not sign in?</a><i class="material-icons">person_add</i></li>
                <li><a href="badges.html">Components</a></li>
                <li><a href="collapsible.html">JavaScript</a></li>
            </ul>
        </div>
    </nav>
</body>

</html>
