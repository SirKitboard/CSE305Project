window.BidHistory = React.createClass ({
	getInitialState : function() {
		return{
			bids : null,
			item: null,
			loading: 0
		}
	},
	componentDidMount : function() {
		var self = this;
		$.ajax({
			url: '/api/auction/'+auctionID+'/bids',
			method: 'GET',
			success : function(response) {
				self.setState({
					bids : response,
					loading : self.state.loading + 1
				});
				console.log(response);
			}
		});
	},
	render : function(){

		var options = {
		 	weekday: "long", year: "numeric", month: "short",
		    day: "numeric", hour: "2-digit", minute: "2-digit"
		};

		if(this.state.loading < 1) {
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
    			<table className="striped">
		        <thead>
		          <tr>
		              <th data-field="firstName">Customer Name</th>
		              <th data-field="time"> Time </th>
		              <th data-field="amount">Amount</th>
		          </tr>
		         </thead>
		          <tbody>

    			{ _.map(this.state.bids, function(bid) {


						return (<tr>
			            	<td><a href={"/profile?id="+bid.customerID}> {bid.name}</a></td>
			            	<td><span id= "time">{new Date(bid.time).toLocaleDateString("en-US", options)}</span></td>
			            	<td>{bid.amount}</td>
			            </tr>)
			    	})
    			}
    			</tbody>
    			</table>
    			)
    		}

        }
});
