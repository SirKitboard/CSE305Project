var MonthFilter = React.createClass({
	getInitialState : function() {
		return {
			salesReport : [],
			popularItems : [],
			month : 8,
			year : 2015
		}
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

	componentDidMount : function() {
		$('select').material_select();
		$((this.refs.month)).on('change', this.filterByMonth);
		this.filterByMonth();
	},

	filterByMonth : function() {
		console.log("hi");
		var params = {
 			month : ReactDOM.findDOMNode(this.refs.month).value,
 			year : ReactDOM.findDOMNode(this.refs.year).value
 		};
		this.setState({
			month : params.month,
			year : params.year
		});
		var self = this;
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
				self.setState({
					popularItems : []
				});
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

	render : function() {
		var popularItemName = "";
    	if(this.state.popularItems[0]) {
    		popularItemName = (
					<div className="col s12 m6 popular">
						<span className="popular-item">Most Popular Item: </span>
						<span className="item">{this.state.popularItems[0].name}</span>
					</div>)
    	}

		return (
			<div>
				<div className="row ">
					<h4 className="col s3">Sales report for</h4>
					<div className="input-field col s3">
						<select ref='month' defaultValue='12'>
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
					<div className ="input-field col s3">
						<input ref='year' min="1990" id="year" type="number" defaultValue='2015' onChange={this.filterByMonth} className="validate"/>
						<label className="active" htmlFor="year">Year</label>
					</div>
				</div>

				<div className="row stats">
					<div className="col s6 m3 items">
						<span className="number-sold">{this.state.salesReport.length} </span>
						<span className="items-sold">Items Sold This Month</span>
					</div>
					{popularItemName}
				</div>

				<h5> Top Items For This Month</h5>
				<div className="row">
				{
					_.map(this.state.popularItems, function(item) {
						var imageURL = "http://placehold.it/300x300"
						if(item.images.length > 0) {
							imageURL = item.images[0]
						}
						var link = "/item/"+item.id;
						return (
							<div className="col s12 m4 l3">
								<div className="card small">
									<div className="card-image">
										<img src={imageURL}/>
										<span className="card-title">{item.name}</span>
									</div>
									<div className="card-content">
										<p>{item.description}</p>
									</div>
									<div className="card-action">
										<a href={link}>
											<i className="material-icons">visibility</i>
											<span>&nbsp;View</span>
										</a>
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
});

var Sales = React.createClass({
	getInitialState : function() {
		return {
			currentFilter : 0,
			loading: 0
		}
	},
 	componentDidMount : function() {
		$('ul.tabs').tabs();
		$('ul.tabs').tabs('select_tab', 'monthTab');
	},
	makeBackup : function() {
        $.ajax({
            url : '/api/database',
            method : 'GET',
            success : function() {
                window.location.href = "/static/databases/bak.sql"
            }
        })
    },
    render: function() {
    	return(
	    	<div className="">
				<MonthFilter style={{marginTop:'20px'}}/>
				<div className="fixed-action-btn">
                    <a onClick={this.makeBackup} className="btn-floating btn-large red"><i className="large material-icons">cloud_download</i></a>
                </div>
	    	</div>
		)
	}
});

var sales = <Sales/>
ReactDOM.render(
  sales,
  document.getElementById('salesTab')
);
