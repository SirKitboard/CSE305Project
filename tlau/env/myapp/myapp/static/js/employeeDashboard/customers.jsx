var EditCustomer = React.createClass({
    getInitialState : function(){
        return {
            firstName : this.props.customer ? this.props.customer.firstName : "",
            lastName : this.props.customer ? this.props.customer.lastName : "",
            email : this.props.customer ? this.props.customer.lastName: "",
            address : this.props.customer ? this.props.customer.address : "",
            city : this.props.customer ? this.props.customer.city : "",
            state : this.props.customer ? this.props.customer.state : "",
            telephone : this.props.customer ? this.props.customer.telephone : "",
            creditCardNumber : this.props.customer ? this.props.customer.creditCardNumber: ""
            username : this.props.customer ? this.props.customer.username : "",
            zipCode : this.props.customer ? this.props.customer.zipCode : "",
            error : 0
        }
    },
    componentDidMount : function() {
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
    },
    verifyPassword : function() {
        this.setState({
            'error' : 1,
            saving : false
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
    close : function() {
        this.props.onClose();
    },

    updateCustomer : function() {
 
        var type = $('#isManager').is(':checked') ? 0 : 1
        if(this.props.employee.id == window.currentUser.id) {
            type = window.currentUser.employeeType
        }
        var params = {
            firstName : ReactDOM.findDOMNode(this.refs.first_name).value,
            lastName : ReactDOM.findDOMNode(this.refs.last_name).value,
            address : ReactDOM.findDOMNode(this.refs.address).value,
            city : ReactDOM.findDOMNode(this.refs.city).value,
            state : ReactDOM.findDOMNode(this.refs.state).value,
            zipCode : ReactDOM.findDOMNode(this.refs.zipCode).value,
            telephone : ReactDOM.findDOMNode(this.refs.phone).value,
            ssn : ReactDOM.findDOMNode(this.refs.ssn).value,
        };
        this.setState({
            saving: true
        })

        console.log(params);

        var self = this;
        $.ajax({
            url : '/api/employees/'+this.props.employee.id,
            method: 'PUT',
            data : params,
            success : function(response) {
                // window.location.href = '/#modalLogin'
                self.setState({
                    saving : false
                });
                self.props.onSubmit()
            },
            error : function() {
                self.setState({
                    saving : false
                })
            }
        });
    },
    render : function() {
        if(this.state.saving) {
            return (
                <div className="modal-content">
                    <div className="preloader-wrapper big active">
                       <div className="spinner-layer spinner-blue-only">
                         <div className="circle-clipper left">
                           <div className="circle"></div>
                         </div><div className="gap-patch">
                           <div className="circle"></div>
                         </div><div className="circle-clipper right">
                           <div className="circle"></div>
                         </div>
                       </div>
                   </div>
                 </div>
            )
        }
        var passwordClasses = ''
            if(this.state.error == 2) {
                passwordClasses = 'invalid'
            } else if (this.state.error == 1) {
                passwordClasses = 'valid'
            }
        var userDiv = "";
        var passwordDiv = ""
        var startDateDiv = (
            <div className="input-field col s6 m6">
                <input type="date" ref="startDate" id="startDate" disabled={this.props.employee ? true : false} className="datepicker"/>
                <label htmlFor="startDate">Start Date</label>
            </div>
        )
        var submitButton = (
            <button onClick={this.createEmployee} style={{margin:'0 5px'}} className="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
                <i className="material-icons right">send</i>
            </button>
        );
        var classActive = "";
        if(this.props.employee) {
            classActive = "active"
            startDateDiv = "";
            submitButton = (
                <button  onClick={this.updateEmployee} style={{margin:'0 5px'}} className="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
                    <i className="material-icons right">send</i>
                </button>
            )
        } else {
            userDiv = (
                <div className="row">
                    <div className="input-field col s12">
                        <input ref="username" id="username" type="text" className="validate"/>
                        <label htmlFor="username">Username</label>
                    </div>
                </div>
            )
            passwordDiv = (
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
            )
        }
        var typeInputs = (
            <div className="col s12 row">
                <p className="col s12 m6">
                    <input name="group1" type="radio" id="isRep" defaultChecked={this.state.type == 1}/>
                    <label htmlFor="isRep">Customer Rep</label>
                </p>
                <p className="col s12 m6">
                    <input name="group1" type="radio" id="isManager" defaultChecked={this.state.type == 0}/>
                    <label htmlFor="isManager">Manager</label>
                </p>
            </div>
        )
        if(this.props.employee && this.props.employee.id == window.currentUser.id) {
            typeInputs = "";
        }
        return (
            <div>
                <div className="modal-content">
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="first_name" id="first_name" type="text" className="validate" defaultValue={this.state.firstName}/>
                            <label className={classActive} htmlFor="first_name">First Name</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref="last_name" id="last_name" type="text" className="validate" defaultValue={this.state.lastName}/>
                            <label className={classActive} htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="phone" id="phone" type="tel" className="validate" defaultValue={this.state.telephone}/>
                            <label className={classActive} htmlFor="phone">Phone</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref="ssn" id="ssn" type="tel" className="validate" defaultValue={this.state.telephone}/>
                            <label className={classActive} htmlFor="phone">SSN</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6 m6">
                            <input defaultValue={this.state.hourlyRate} type="number" step="0.01" min="0" ref="hourlyRate" id="hourlyRate" className="validate"/>
                            <label className={classActive} htmlFor="hourlyRate">Hourly Rate</label>
                        </div>
                    </div>
                    {userDiv}
                    {passwordDiv}
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="address" id="address" type="text" className="validate" defaultValue={this.state.address}/>
                            <label className={classActive} htmlFor="address">Address</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="city" id="city" type="text" className="validate" defaultValue={this.state.city}/>
                            <label className={classActive} htmlFor="city">City</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="state" id="state" type="text" className="validate" defaultValue={this.state.state}/>
                            <label className={classActive} htmlFor="state">State</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref='zipCode' id="zipcode" type="number" className="validate" defaultValue={this.state.zipCode}/>
                            <label className={classActive} htmlFor="zipCode">ZipCode</label>
                        </div>
                    </div>
                    {typeInputs}
                </div>
                <div className="modal-footer">
                    <button onClick={this.close} style={{margin:'0 5px'}} className="btn waves-effect waves-light" id='login' type="submit" name="action">
                        Close
                    </button>
                    {submitButton}
                </div>
            </div>
        )
    }
})

var Employees = React.createClass({
    getInitialState : function() {
        return {
            employees : [],
            openEditModal : false,
            selectedEmployee : null
        }
    },
    componentDidMount : function() {
        var self = this;
        $.ajax({
            url: '/api/employees',
            method: 'GET',
            success: function(response){
                self.setState({
                    employees : response
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
        $("#modalAddEmployee").openModal();
    },
    reloadEmployees : function() {
        var self = this;
        $.ajax({
            url: '/api/employees',
            method: 'GET',
            success: function(response){
                self.setState({
                    employees : response
                });
                console.log(response);
            }
        });
        this.closeModal();
    },
    editEmployee : function(e) {
        var employeeID = e.target.getAttribute('data-id');
        var employee = _.find(this.state.employees, function(employee) {
            return employee.id == employeeID
        });
        this.setState({
            selectedEmployee : employee
        });
        this.openAddModal();
    },
    closeModal : function() {
        this.setState({
            openEditModal : false,
            selectedEmployee : null
        });
        $("#modalAddEmployee").closeModal();
    },
    render : function() {
        var self = this;
        var editModal = "";
        if(this.state.openEditModal){
            if(this.state.selectedEmployee) {
                editModal = (<AddEditEmployee employee={this.state.selectedEmployee} onClose={this.closeModal} onSubmit={this.reloadEmployees}/>)
            } else {
                editModal = (<AddEditEmployee onClose={this.closeModal} onSubmit={this.reloadEmployees}/>)
            }
        }
        return (
            <div className="row">
            {
                _.map(this.state.employees, function(employee){
                    return (
                        <div className="col s12 m4 l3">
                            <div className="card">
                                <div className="card-image">
                                    <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                    <span className="card-title black-text">{employee.name}</span>
                                </div>
                                <div className="card-content">
                                    <span className="bold">Hourly Rate: </span> {employee.hourlyRate}<br/>
                                    <span className="bold">Start Date: </span> {employee.startDate}<br/>
                                    <span className="bold">Telephone: </span> {employee.telephone}<br/>
                                    <span className="bold">State/ZipCode: </span>{employee.state}/{employee.zipCode}<br/>
                                </div>
                                <div className="card-action">
                                    <a href="#" data-id={employee.id} onClick={self.editEmployee}>Edit</a>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <div id="modalAddEmployee" className="modal modal-fixed-footer">
                {editModal}
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
    <Employees/>,
    document.getElementById('employeesTab')
)
