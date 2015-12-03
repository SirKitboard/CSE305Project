window.CustomerEditor = React.createClass({
    getInitialState : function() {
        console.log(this.props);
        return {};
    },
    handleUpdate: function() {
        // debugger;
        // };
        var params = {
            firstName : ReactDOM.findDOMNode(this.refs.first_name).value,
            lastName : ReactDOM.findDOMNode(this.refs.last_name).value,
            address : ReactDOM.findDOMNode(this.refs.address).value,
            city : ReactDOM.findDOMNode(this.refs.city).value,
            state : ReactDOM.findDOMNode(this.refs.state).value,
            zipCode : ReactDOM.findDOMNode(this.refs.zipCode).value,
            telephone : ReactDOM.findDOMNode(this.refs.phone).value,
            email : ReactDOM.findDOMNode(this.refs.email).value,
            creditCardNumber : ReactDOM.findDOMNode(this.refs.creditCardNumber).value,
        };
        var self = this;
        $.ajax({
            url : '/api/customers/'+this.props.customer.id,
            method: 'PUT',
            data : params,
            success : function(response) {
                // window.location.href = '/#modalLogin'
                window.location.reload()
            }
        });
    },
    close : function() {
        this.props.onClose();
    },
    render: function() {
        return (
            <div className="edit-customer">
                <div className="modal-content">
                    <div className="row">
                        <h4>Update profile</h4>
                    </div>

                    <div className="row contact header">
                        <span>Contact Info </span>
                        <i className="material-icons">info_outline</i>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="first_name" id="first_name" type="text" className="validate" defaultValue={this.props.customer.firstName}/>
                            <label className="active" htmlFor="first_name">First Name</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref="last_name" id="last_name" type="text" className="validate" defaultValue={this.props.customer.lastName}/>
                            <label className="active" htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="email" id="email" type="email" className="validate" defaultValue={this.props.customer.email}/>
                            <label className="active" htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="phone" id="phone" type="tel" className="validate" defaultValue={this.props.customer.telephone}/>
                            <label className="active" htmlFor="phone">Phone</label>
                        </div>
                    </div>
                    <div className="row address header">
                        <span>Address Info</span>
                        <i className="material-icons">home</i>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="address" id="address" type="text" className="validate" defaultValue={this.props.customer.address}/>
                            <label className="active" htmlFor="address">Address</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="city" id="city" type="text" className="validate" defaultValue={this.props.customer.city}/>
                            <label className="active" htmlFor="city">City</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="state" id="state" type="text" className="validate" defaultValue={this.props.customer.state}/>
                            <label className="active" htmlFor="state">State</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref='zipCode' id="zipcode" type="number" className="validate" defaultValue={this.props.customer.zipCode}/>
                            <label className="active" htmlFor="zipCode">ZipCode</label>
                        </div>
                    </div>
                    <div className="row">
                        <span className="payment header">Payment <i className="material-icons">payment</i> </span>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="creditCardNumber" id="ccn" type="text" className="validate" defaultValue={this.props.customer.creditCardNumber}/>
                            <label className="active" htmlFor="creditCardNumber">Credit Card Number</label>
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button onClick={this.close} className="btn waves-effect waves-light button-left"
                            id='login' type="submit" name="action">
                        <span>Close</span>
                        <i className="material-icons right">clear</i>
                    </button>

                    <button onClick={this.handleUpdate} className="btn waves-effect waves-light button-right"
                            id='login' type="submit" name="action">
                        <span>Submit</span>
                        <i className="material-icons right">send</i>
                    </button>

                </div>
            </div>
        )
    }
});
