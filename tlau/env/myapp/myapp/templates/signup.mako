<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Sign Up</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/signup.css')}" rel="stylesheet">
</%def>
<%def name="body()">
    <div id="signupContainer" class="container">
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/signup.jsx')}"></script>
</%def>
