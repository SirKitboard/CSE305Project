$(document).ready(function() {
	$.ajax({
		url: '/api/auctions/'+auctionID,
		method: 'GET',
		success : function(response) {
			var options = {
			    weekday: "long", year: "numeric", month: "short",
			    day: "numeric", hour: "2-digit", minute: "2-digit"
			};
			$("#currentBid").html("Current Bid : "+response.currentBid);
			$("#ClosingTime").html(new Date(response.closingTime).toLocaleDateString("en-US", options));
			if (response.currentBid>response.reserve){
				 $("#Reserve").remove();
			}
			else{
				$("#Reserve").html("<i class='material-icons'>not_interested</i> Reserve not met");
			}
			getExtraInfo(response.itemID, response.sellerID);


		}
	})
});


function getExtraInfo(itemID,sellerID) {
	$.ajax({
		url: '/api/items/'+itemID,
		method: 'GET',
		success : function(response) {
			$("#name").html(response.name); //from item
			$("#Type").html(response.type); //from item
			$("#manufactureYear").html(response.manufactureYear);// from item
			$("#thumbnail").attr('src', response.images[0]);
			$('#Description').html(response.description);

		}
	});

	$.ajax({
		url: '/api/customers/'+sellerID,
		method: 'GET',
		success : function(response) {
			// debugger;
			$("#SellerID").html(response.name);
			$("#Rating").html(response.rating);//from customers
		}
	})
}
