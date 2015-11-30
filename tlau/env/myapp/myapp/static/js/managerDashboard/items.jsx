var ItemsSearch = React.createClass({

getInitialState : function() {
		return {
			items : [],
			filteredItems : [],
			loading: 0,
		}
	},

	 	componentDidMount : function() {
		var self = this;
		$('select').material_select();	
		$.ajax({
			url: '/api/items',
			method: 'GET',
			success : function(response) {
				self.setState({
					items : response,
					filteredItems : response,
					loading : false
				});
		
			}
		});
	},
	filteredItems : function(e) {
		var items = this.state.items;
		var query = e.target.value;
		this.setState({
			filteredItems : _.filter(items, function(item) {
				return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
			})
		})
	},
    render: function() {
    
    	return(
    	
		<div> 	 
		    <div className= "col s12 m4 l3">
		        <div className="input-field">
		          <input onChange={this.filteredItems}id="search" type="search" required></input>
		          <label htmlFor="search"><i className="material-icons">search</i></label>
		          <i className="material-icons">close</i>
		        </div>  
		    </div>

		   <div> All Items </div>
			<div className="row">
			{
				_.map(this.state.filteredItems, function(item) {
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

		</div>
		)}
});



var items = <ItemsSearch/>
ReactDOM.render(
items,
document.getElementById('itemsTab')
);