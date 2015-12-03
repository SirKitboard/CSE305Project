var CreateMailingList = React.createClass({
    getInitialState : function() {
        return  {
            customers : [],
            filteredCustomers : [],
            selectedIDs : []
        }
    },
    componentDidMount : function() {
        var self = this;
        $.ajax({
            url : '/api/customers',
            method : 'GET',
            success : function(response) {
                self.setState({
                    customers : response,
                    filteredCustomers : response
                })
            }
        })
    },
    filterCustomers : function(e) {
        var value = e.target.value;
        var filteredCustomers = _.filter(this.state.customers, function(customer) {
            return customer.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        });
        this.setState({
            filteredCustomers : filteredCustomers
        })
    },
    save : function() {
        var params = {
            name : ReactDOM.findDOMNode(this.refs.name).value,
            customers : this.state.selectedIDs
        }
        var self = this;
        $.ajax({
            url : '/api/mailingLists',
            method : 'POST',
            data : params,
            success : function(response) {
                self.props.onSubmit();
            }
        })
    },
    addCustomer : function(e) {
        var target = e.target;
        if(target.tagName != 'DIV') {
            target = target.parentElement;
        }
        var id = target.getAttribute('data-id');
        var id = parseInt(target.getAttribute('data-id'));
        var selectedIDs = this.state.selectedIDs;
        var index = selectedIDs.indexOf(id);
        console.log(index);
        if(index < 0) {
            selectedIDs.push(id);
        }
        console.log(selectedIDs)
        this.setState({
            selectedIDs : selectedIDs
        });
    },
    removeCustomer : function(e) {
        var target = e.target;
        if(target.tagName != 'DIV') {
            target = target.parentElement;
        }
        var id = parseInt(target.getAttribute('data-id'));
        var selectedIDs = this.state.selectedIDs;
        var index = selectedIDs.indexOf(id);
        if(index > -1) {
            selectedIDs.splice(index, 1);
        }
        this.setState({
            selectedIDs : selectedIDs
        });
    },
    close : function() {
        $("#modalCreateMailingList").closeModal();
    },
    render: function() {
        var self = this;
        return (
            <div>
                <div className="modal-content">
                    <div className="row">
                        <div className="input-field col s12 m4">
                            <input ref="name" id="name" type="text" className="validate"/>
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="input-field col s12 offset-m4 m4">
                            <input onChange={this.filterCustomers} ref="search" id="search" type="text" className="validate"/>
                            <label htmlFor="search">Search..</label>
                        </div>
                    </div>
                    <div className="user-chips">
                        {
                            _.map(this.state.filteredCustomers, function(customer) {
                                // console.log(customer.id);
                                // console.log(self.state.selectedIDs.indexOf(customer.id));
                                if(self.state.selectedIDs.indexOf(customer.id) > -1) {
                                    return (
                                        <div data-id={customer.id} onClick={self.removeCustomer} className="chip teal lighten-2 waves-effect">
                                            <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg" alt="Contact Person"/>
                                            {customer.name}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div data-id={customer.id} onClick={self.addCustomer} className="chip waves-effect">
                                            <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg" alt="Contact Person"/>
                                            {customer.name}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={this.close} className="btn waves-effect waves-light button-left" type="submit" name="action">
                        Close
                        <i className="material-icons right">clear</i>
                    </button>
                    <button  onClick={this.save} className="btn waves-effect waves-light button-right" type="submit" name="action">
                        Submit
                        <i className="material-icons right">send</i>
                    </button>
                </div>
            </div>
        )
    }
});

var EditMailingList = React.createClass({
    getInitialState : function(){
        console.log(this.props.mailingList.customers);
        return {
            customers : [],
            filteredCustomers : [],
            selectedIDs : _.pluck(this.props.mailingList.customers, 'id')
        }
    },
    componentDidMount : function() {
        var self = this;
        $.ajax({
            url : '/api/customers',
            method : 'GET',
            success : function(response) {
                self.setState({
                    customers : response,
                    filteredCustomers : response
                })
            }
        })
    },
    filterCustomers : function(e) {
        var value = e.target.value;
        var filteredCustomers = _.filter(this.state.customers, function(customer) {
            return customer.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        });
        this.setState({
            filteredCustomers : filteredCustomers
        })
    },
    save : function() {
        var params = {
            name : ReactDOM.findDOMNode(this.refs.name).value,
            customers : this.state.selectedIDs
        }
        var self = this;
        $.ajax({
            url : '/api/mailingLists/'+this.props.mailingList.id,
            method : 'PUT',
            data : params,
            success : function(response) {
                self.props.onSubmit();
            }
        })
    },
    addCustomer : function(e) {
        var target = e.target;
        if(target.tagName != 'DIV') {
            target = target.parentElement;
        }
        var id = target.getAttribute('data-id');
        var id = parseInt(target.getAttribute('data-id'));
        var selectedIDs = this.state.selectedIDs;
        var index = selectedIDs.indexOf(id);
        console.log(index);
        if(index < 0) {
            selectedIDs.push(id);
        }
        console.log(selectedIDs)
        this.setState({
            selectedIDs : selectedIDs
        });
    },
    removeCustomer : function(e) {
        var target = e.target;
        if(target.tagName != 'DIV') {
            target = target.parentElement;
        }
        var id = parseInt(target.getAttribute('data-id'));
        var selectedIDs = this.state.selectedIDs;
        var index = selectedIDs.indexOf(id);
        if(index > -1) {
            selectedIDs.splice(index, 1);
        }
        this.setState({
            selectedIDs : selectedIDs
        });
    },
    close : function() {
        $("#modalEditMailingList").closeModal();
    },
    render: function() {
        var self = this;
        return (
            <div>
                <div className="modal-content">
                    <div className="row">
                        <div className="input-field col s12 m4">
                            <input ref="name" id="name" type="text" defaultValue={this.props.mailingList.name} className="validate"/>
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="input-field col s12 offset-m4 m4">
                            <input onChange={this.filterCustomers} ref="search" id="search" type="text" className="validate"/>
                            <label htmlFor="search">Search..</label>
                        </div>
                    </div>
                    <div className="user-chips">
                        {
                            _.map(this.state.filteredCustomers, function(customer) {
                                // console.log(customer.id);
                                // console.log(self.state.selectedIDs.indexOf(customer.id));
                                if(self.state.selectedIDs.indexOf(customer.id) > -1) {
                                    return (
                                        <div data-id={customer.id} onClick={self.removeCustomer} className="chip teal lighten-2 waves-effect">
                                            <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg" alt="Contact Person"/>
                                            {customer.name}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div data-id={customer.id} onClick={self.addCustomer} className="chip waves-effect">
                                            <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg" alt="Contact Person"/>
                                            {customer.name}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={this.close} className="btn waves-effect waves-light button-left" type="submit" name="action">
                        Close
                        <i className="material-icons right">clear</i>
                    </button>
                    <button  onClick={this.save} className="btn waves-effect waves-light button-right" type="submit" name="action">
                        Submit
                        <i className="material-icons right">send</i>
                    </button>
                </div>
            </div>
        )
    }
});

var MailingList = React.createClass({
    getInitialState : function() {
        return {
            mailingLists : [],
            openEditModal : false,
            selectedMailingList : null
        }
    },
    componentDidMount : function() {
        this.reloadLists();
    },
    reloadLists : function(){
        var self = this;
        $.ajax({
            url: '/api/mailingLists',
            method: 'GET',
            success: function(response){
                self.setState({
                    mailingLists : response
                });
                self.closeEditPanel();
                // console.log(response);
            }
        });
    },
    openAddModal : function() {
        $("#modalCreateMailingList").openModal();
    },
    editMailingList : function(e) {
        var target = e.target;
        if(target.tagName != "BUTTON") {
            target = target.parentElement;
        }
        this.setState({
            selectedMailingList : _.find(this.state.mailingLists, function(mailingList) {
                return (mailingList.id == target.getAttribute('data-id'));
            })
        });
        $("#modalEditMailingList").openModal();
    },
    closeEditPanel : function() {
        this.setState({
            selectedMailingList : null
        });
        $("#modalEditMailingList").closeModal();
    },
    render : function() {
        var self = this;
        var mailEditModal = "";
        if(this.state.selectedMailingList) {
            console.log(this.state.selectedMailingList);
            mailEditModal = <EditMailingList mailingList={this.state.selectedMailingList} onClose={this.closeEditPanel} onSubmit={this.reloadLists}/>
        }
        return (
            <div>
                {
                    _.map(this.state.mailingLists, function(mailingList) {
                        return (
                            <div>
                                <div className="row header">
                                    <h4 className="col">{mailingList.name}</h4>
                                    <button className="col btn waves-effect waves-light">
                                        <span>Send Mail</span>
                                        <i className="material-icons right">send</i>
                                    </button>
                                    <button onClick={self.editMailingList} data-id={mailingList.id} className="col btn waves-effect waves-light">
                                        <span>Edit</span>
                                        <i className="material-icons right">edit</i>
                                    </button>
                                </div>
                                <div className="row">
                                {
                                    _.map(mailingList.customers, function(customer) {
                                        return (
                                            <div className="col s12 m4 l3">
                                                <div className="card small">
                                                    <div className="card-image">
                                                        <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                                        <span className="card-title black-text">{customer.name}</span>
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
                <div id="modalCreateMailingList"className="modal modal-fixed-footer">
                    <CreateMailingList onSubmit={this.reloadLists}/>
                </div>
                <div id="modalEditMailingList"className="modal modal-fixed-footer">
                    {mailEditModal}
                </div>
                <div className="fixed-action-btn">
                    <a onClick={this.openAddModal} className="btn-floating btn-large green">
                        <i className="large material-icons">add</i>
                    </a>
                </div>
            </div>
        )
    }
})
ReactDOM.render(
    <MailingList/>,
    document.getElementById('mailingListTab')
)
