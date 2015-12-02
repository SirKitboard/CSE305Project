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
				if(response.currentBid < response.openingBid){
					response.currentBid = response.openingBid
				};
				self.setState({
					auction : response,
					loading : self.state.loading + 1
				});
				self.getItemInfo(response.itemID);
				self.getSellerInfo(response.sellerID);
			}
		});
	},
	componentDidUpdate : function(prevProps, prevState) {
		if(prevState.loading == 2 && this.state.loading == 3) {
			$('.modal-trigger').leanModal();
		}
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
			}
		});
	},
	getAuctionSearch: function(itemID){
		window.location = "/auctions/search/"+this.state.item.id;
	},
	render : function() {
		var options = {
		 	weekday: "long", year: "numeric", month: "short",
		    day: "numeric", hour: "2-digit", minute: "2-digit"
		};

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
			if(this.state.item && this.state.item.images.length > 0) {
				var url = this.state.item.images[0];
				image = <ImageScroller images={this.state.item.images}/>
			}
			var bidButton = <a className="modal-trigger btn waves-effect waves-light green z-depth-1" href="#modalBid" type ="bidButton"> Bid </a>

			if(new Date(this.state.auction.closingTime)<new Date()){
				bidButton = <button className="modal-trigger btn waves-effect waves-light green z-depth-2" href="#modalBid" type ="bidButton" disabled> Closed </button>
			}
			else if(!window.currentUser) {
				bidButton = <button className="modal-trigger btn waves-effect waves-light green z-depth-2" href="#modalBid" type ="bidButton" disabled> Bid </button>
			}

			else if(window.currentUser.id == this.state.auction.sellerID) {
				bidButton = "";
			}


			return (
				<div>
					<h1 className="black-text" id="name">{this.state.item.name}</h1>
					<div className="row grey-text text-darken-2" style={{marginBottom:'5px'}}>
						<div className="col s6 m3">
							Product Type: <span id="type">{this.state.item.type}</span>
						</div>
						<div className="col s6 m3">
							Manufacture Year: <span id="manufactureYear">{this.state.item.manufactureYear}</span>
						</div>
					</div>
					<div className ="row">
						{image}
						<div className="col s12 m6">
							<div className="bold">
								<div className="row">
									<div id="currentBid" className="col s12 m8">
										Current Price: {this.state.auction.currentBid}
									</div>
									{bidButton}
								</div>
								<div>
									<i className="material-icons">hourglass_full</i>
									Closes at:
									<span id= "closingTime">
										{new Date(this.state.auction.closingTime).toLocaleDateString("en-US", options)}
									</span>
								</div>
								<div className="row">
									<div className="col">
										<i className="material-icons">create</i>
										Posted by:
										<span className= "green-text" id= "sellerName">{this.state.seller.name}</span>
									</div>
									<div className="col amber-text text-lighten-1">
										<i className="material-icons">star</i>
										<span id="rating">{this.state.seller.rating}</span></div>
								</div>
								<p id= "Reserve"></p>
								 <a className="modal-trigger" href="#modalTable">
									 <i className="material-icons">restore</i> See Bid History
								 </a>
							</div>
							<div>
								Description: <span id="description">{this.state.item.description}</span>
							</div>
							<button onClick={this.getAuctionSearch} className  = "btn waves-effect waves-light  light-blue darken-2" type="seeMoreButton">See More Auctions for this Item </button>
						</div>
					</div>
				</div>
			)
		}
	}
});

var auction = <Auction/>;
ReactDOM.render(
  auction,
  document.getElementById('auctionContainer')
);

var bidHistory = <BidHistory/>;
ReactDOM.render(
  bidHistory,
  document.getElementById('bidHistoryContainer')
);

var placeBid = <PlaceBid/>;
ReactDOM.render(
   placeBid,
   document.getElementById('placeBidContainer')
);
