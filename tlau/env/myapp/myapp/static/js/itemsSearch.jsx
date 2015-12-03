var ItemSearch = React.createClass ({
	getInitialState : function() {
		return{
			items: [],
			types : [],
			loading: 0
		}
	},
	componentDidMount : function() {
		var self = this;
		$.ajax({
			url: '/api/items/search',
			method: 'GET',
			data: {
				keyword: self.getQueryVariable("query")

			},
			success : function(response) {
				self.setState({
					items : response,
					filteredItems : response,
					types : _.unique(_.pluck(response, 'type')),
					loading : self.state.loading + 1
				});
			}
		});
	},
	filterByType : function(){
		var type = ReactDOM.findDOMNode(this.refs.type).value;
		if(type == "0"){
			this.setState({
				filteredItems : this.state.items
			});
		} else {
			console.log(type);
			this.setState({
				filteredItems : _.filter(this.state.items, function(item) {
					return (item.type == type);
				})
			});
		}
	},
	componentDidUpdate: function(prevProps, prevState) {
		if(prevState.types != this.state.types) {
			$('select').material_select();
			$((this.refs.type)).on('change', this.filterByType);
			this.filterByType();
		}
	},
	getQueryVariable : function  (variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	},
	newSearch : function(e) {
		console.log(value);
		var value = e.target.value;
		var url = '/api/items/search';
		if(value == "") {
			url = '/api/items';
		}
		var self = this;
		$.ajax({
			'url' : url,
			method : 'GET',
			data : {
				keyword: value
			},
			success : function(response) {
				self.setState({
					items : response,
					types : _.unique(_.pluck(response, 'type')),
					// loading : self.state.loading + 1
				});
				self.filterByType();
			}
		})
	},
	render : function(){
		var self = this;
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
			console.log(this.state.types);
        	return(
        		<div>
				<div className="row">
					<div className="col s12 m6 input-field">
					  <i ref="search" className="material-icons prefix">search</i>
					  <input id="search" onChange={this.newSearch} type="text" required/>
					</div>
					<div className="col s3 input-field ">
					   <select ref="type">
						 <option value="0" disabled selected>Filter By Type</option>
						 {
							 _.map(this.state.types, function(type) {
								 return <option defaultValue={type}>{type}</option>
							 })
						 }
					   </select>
					   <label>Materialize Select</label>
					 </div>
			    </div>
				<h4>Search Results</h4>
				<div className = "row">
        		{ (this.state.filteredItems.length == 0) ? (<h5 style={{marginLeft:'20px'}}>No results found</h5>) : _.map(this.state.filteredItems, function(item) {
                        var imageURL = "http://placehold.it/300x300"
						var itemPath = "/item/"+item.id
                        if(item.images.length>0) {
                            imageURL = item.images[0]
                        }
                        return (
                        	<div className="col s12 m4 l2">
                                <div className="card small">
                                    <div className="card-image">
                                        <img src={imageURL}/>
                                        <span className="card-title">{item.name}
                                        </span>
                                    </div>
                                    <div className="card-content">
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="card-action"  >
                                        <a href={itemPath}>View<i className="material-icons">remove_red_eye</i></a>
                                    </div>
                                </div>
                            </div>
                        )
                    })
				}
        		</div>
				</div>
        	)

        }
	}
});

var auction = <ItemSearch/>
ReactDOM.render(
  auction,
  document.getElementById('itemSearchContainer')
);
