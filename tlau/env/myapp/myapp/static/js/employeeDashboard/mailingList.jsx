var Sales = React.createClass({
    getInitialState : function() {
        return {
            mailingLists : [],
            openEditModal : false,
            selectedEmployee : null
        }
    },
      componentDidMount : function() {
        var self = this;
        $.ajax({
            url: '/api/mailingLists',
            method: 'GET',
            success: function(response){
                self.setState({
                    mailingLists : response
                });
                console.log(response);
            }
        });
    },
    render : function() {
        var self = this;

        return (
            <div>
                {
                    _.map(this.state.mailingLists, function(mailingList) {
                        return (
                            <div>
                                <div className="row">
                                    <h4 className="col">{mailingList.name}</h4>
                                    <a style={{marginTop:'15px', marginLeft:'25px'}} className="col btn waves-effect waves-light">Send Mail</a>
                                </div>
                                <div className="row">
                                {
                                    _.map(mailingList.customers, function(customer) {
                                        return (
                                            <div className="col s12 m4 l3">
                                                <div className="card">
                                                    <div className="card-image">
                                                        <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                                        <span className="card-title white-text">{customer.name}</span>
                                                    </div>
                                                    <div className="card-content">
                                                        {customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
})
ReactDOM.render(
    <Sales/>,
    document.getElementById('mailingListTab')
)
