<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Auctions</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/auctions.css')}" rel="stylesheet">
<script>
	var auctionID = ${auctionID};
</script>
</%def>

<%def name="body()">
<div id="auctionContainer" class="container">
</div>

<div id="modalTable" class="modal">
    <div class="modal-content container">
        <div id="bidHistoryContainer"></div>
    </div>
</div>

<div id="modalBid" class="modal">
    <div class="modal-content container">
        <div id="placeBidContainer"></div>
    </div>
</div>

</%def>

<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/imageScroller.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/bidHistory.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/placeBid.jsx')}"></script>
<script type="text/babel" src="${request.static_url('myapp:static/js/auctions.jsx')}"></script>
</%def>
