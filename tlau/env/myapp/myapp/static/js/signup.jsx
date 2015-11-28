// if(!window.currentUser) {
//     window.location.href = "/"
// }
// console.log(window.currentUser);
var Signup = React.createClass({
    getInitialState: function() {
        return {
            'error' : 0,
            signupSuccess : false
        }
    },
    verifyPassword : function() {
        this.setState({
            'error' : 1
        });
        var password = ReactDOM.findDOMNode(this.refs.password).value
        var password_r = ReactDOM.findDOMNode(this.refs.password_r).value
        if(password != password_r) {
            this.setState({
                error : 2
            })
            // this.forceUpdate();
        }
    },
    handleSignup: function() {
        //debugger;
        if(this.state.error != 1) {
            // console.log(this.state.error);
            return;
        }
        // };
        var params = {
            firstName : ReactDOM.findDOMNode(this.refs.first_name).value,
            lastName : ReactDOM.findDOMNode(this.refs.last_name).value,
            username : ReactDOM.findDOMNode(this.refs.username).value,
            password : ReactDOM.findDOMNode(this.refs.password).value,
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
            url : '/api/customers',
            method: 'POST',
            data : params,
            success : function(response) {
                // window.location.href = '/#modalLogin'
                self.setState({
                    signupSuccess : true
                });
            }
        });
    },
    render: function() {
        // console.log('render');
        if(window.currentUser) {
            return (
                <div>
                    <h1>Please logout to signup for a new account</h1>
                </div>
            )
        }
        else if(this.state.signupSuccess) {
            return (
                <div>
                    <h3>Signup Success!</h3>
                    <h4><a href="/#modalLogin">Click here to go home and login</a></h4>
                </div>
            )
        }
        else {
            var passwordClasses = ''
            if(this.state.error == 2) {
                passwordClasses = 'invalid'
            } else if (this.state.error == 1) {
                passwordClasses = 'valid'
            }
            return (
                <div style={{textAlign:'center'}}>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="first_name" id="first_name" type="text" className="validate"/>
                            <label htmlFor="first_name">First Name</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref="last_name" id="last_name" type="text" className="validate"/>
                            <label htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="username" id="username" type="text" className="validate"/>
                            <label htmlFor="username">Username</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="email" id="email" type="email" className="validate"/>
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input onChange={this.verifyPassword} ref="password" type="password" id="password" ref="password" className={passwordClasses}/>
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input onChange={this.verifyPassword} data-error="Passwords dont match" data-success='Passwords match!' ref="password_r" id="password_r" type="password" className={passwordClasses}/>
                            <label htmlFor="password_r">Repeat Password</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="phone" id="phone" type="tel" className="validate"/>
                            <label htmlFor="phone">Phone</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="address" id="address" type="text" className="validate"/>
                            <label htmlFor="address">Address</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="city" id="city" type="text" className="validate"/>
                            <label htmlFor="city">City</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="state" id="state" type="text" className="validate"/>
                            <label htmlFor="state">State</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref='zipCode' id="zipcode" type="number" className="validate"/>
                            <label htmlFor="zipCode">ZipCode</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="creditCardNumber" id="ccn" type="text" className="validate"/>
                            <label htmlFor="creditCardNumber">Credit Card Number</label>
                        </div>
                    </div>
                    <button onClick={this.handleSignup} className="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
                      <i className="material-icons right">send</i>
                    </button>
                </div>
            )
        }
    }
});
var signup = <Signup/>
ReactDOM.render(
  signup,
  document.getElementById('signupContainer')
);
