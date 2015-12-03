var CustomerPicker = React.createClass({
    getInitialState : function() {
        return {
            filteredCustomers : [],
            allCustomers : [],
            picked : null,
            loading : true
        }
    },
    componentDidMount : function() {
        var self = this;
        $.ajax({
            url : '/api/customers',
            method : 'GET',
            success : function(response) {
                self.setState({
                    allCustomers : response,
                    filteredCustomers : response
                });
            }
        })
    },
    pickCustomer : function(e) {
        // console.log(e.nativeEvent);
        // console.log(e.target);
        // debugger;
        var target = e.target;
        if(e.target.tagName == "TD") {
            target = target.parentElement;
        }
        var customerID = target.getAttribute('data-id');
        this.setState({
            picked : _.find(this.state.allCustomers, function(customer) {
                return customer.id == customerID
            })
        })
    },
    submit : function() {
        if(this.state.picked) {
            this.props.onSubmit(this.state.picked);
        } else {
            this.props.onClose();
        }
    },
    close : function() {
        this.props.onClose()
    },
    filterCustomers : function(e) {
        var value = e.target.value.toLowerCase();
        if(value == "") {
            this.setState({
                filteredCustomers : this.state.allCustomers
            })
        } else {
            this.setState({
                filteredCustomers : _.filter(this.state.allCustomers, function(customer) {
                    return customer.name.toLowerCase().indexOf(value) > -1
                })
            });
        }
    },
    render : function() {
        var self = this;
        var tableBody = <tr><td colSpan="4">No customers to display :( </td></tr>
        if(this.state.filteredCustomers.length > 0) {
            tableBody = _.map(this.state.filteredCustomers, function(customer) {
                var image = <img className="circle responsive-img" src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                var classes = "";
                if(self.state.picked && customer.id == self.state.picked.id) {
                    classes = "selected";
                }
                return (
                    <tr onClick={self.pickCustomer} data-id={customer.id} className={classes}>
                      <td>{image}</td>
                      <td>{customer.name}</td>
                      <td>{customer.itemsSold}</td>
                      <td>{customer.itemsPurchased}</td>
                      <td>{customer.rating}</td>
                    </tr>
                )
            });
        }
        return (
            <div className="modal-picker">
                <div className="modal-content">
                <div className="row">
                    <div className="input-field col s12 offset-m6 m6">
                        <input onChange={this.filterCustomers} ref="search" id="search" type="text" className="validate"/>
                        <label htmlFor="search">Search..</label>
                    </div>
                </div>
                <table className="striped">
                    <thead>
                      <tr>
                          <th data-field="image">Image</th>
                          <th data-field="name">Customer Name</th>
                          <th data-field="itemsSold">Items Sold</th>
                          <th data-field="itemsPurchased">Items Purchased</th>
                          <th data-field="rating">Rating</th>
                      </tr>
                    </thead>

                    <tbody>
                        {tableBody}
                    </tbody>
              </table>
              </div>
              <div className="modal-footer">
                <button onClick={this.close} className="btn waves-effect waves-light btn-left" type="submit" name="action">
                    <span>Close</span>
                    <i className="material-icons right">clear</i>
                </button>
                <button onClick={this.submit} className="btn waves-effect waves-light btn-right" type="submit" name="action">Submit
                  <i className="material-icons right">send</i>
                </button>
              </div>
            </div>
        )
    }
});

var RevenueTab = React.createClass({
    getInitialState : function(){
        return {
            selectedCustomer : null,
            selectedItem : null,
            currentFilter : 0,
            revenueInfo : [],
            revenueStats : null
        }
    },
    componentDidMount : function() {
        var self = this;
        $.ajax({
            url : '/api/generate/revenueStats',
            method : 'GET',
            success : function(response) {
                self.setState({
                    revenueStats : response
                });
            }
        })
    },
    getCustomerName: function() {
        if(this.state.selectedCustomer) {
            return this.state.selectedCustomer.name;
        }
        return "";
    },
    setCustomerFilter : function(customer) {
        this.setState({
            selectedCustomer : customer,
            selectedItem : item,
            currentFilter : 1
        });
        var self = this;
        $.ajax({
            url : '/api/generate/revenueReport',
            data : {
                customerID : customer.id,
            },
            method : 'GET',
            success : function(response){
                self.setState({
                    revenueInfo : response
                })
            }
        });
        this.closeCustomerPicker();
    },
    pickCustomer : function() {
        $("#modalCustomerPicker").openModal();
    },
    closeCustomerPicker : function() {
        $("#modalCustomerPicker").closeModal();
    },
    getItemName: function() {
        if(this.state.selectedItem) {
            return this.state.selectedItem.name;
        }
        return "";
    },
    setItemFilter : function(item) {
        this.setState({
            selectedItem : item,
            selectedCustomer : null,
            currentFilter : 2
        });
        var self = this;
        $.ajax({
            url : '/api/generate/revenueReport',
            data : {
                itemID : item.id,
            },
            method : 'GET',
            success : function(response){
                self.setState({
                    revenueInfo : response
                })
            }
        })
        this.closeItemPicker();
    },
    pickItem : function() {
        $("#modalItemPicker").openModal();
    },
    closeItemPicker : function() {
        $("#modalItemPicker").closeModal();
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
    render : function() {
        var revenueInfo = "";
        if(this.state.currentFilter == 1) {
            var totalBought = 0;
            var totalValue = 0.0;
            var monthBought = 0;
            var monthValue = 0.0;
            _.each(this.state.revenueInfo.total, function(row) {
                totalBought+=row.copiesSold;
                totalValue+= (row.revenue / 10);
            });
            _.each(this.state.revenueInfo.month, function(row) {
                monthBought+=row.copiesSold;
                monthValue+= (row.revenue / 10);
            });
            revenueInfo = (
                <div className="z-depth-1">
                    <h5>Customer you chose</h5>
                    <div className="row">
                        <div className="col s12 m2"><img className="responsive-img circle" src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/></div>
                        <div className="col s12 m10">
                            <div className="row revenueValues">
                                <div className="col s12 m6">
                                    <span className="value">{totalBought}</span> Items bought
                                </div>
                                <div className="col s12 m6">
                                    <span className="value">{monthBought}</span> bought this month
                                </div>
                            </div>
                            <div className="row revenueValues">
                                <div className="col s12 m6">
                                    <span className="value">${totalValue}</span> Total Revenue
                                </div>
                                <div className="col s12 m6">
                                    <span className="value">${monthValue}</span> Revenue this month
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.currentFilter == 2) {
            var totalBought = 0;
            var totalValue = 0.0;
            var monthBought = 0;
            var monthValue = 0.0;
            _.each(this.state.revenueInfo.total, function(row) {
                totalBought+=row.copiesSold;
                totalValue+= (row.revenue / 10);
            });
            _.each(this.state.revenueInfo.month, function(row) {
                monthBought+=row.copiesSold;
                monthValue+= (row.revenue / 10);
            });
            revenueInfo = (
                <div style={{marginTop:'20px', padding:'5px'}} className="z-depth-1">
                    <h5>Item you chose</h5>
                    <div className="row">
                        <div className="col s12 m2"><img className="responsive-img circle" src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/></div>
                        <div className="col s12 m10">
                            <div className="row revenueValues">
                                <div className="col s12 m6">
                                    <span className="value">{totalBought}</span> Total Sold
                                </div>
                                <div className="col s12 m6">
                                    <span className="value">{monthBought}</span> sold this month
                                </div>
                            </div>
                            <div className="row revenueValues">
                                <div className="col s12 m6">
                                    <span className="value">${totalValue}</span> Total Revenue
                                </div>
                                <div className="col s12 m6">
                                    <span className="value">${monthValue}</span> Revenue this month
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        var revenueStats = "";
        if(this.state.revenueStats) {
            revenueStats = (
                <div>
                    <div className="row">
                        <h5>Generated Highest Total Revenue</h5>
                    </div>
                    <div className="row highest-revenue">
                        <div className="col s12 m4">
                            <span className="bold grey-text text-darken-1 revenue-topic">Item</span>
                            <div className="card">
                                <div className="card-image">
                                    <img src={this.state.revenueStats.item.images.length > 0 ? this.state.revenueStats.item.images[0] : "http://placehold.it/300x300"}/>
                                    <span className="card-title">{this.state.revenueStats.item.name}</span>
                                </div>
                                <div className="card-content">
                                    <p>Revenue : ${this.state.revenueStats.item.revenue}</p>
                                    <p>Count : {this.state.revenueStats.item.copiesSold}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m4">
                            <span className="bold grey-text text-darken-1 revenue-topic">Customer</span>
                            <div className="card">
                                <div className="card-image">
                                    <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                    <span className="card-title">{this.state.revenueStats.customer.firstName + " " + this.state.revenueStats.customer.firstName}</span>
                                </div>
                                <div className="card-content">
                                    <p>Revenue : ${this.state.revenueStats.customer.revenue}</p>
                                    <p>Count : {this.state.revenueStats.customer.copiesSold}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m4">
                            <span className="bold grey-text text-darken-1 revenue-topic">Customer Representative</span>
                            <div className="card">
                                <div className="card-image">
                                    <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                    <span className="card-title">{this.state.revenueStats.employee.firstName + " " + this.state.revenueStats.employee.firstName}</span>
                                </div>
                                <div className="card-content">
                                    <p>Revenue : ${this.state.revenueStats.employee.revenue}</p>
                                    <p>Count : {this.state.revenueStats.employee.copiesSold}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <div className="row">
                    <span className="specific col s3">See revenue of a specific:</span>
                    <div className="input-field col s3">
                        <input id="customer" type="text" onClick={this.pickCustomer} className="validate" value={this.getCustomerName()}/>
                        <label htmlFor="customer" className={this.state.selectedCustomer ? "active" : ""}>Customer</label>
                    </div>
                    <div className="input-field col s3">
                        <input id="item" type="text" onClick={this.pickItem} className="validate" value={this.getItemName()}/>
                        <label htmlFor="item" className={this.state.selectedItem ? "active" : ""}>Item</label>
                    </div>
                </div>
                {revenueInfo}
                {revenueStats}
                <div id="modalCustomerPicker" className="modal modal-fixed-footer">
                    <CustomerPicker onClose={this.closeCustomerPicker} onSubmit={this.setCustomerFilter}/>
                </div>
                <div id="modalItemPicker" className="modal modal-fixed-footer">
                    <ItemPicker onClose={this.closeItemPicker} onSubmit={this.setItemFilter}/>
                </div>
                <div className="fixed-action-btn">
                    <a onClick={this.makeBackup} className="btn-floating btn-large red"><i className="large material-icons">cloud_download</i></a>
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <RevenueTab/>,
    document.getElementById('revenueTab')
)
