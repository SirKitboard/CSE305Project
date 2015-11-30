var Sales = React.createClass({


	getInitialState : function() {
		return {
			salesReport : [],
			popularItems : [],
			loading: 0,
		}
	},
 	componentDidMount : function() {
 		var params = {
 			month : ReactDOM.findDOMNode(this.refs.month).value,
 			year : ReactDOM.findDOMNode(this.refs.year).value
 		}
		var self = this;
		$('select').material_select();	
		console.log(params);
		$.ajax({
			url: '/api/generate/salesReport',
			method: 'GET',
			data : params,
			success : function(response) {
				self.setState({
					salesReport : response,
					loading : false
				});
				var itemIDs = _.pluck(response, 'itemID');
				itemIDs = self.sortByCount(itemIDs);
				_.each(itemIDs, function(itemID) {
					$.ajax({
						url : '/api/items/'+itemID,
						method : 'GET',
						success : function(response) {
							var items = self.state.popularItems;
							items.push(response);
							self.setState({
								popularItems : items
							})
						}
					})
				});
			}
		});
	},
	sortByCount : function(array){
	    var itm, a= [], L= array.length, o= {};
	    for(var i= 0; i<L; i++){
	        itm= array[i];
	        if(!itm) continue;
	        if(o[itm]== undefined) o[itm]= 1;
	        else ++o[itm];
	    }
	    for(var p in o) a[a.length]= p;
	    return a.sort(function(a, b){
	        return o[b]-o[a];
	    });
	},
    render: function() {
    	var popularItemName = "";
    	if(this.state.popularItems[0]) {
    		popularItemName = <div className="col"> {this.state.popularItems[0].name} Most Popular Item</div>
    	}
   
    	return(
    	<div>
	    	<div className= "row">
	    		<div className="col"> Sales Report For  </div>
				<div className="input-field col s4">
					<select ref='month' defaultValue='8'>
					      <option value="" disabled>Month</option>
					      <option value="1">January </option>
					      <option value="2">February </option>
					      <option value="3">March </option>
					      <option value='4'>April </option>
						  <option value='5'>May </option>
						  <option value='6'>June </option>
						  <option value='7'>July </option>
						  <option value='8'>August </option>
						  <option value='9'>September </option>
						  <option value='10'>October </option>
						  <option value='11'>November </option>
						  <option value='12'>December </option>
					</select>		  	  
				</div>
				<div className ="input-field col s4">
					 <input ref='year' min="1990" id="year" type="number" defaultValue='2015' className="validate"/>
	         		 <label className="active" htmlFor="year">Year</label>
				</div>
			</div>	

			<div className="row">
			<div className="col"> {this.state.salesReport.length} Items Sold This Month</div>
			{popularItemName}
			
			</div>	

			<div> Top Items For This Month</div>
			<div className="row">
			{
				_.map(this.state.popularItems, function(item) {
                    var imageURL = "http://placehold.it/300x300"
                    if(item.images.length > 0) {
                        imageURL = item.images[0]
                    }
                    var link = "/item/"+item.id;
                    return (
                        <div className="col s12 m4 l2">
                        <div className="card small">
                            <div className="card-image">
                                <img src={imageURL}/>
                                <span className="card-title">{item.name}</span>
                            </div>
                            <div className="card-content">
                                <p>{item.description}</p>
                            </div>
                            <div className="card-action">
                                <a href={link}>View</a>
                            </div>
                        </div>
                        </div>
                    )
                })
			}
			</div>


				  <div className="row">
				    <form className="col s12">
				      <div className="row">
				      <div className="col">See Specifics</div>
				        <div className="input-field col s4">
				          <i className="material-icons prefix">search</i>
				          <input ref='customerName' min="1990" id="year" type="number" defaultValue='2015' className="validate"/>
				          <label htmlFor="icon_prefix">Search for an item</label>
				        </div>
				        <div className="input-field col s4">
				          <i className="material-icons prefix">search</i>
				          <label htmlFor="icon_telephone">Search for a customer</label>
				        </div>
				      </div>
				    </form>
				  </div>

		</div>
	

		)}
    
});

var sales = <Sales/>
ReactDOM.render(
  sales,
  document.getElementById('salesTab')
);

