var Customers = React.createClass({
    getInitialState : function() {
        return {
            customers : [],
            openEditModal : false,
            selectedEmployee : null
        }
    },
    componentDidMount : function() {
        var self = this;
        $.ajax({
            url: '/api/customers',
            method: 'GET',
            success: function(response){
                self.setState({
                    customers : response
                });
                console.log(response);
            }
        });
        $(".modal-trigger").leanModal();
    },
    openAddModal : function() {
        this.setState({
            openEditModal : true
        });
        $("#modalEditCustomer").openModal();
    },
    reloadCustomer : function() {
        var self = this;
        $.ajax({
            url: '/api/customers',
            method: 'GET',
            success: function(response){
                self.setState({
                    customers : response
                });
                console.log(response);
            }
        });
        this.closeModal();
    },
    editCustomer : function(e) {
        var customerID = e.target.getAttribute('data-id');
        var customer = _.find(this.state.customers, function(customer) {
            return customer.id == customerID
        });
        this.setState({
            selectedCustomer : customer
        });
        this.openAddModal();
    },
    closeModal : function() {
        this.setState({
            openEditModal : false,
            selectedCustomer : null
        });
        $("#modalEditCustomer").closeModal();
    },
    render : function() {
        var self = this;
        var editModal = "";
        if(this.state.openEditModal){
            if(this.state.selectedCustomer) {
                editModal = (<CustomerEditor customer={this.state.selectedCustomer} onClose={this.closeModal}/>)
            }
        }
        return (
            <div className="row">
            {
                _.map(this.state.customers, function(customer){
                    return (
                        <div className="col s12 m4 l3">
                            <div className="card">
                                <div className="card-image">
                                    <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                    <span className="card-title black-text">{customer.name}</span>
                                </div>
                                <div className="card-content">
                                    <span className="bold">Email: </span> {customer.email}<br/>
                                    <span className="bold">Telephone: </span>{customer.state}/{customer.telephone}<br/>
                                    <span className="bold">Items Sold: </span> {customer.itemsSold}<br/>
                                    <span className="bold">Items Bought: </span> {customer.itemsPurchased}<br/>
                                    <span className="bold">Rating: </span> {customer.rating}<br/>

                                </div>
                                <div className="card-action">
                                    <a href="#" data-id={customer.id} onClick={self.editCustomer}>Edit</a>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <div id="modalEditCustomer" className="modal">
                {editModal}
            </div>
            </div>
        )
    }
})
ReactDOM.render(
    <Customers/>,
    document.getElementById('customersTab')
)
