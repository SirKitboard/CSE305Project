<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Create Auction</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/createAuction.css')}" rel="stylesheet">
</%def>
<%def name="body()">
    <div id="createAuctionContainer" class="container">
    </div>
</%def>
<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/selectItem.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/createAuction.jsx')}"></script>
</%def>
