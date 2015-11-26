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


	<div class="row grey-text text-darken-2">

		<div class="col s6 m3"> Product Type: <span id="Type"></span> </div>
		<div class="col s6 m3"> Manufacture Year: <span id="manufactureYear"></span></div>
	</div>


	<div class ="row">
		<img class = "col s12 m4 l3" id="thumbnail" src=""/>
		<div class="col s12 m6">
			<div class="bold">
				<div class="row">
					<div id="currentBid" class="col s12 m8"> Current Price: </div>
					<button class="btn waves-effect waves-light col s12 m2"class="z-depth-2" type ="bidButton"> Bid </button>
				</div>
				<div> <i class="material-icons">hourglass_full</i>Closes at: <span id= "ClosingTime"></span></div>

				<div class="row">
					<div class="col"> <i class="material-icons">create</i> Posted by: <span  class= "green-text" id= "SellerID"></span></div>
					<div class="col amber-text text-lighten-1"> <i class="material-icons">star</i><span id="Rating"></span></div>
				</div>
				<p id= "Reserve"></p>
				<span class="amber-text text-lighten-1"> <i class="material-icons">restore</i> See Bid History</span>
			</div>
			<div> Description:  <span id="Description"></span> </div>

			<button class= "btn waves-effect waves-light" type="seeMoreButton">See More Auctions for this Item </button>
		</div>
	</div>
</div>
</%def>

<%def name="scripts()">
<script src="${request.static_url('myapp:static/js/auctions.js')}"></script>
</%def>
