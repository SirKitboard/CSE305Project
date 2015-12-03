<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Receipts</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/profile.css')}" rel="stylesheet">
</%def>
<%def name="body()">
    <div id="receiptsContainer" class="container">
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/receipts.jsx')}"></script>
</%def>
