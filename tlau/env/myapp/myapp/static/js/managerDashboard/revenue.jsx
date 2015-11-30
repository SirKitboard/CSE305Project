var CustomerFilter = React.createClass({
	getInitialState : function() {
		return {
			selectedCustomer : null,
			customerSalesInfo : []
		}
	},
	componentDidMount : function() {

	},
	render : function() {
		var selectedCustomer = (
            <div onClick={this.openItemPicker}className="card-panel grey lighten-5 z-depth-1">
              <div className="row valign-wrapper">
                <div className="col s2">
                  <img src="http://placehold.it/100x100" alt="" className="circle responsive-img"/>
                </div>
                <div className="col s10">
                  <span className="black-text">
                    Click here to choose Customer
                  </span>
                </div>
              </div>
            </div>
        )
        if(this.state.selectedCustomer != null) {
            var image = <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg" style={{height:'100px', width:'100px'}} className="circle responsive-img"/>
            selectedCustomer = (
				<div className="card-panel grey lighten-5 z-depth-1">
            		<div className="row valign-wrapper">
                		<div className="col s2">
            	  			{image}
        				</div>
	                	<div className="col s10">
		                	<span className="black-text">
		                    	{this.state.itemPicked.name}
		                	</span>
	                	</div>
              		</div>
            	</div>
			)
    	}

		return (
			<div>
				{selectedCustomer}
			</div>
		)
	}
});
