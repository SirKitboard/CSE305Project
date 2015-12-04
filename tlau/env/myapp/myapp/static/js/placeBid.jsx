window.PlaceBid = React.createClass ({

	//api/auctions/{id}/bid

	getInitialState : function() {
		return{
			error : false
		}	
	},

	sendBidInfo : function(){
		var params = {
			maxBid: ReactDOM.findDOMNode(this.refs.max_bid).value,
			value: ReactDOM.findDOMNode(this.refs.amount).value
		}

		if(params.value < window.auctionInfo.currentBid) {
			this.setState({
				error : true
			})
			return;
		}

		$.ajax({
			url: '/api/auctions/' +auctionID + '/bid',
			method: 'POST',
			data : params,
			success: function(response){
				window.location.reload();
			}

		})
	},

	resetError : function(){

		this.setState({
				error : false
			})
	},

	render : function(){
		if(this.state.error) {
			return (
				<div style={{textAlign:'center'}}>
                	<h5>Bid cannot be lower than current bid</h5>
                  <button onClick= {this.resetError} className  = "btn waves-effect waves-light  light-blue darken-2" type="submit">OK</button>	   
                </div>    			
			)
		}
        	return(
        		<div style={{textAlign:'center'}}>
                <div className="row">
                    <div className="input-field col s12 m6">
                        <input ref="amount" id="amount" type="number" min="0" step="0.01" className="validate" />
                        <label htmlFor="amount">Amount</label>
                    </div>
                    <div className="input-field col s12 m6">
                        <input ref="max_bid" id="max_bid" type="number" min="0" step="0.01" className="validate"/>
                        <label htmlFor="max_bid">Maximum Bid</label>
                    </div>
                  </div>
                  <button onClick= {this.sendBidInfo} className  = "btn waves-effect waves-light  light-blue darken-2" type="submit">Submit</button>	   
                 </div>    			
                 )
    		}

});