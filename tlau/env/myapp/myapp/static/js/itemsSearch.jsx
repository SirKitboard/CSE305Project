var ItemSearch = React.createClass ({
	getInitialState : function() {
		return{
			items: null,
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
					loading : self.state.loading + 1
				});
			}
		});
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
        	return(
        		<div className = "row">
        		{ _.map(this.state.items, function(item) {
                                var imageURL = "http://placehold.it/300x300"
                                if(item.images.length>0) {
                                    imageURL = item.images[0]
                                }
                                return (
                                	<div className="col s12 m4 l3">
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

	                                            <a href="#">View<i className="material-icons">remove_red_eye</i></a> 

	                                            
	                                        </div>   

	                                    </div>
                                    </div>
                                )
                            })}
        		
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