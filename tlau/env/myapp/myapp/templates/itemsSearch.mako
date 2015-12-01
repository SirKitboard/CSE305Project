<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Auctions</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/items.css')}" rel="stylesheet">
</%def>

<%def name="body()">
<div id="itemSearchContainer" class="container">

</div>
</%def>

<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/itemsSearch.jsx')}"></script>
</%def>
