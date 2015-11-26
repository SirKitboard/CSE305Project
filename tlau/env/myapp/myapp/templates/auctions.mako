<%inherit file="myapp:templates/template.mako" />
<%def name="title()">Auctions</%def>
<%def name="head()">
<link href="${request.static_url('myapp:static/css/auctions.css')}" rel="stylesheet">
<script>
	var auctionID = ${auctionID};
</script>
</%def>

<%def name="body()">

<div class="container">

	<h1 class="black-text" id="name"></h1>


	<div class="row">
	
		<div class="col s6 m3"> Product Type: <span id="Type"></span> </div>
		<div class="col s6 m3"> Manufacture Year: <span id="manufactureYear"></span></div>
	</div>

	<div class="divider"></div>

	<div class ="row">
		<img class = "col s12 m6 l3" id="thumbnail" src=""/>
		<div class="col s12 m6">
			<div class="row">
				<div class="col s6 m6"> Current Price: <span id= "CurrentBid"></span></div> 
				<button class="col s6 m2"class="z-depth-2" type ="bidButton"> Bid </button>
			</div>
			<div> Closes at: <span id= "ClosingTime"></span></div>
			
			<div> Posted by: <span id= "SellerID"></span></div>
			<div> Rating : <span id="Rating"></span></div>
			
			<p> <span id= "Reserve"></span></p>
			<p> See Bid History</p>
			<div> Description:  <span id="Description"></span> </div>

			<button type="seeMoreButton">See More Auctions for this Item </button>
		</div>
	</div>

</div>

</%def>

<%def name="scripts()">
<script src="${request.static_url('myapp:static/js/auctions.js')}"></script>
</%def>