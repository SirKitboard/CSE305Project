// $(document).ready(function() {
// 	$.ajax({
// 		url: '/api/auctions/'+auctionID,
// 		method: 'GET',
// 		success : function(response) {
// 			var options = {
// 			    weekday: "long", year: "numeric", month: "short",
// 			    day: "numeric", hour: "2-digit", minute: "2-digit"
// 			};
// 			$("#currentBid").html("Current Bid : "+response.currentBid);
// 			$("#ClosingTime").html(new Date(response.closingTime).toLocaleDateString("en-US", options));
// 			if (response.currentBid>response.reserve){
// 				 $("#Reserve").remove();
// 			}
// 			else{
// 				$("#Reserve").html("<i class='material-icons'>not_interested</i> Reserve not met");
// 			}
// 			getExtraInfo(response.itemID, response.sellerID);
//
//
// 		}
// 	})
// });
//
//
// function getExtraInfo(itemID,sellerID) {
// 	$.ajax({
// 		url: '/api/items/'+itemID,
// 		method: 'GET',
// 		success : function(response) {
// 			$("#name").html(response.name); //from item
// 			$("#Type").html(response.type); //from item
// 			$("#manufactureYear").html(response.manufactureYear);// from item
// 			$("#thumbnail").attr('src', response.images[0]);
// 			$('#Description').html(response.description);
//
// 		}
// 	});
//
// 	$.ajax({
// 		url: '/api/customers/'+sellerID,
// 		method: 'GET',
// 		success : function(response) {
// 			// debugger;
// 			$("#SellerID").html(response.name);
// 			$("#Rating").html(response.rating);//from customers
// 		}
// 	});
// }

var Auction = React.createClass({
	getInitialState : function() {
		return {
			auction : null,
			item : null,
			seller : null,
			loading : 0
		}
	},
	componentDidMount : function() {
		var self = this;
		$.ajax({
			url: '/api/auctions/'+auctionID,
			method: 'GET',
			success : function(response) {
				self.setState({
					auction : response,
					loading : self.state.loading + 1
				});
				self.getItemInfo(response.itemID);
				self.getSellerInfo(response.sellerID);
				// var options = {
				//     weekday: "long", year: "numeric", month: "short",
				//     day: "numeric", hour: "2-digit", minute: "2-digit"
				// };
				// $("#currentBid").html("Current Bid : "+response.currentBid);
				// $("#ClosingTime").html(new Date(response.closingTime).toLocaleDateString("en-US", options));
				// if (response.currentBid>response.reserve){
				// 	 $("#Reserve").remove();
				// }
				// else{
				// 	$("#Reserve").html("<i class='material-icons'>not_interested</i> Reserve not met");
				// }
				// self.getExtraInfo(response.itemID, response.sellerID);
			}
		});
	},
	getItemInfo : function(itemID) {
		var self = this;
		$.ajax({
			url: '/api/items/'+itemID,
			method: 'GET',
			success : function(response) {
				self.setState({
					item : response,
					loading : self.state.loading + 1
				});
				// $("#name").html(response.name); //from item
				// $("#Type").html(response.type); //from item
				// $("#manufactureYear").html(response.manufactureYear);// from item
				// $("#thumbnail").attr('src', response.images[0]);
				// $('#Description').html(response.description);
			}
		});
	},
	getSellerInfo : function(sellerID) {
		var self = this;
		$.ajax({
			url: '/api/customers/'+sellerID,
			method: 'GET',
			success : function(response) {
				self.setState({
					seller : response,
					loading : self.state.loading + 1
				});
				// debugger;
				// $("#SellerID").html(response.name);
				// $("#Rating").html(response.rating);//from customers
			}
		});
	},
	render : function() {
		console.log(this.state.loading);
		console.log(this.state.item);
		console.log(this.state.seller);
		if(this.state.loading < 3) {
            return (
				<div className="preloader-wrapper big active">
					<div className="spinner-layer spinner-blue-only">
				    	<div className="circle-clipper left">
				    		<div className="circle">
							</div>
				    	</div>
						<div className="gap-patch">
							<div className="circle">
							</div>
	    				</div>
						<div className="circle-clipper right">
				    		<div className="circle">
							</div>
						</div>
					</div>
				</div>

            )
        }
		else {
			var image = <img className = "col s12 m4 l3" id="thumbnail" src="http://placehold.it/300x500"/>
			if(this.state.item && this.state.item.thumbnails) {
				image = <img className = "col s12 m4 l3" id="thumbnail" src={this.state.item.thumbnails[0]}/>
			}
			return (
				<div>
				<h1 className="black-text" id="name">{this.state.item.name}</h1>


				<div className="row grey-text text-darken-2">

					<div className="col s6 m3"> Product Type: <span id="type">{this.state.item.type}</span> </div>
					<div className="col s6 m3"> Manufacture Year: <span id="manufactureYear">{this.state.item.manufactureYear}</span></div>
				</div>


				<div className ="row">
					{image}
					<div className="col s12 m6">
						<div className="bold">
							<div className="row">
								<div id="currentBid" className="col s12 m8"> Current Price: {this.state.auction.currentBid}</div>
								<button className="btn waves-effect waves-light col s12 m2 z-depth-2" type ="bidButton"> Bid </button>
							</div>
							<div> <i className="material-icons">hourglass_full</i>Closes at: <span id= "closingTime">{this.state.auction.closingTime}</span></div>

							<div className="row">
								<div className="col"> <i className="material-icons">create</i> Posted by: <span  className= "green-text" id= "sellerName">{this.state.seller.name}</span></div>
								<div className="col amber-text text-lighten-1"> <i className="material-icons">star</i><span id="rating">{this.state.seller.rating}</span></div>
							</div>
							<p id= "Reserve"></p>
							<span className="amber-text text-lighten-1"> <i className="material-icons">restore</i> See Bid History</span>
						</div>
						<div> Description:  <span id="description">{this.state.item.description}</span> </div>

						<button className= "btn waves-effect waves-light" type="seeMoreButton">See More Auctions for this Item </button>
					</div>
				</div>
				</div>
			)
		}
	}
});

var auction = <Auction/>
ReactDOM.render(
  auction,
  document.getElementById('auctionContainer')
);
