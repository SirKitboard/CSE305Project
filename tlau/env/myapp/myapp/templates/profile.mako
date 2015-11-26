<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Index</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/profile.css')}" rel="stylesheet">
</%def>
<%def name="body()">
    <div id="profileContainer" class="container">
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/profile.jsx')}"></script>
</%def>
