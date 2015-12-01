<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Auctions Search</%def>
<%def name="head()">
<script>
	window.itemID = ${itemID};
</script>

<link href="${request.static_url('myapp:static/css/auctions.css')}" rel="stylesheet">
</%def>

<%def name="body()">
<div id="auctionSearchContainer" class="container">

</div>
</%def>

<%def name="scripts()">
<script type="text/babel" src="${request.static_url('myapp:static/js/auctionsSearch.jsx')}"></script>
</%def>
