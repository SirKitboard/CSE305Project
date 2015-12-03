var AuctionSearch = React.createClass ({
	getInitialState : function() {
		return{
			auctions : null,
			item: null,
			loading: 0
		}
	},

	componentDidMount : function() {
		var self = this;
		$.ajax({
			url: '/api/auctions/search',
			method: 'GET',
			data: {
				itemID: window.itemID
			},
			success : function(response) {
				_.each(response.current, function(auction) {
					auction.currentBid = (auction.currentBid < auction.openingBid ? auction.openingBid : auction.currentBid)
				});
				_.each(response.past, function(auction) {
					auction.currentBid = (auction.currentBid < auction.openingBid ? auction.openingBid : auction.currentBid)
				});
				self.setState({
					auctions : response,
					loading : self.state.loading + 1
				});
				self.getItemInfo(response.itemID);
			}
		});
	},
	getItemInfo : function(itemID) {
		var self = this;
		$.ajax({
			url: '/api/items/'+window.itemID,
			method: 'GET',
			success : function(response) {
				self.setState({
					item : response,
					loading : self.state.loading + 1
				});

			}
		});
	},
	render : function(){
		var self = this;
		if(this.state.loading < 2) {
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
        else{
        	return(
				<div>
					<h4>Open Auctions</h4>
	        		<div className = "row">
	        		{ (this.state.auctions.current.length == 0 ) ? (<h5 style={{marginLeft :'20px'}}>No open auctions :( </h5>) : _.map(this.state.auctions.current, function(auction) {
	                                var imageURL = "http://placehold.it/300x300"
	                                if(self.state.item.images) {
	                                    imageURL = self.state.item.images[0]
	                                }
	                                return (
	                                	<div className="col s12 m4 l3">
		                                    <div className="card small">
		                                        <div className="card-image">
		                                            <img src={imageURL}/>
		                                            <span className="card-title">{self.state.item.name}</span>
													<span className="card-subtitle">${auction.currentBid}</span>
		                                        </div>

		                                        <div className="card-content">
		                                            <p>{self.state.item.description}</p>
		                                        </div>

		                                        <div className="card-action"  >

													<a href={"/auction/"+auction.id}>
														<i className="material-icons">remove_red_eye</i>
														<span>&nbsp;View</span>
													</a>

		                                        </div>

		                                    </div>
	                                    </div>
	                                )
	                            })}
	        		</div>
					<h4>Past Auctions</h4>
	        		<div className = "row">
	        		{(this.state.auctions.past.length == 0 ) ? (<h5 style={{marginLeft :'20px'}}>No open auctions</h5>) : _.map(this.state.auctions.past, function(auction) {
	                                var imageURL = "http://placehold.it/300x300"
	                                if(self.state.item.images) {
	                                    imageURL = self.state.item.images[0]
	                                }
	                                return (
	                                	<div className="col s12 m4 l3">
		                                    <div className="card small">
		                                        <div className="card-image">
		                                            <img src={imageURL}/>
		                                            <span className="card-title">{self.state.item.name} <br/>
		                                            	  $ {auction.currentBid}
		                                            </span>
		                                        </div>

		                                        <div className="card-content">
		                                            <p>{self.state.item.description}</p>
		                                        </div>

		                                        <div className="card-action"  >

		                                            <a href={"/auction/"+auction.id}>
														<i className="material-icons">remove_red_eye</i>
														<span>&nbsp;View</span>
													</a>



		                                        </div>

		                                    </div>
	                                    </div>
	                                )
	                            })}
	        		</div>
				</div>

        	)

        }
	}
});

var auction = <AuctionSearch/>
ReactDOM.render(
  auction,
  document.getElementById('auctionSearchContainer')
);
