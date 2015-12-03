var Customers = React.createClass({
    getInitialState : function() {
        return {
            customers : [],
            filteredCustomers : [],
            openEditModal : false,
            selectedEmployee : null
        }
    },
    componentDidMount : function() {
        this.reloadCustomer();
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
                    customers : response,
                    filteredCustomers : response
                });
                console.log(response);
            }
        });
        this.closeModal();
    },
    editCustomer : function(e) {
        var target = e.target;
        if(target.tagName != "A") {
            target = target.parentElement;
        }
        var customerID = target.getAttribute('data-id');
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
    filterCustomers : function(e) {
        console.log(e);
        var value = e.target.value.toLowerCase();
        this.setState({
            filteredCustomers : _.filter(this.state.customers, function(customer){
                return (customer.name.toLowerCase().indexOf(value) > -1);
            })
        })
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
            <div>
                <div className="row">
                    <h3 className="header col s6"> All Customers </h3>
                    <div className="input-field col offset-s2 s4">
                        <i className="material-icons prefix">search</i>
                        <input onChange={this.filterCustomers} id="search" type="text"></input>
                        <label htmlFor="search">Search</label>
                    </div>
                </div>
                <div className="row">
                {
                    _.map(this.state.filteredCustomers, function(customer){
                        return (
                            <div className="col s12 m4 l3">
                                <div className="card">
                                    <div className="card-image">
                                        <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                        <div className="card-title">
                                        <span className="black-text">{customer.name}</span>
                                        <span className="card-subtitle black-text">ID: {customer.id}</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <span className="bold">Email: </span> {customer.email}<br/>
                                        <span className="bold">Telephone: </span>{customer.state}/{customer.telephone}<br/>
                                        <span className="bold">Items Sold: </span> {customer.itemsSold}<br/>
                                        <span className="bold">Items Bought: </span> {customer.itemsPurchased}<br/>
                                        <span className="bold">Rating: </span> {customer.rating}<br/>

                                    </div>
                                    <div className="card-action">
                                        <a href="#" data-id={customer.id} onClick={self.editCustomer}>
                                            <i className="material-icons">create</i>
                                            <span>&nbsp;Edit</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </div>
                <div id="modalEditCustomer" className="modal modal-fixed-footer">
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
