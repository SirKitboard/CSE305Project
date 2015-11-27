
var ImageScroller = React.createClass({
	getInitialState: function(){
		return {
			currentIndex : 0,
		}
	},

	nextImage: function(){
		this.setState({
			currentIndex: (this.state.currentIndex + 1) % this.props.images.length
		})
	},

	previousImage: function(){
		var nextIndex = this.state.currentIndex -1;
		if(nextIndex < 0) {
			nextIndex = this.props.images.length -1;
		}
		this.setState({
			currentIndex: nextIndex
		})

	},

	render : function(){
		return (
			<div className = "col s12 m4 l3">
				<div className= "row">
				<img className = "col s12" id="thumbnail" src={this.props.images[this.state.currentIndex]}/>
				</div>
				<div className = "row">
				<button onClick = {this.previousImage} className="btn waves-effect waves-light col s6 z-depth-2" type ="bidButton"><i className="material-icons">arrow_back</i></button>
				<button onClick = {this.nextImage} className="btn waves-effect waves-light col s6 z-depth-2" type ="bidButton"><i className="material-icons">arrow_forward</i></button>
				</div>
			</div>


		)		
	}
})


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
			return (
				<div>
				<h1 className="black-text" id="name">{this.state.item.name}</h1>


				<div className="row grey-text text-darken-2" style={{marginBottom:'5px'}}>

					<div className="col s6 m3"> Product Type: <span id="type">{this.state.item.type}</span> </div>
					<div className="col s6 m3"> Manufacture Year: <span id="manufactureYear">{this.state.item.manufactureYear}</span></div>
				</div>


				<div className ="row">
					{image}
					<div className="col s12 m6">
						<div className="bold">
							<div className="row">
								<div id="currentBid" className="col s12 m8"> Current Price: {this.state.auction.currentBid}</div>
								<button className="btn waves-effect waves-light col s12 m2 green z-depth-2" type ="bidButton"> Bid </button>
							</div>
							<div> <i className="material-icons">hourglass_full</i>Closes at: <span id= "closingTime">{new Date(this.state.auction.closingTime).toLocaleDateString("en-US", options)}</span></div>

							<div className="row">
								<div className="col"> <i className="material-icons">create</i> Posted by: <span  className= "green-text" id= "sellerName">{this.state.seller.name}</span></div>
								<div className="col amber-text text-lighten-1"> <i className="material-icons">star</i><span id="rating">{this.state.seller.rating}</span></div>
							</div>
							<p id= "Reserve"></p>
							<span className="amber-text text-lighten-1"> <i className="material-icons">restore</i> See Bid History</span>
						</div>
						<div> Description:  <span id="description">{this.state.item.description}</span> </div>

						<button onClick= {this.getAuctionSearch} className  = "btn waves-effect waves-light  light-blue darken-2" type="seeMoreButton">See More Auctions for this Item </button>
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
