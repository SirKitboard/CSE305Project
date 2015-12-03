var Item = React.createClass({
	getInitialState : function(){
		return {
			item : null,
			loading : true
		}
	},
	componentDidMount : function() {
		var self = this;
		// console.log(itemID);
		$.ajax({
			url: '/api/items/'+itemID,
			method: 'GET',
			success : function(response) {
				self.setState({
					item : response,
					loading : false
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

		if(this.state.loading) {
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
				<div className="single-item z-depth-2">
					<h1 className="item-name" id="name">{this.state.item.name}</h1>
					<div className="row grey-text text-darken-2">
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
							<div className="description">
								<h6>Description:</h6>
								<div id="description">{this.state.item.description}</div>
							</div>

							<button onClick= {this.getAuctionSearch} className="btn waves-effect waves-light light-blue darken-2">
								View Auctions for this Item
							</button>
						</div>
					</div>
				</div>
			)
		}
	}
})

var item = <Item/>
ReactDOM.render(
  item,
  document.getElementById('itemContainer')
);
