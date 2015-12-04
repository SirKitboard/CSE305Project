var AddEditEmployee = React.createClass({
    getInitialState : function(){
        return {
            firstName : this.props.employee ? this.props.employee.firstName : "",
            lastName : this.props.employee ? this.props.employee.lastName : "",
            ssn : this.props.employee ? this.props.employee.ssn : "",
            address : this.props.employee ? this.props.employee.address : "",
            city : this.props.employee ? this.props.employee.city : "",
            state : this.props.employee ? this.props.employee.state : "",
            telephone : this.props.employee ? this.props.employee.telephone : "",
            startDate : this.props.employee ? this.props.employee.startDate : "",
            hourlyRate : this.props.employee ? this.props.employee.hourlyRate : "",
            type : this.props.employee ? this.props.employee.type : 1,
            username : this.props.employee ? this.props.employee.username : "",
            zipCode : this.props.employee ? this.props.employee.zipCode : "",
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
                <input disabled type="date" ref="startDate" id="startDate" disabled={this.props.employee ? true : false} className="datepicker"/>
                <label htmlFor="startDate">Start Date</label>
            </div>
        )
        var classActive = "";
        if(this.props.employee) {
            classActive = "active";
            startDateDiv = "";
        } else {
            userDiv = (
                <div className="row">
                    <div className="input-field col s12">
                        <input disabled ref="username" id="username" type="text" className="validate"/>
                        <label htmlFor="username">Username</label>
                    </div>
                </div>
            );
            passwordDiv = (
                <div className="row">
                    <div className="input-field col s12 m6">
                        <input disabled onChange={this.verifyPassword} ref="password" type="password" id="password" ref="password" className={passwordClasses}/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="input-field col s12 m6">
                        <input disabled onChange={this.verifyPassword} data-error="Passwords dont match" data-success='Passwords match!' ref="password_r" id="password_r" type="password" className={passwordClasses}/>
                        <label htmlFor="password_r">Repeat Password</label>
                    </div>
                </div>
            )
        }
        var typeInputs = (
            <div className="row">
                <p className="col s6 m3 employment-type">
                    <input disabled name="group1" type="radio" id="isRep" defaultChecked={this.state.type == 1}/>
                    <label htmlFor="isRep">Customer Rep</label>
                </p>
                <p className="col s6 m3">
                    <input disabled name="group1" type="radio" id="isManager" defaultChecked={this.state.type == 0}/>
                    <label htmlFor="isManager">Manager</label>
                </p>
            </div>
        )
        if(this.props.employee && this.props.employee.id == window.currentUser.id) {
            typeInputs = "";
        }
        return (
            <div>
                <div className="modal-content container edit-customer">
                    <div className="row">
                        <h4>View Employee Info</h4>
                    </div>
                    <div className="row contact header">
                        <span>Contact Info&nbsp;</span>
                        <i className="material-icons">info_outline</i>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input disabled ref="first_name" id="first_name" type="text" className="validate" defaultValue={this.state.firstName}/>
                            <label className={classActive} htmlFor="first_name">First Name</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input disabled ref="last_name" id="last_name" type="text" className="validate" defaultValue={this.state.lastName}/>
                            <label className={classActive} htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input disabled ref="phone" id="phone" type="tel" className="validate" defaultValue={this.state.telephone}/>
                            <label className={classActive} htmlFor="phone">Phone</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input disabled ref="ssn" id="ssn" type="tel" className="validate" defaultValue={this.state.telephone}/>
                            <label className={classActive} htmlFor="phone">SSN</label>
                        </div>
                    </div>
                    {typeInputs}
                    <div className="row address header">
                        <span>Address Info&nbsp;</span>
                        <i className="material-icons">home</i>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input disabled ref="address" id="address" type="text" className="validate" defaultValue={this.state.address}/>
                            <label className={classActive} htmlFor="address">Address</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input disabled ref="city" id="city" type="text" className="validate" defaultValue={this.state.city}/>
                            <label className={classActive} htmlFor="city">City</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input disabled ref="state" id="state" type="text" className="validate" defaultValue={this.state.state}/>
                            <label className={classActive} htmlFor="state">State</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input disabled ref='zipCode' id="zipcode" type="number" className="validate" defaultValue={this.state.zipCode}/>
                            <label className={classActive} htmlFor="zipCode">ZipCode</label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={this.close} className="btn waves-effect waves-light" id='login' type="submit" name="action">
                        <span>Close</span>
                        <i className="material-icons right">clear</i>
                    </button>
                </div>
            </div>
        )
    }
})

var Employees = React.createClass({
    getInitialState : function() {
        return {
            employees : [],
            filteredEmployees : [],
            openEditModal : false,
            selectedEmployee : null
        }
    },
    componentDidMount : function() {
        this.reloadEmployees();
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
                    employees : response,
                    filteredEmployees : response
                });
                // console.log(response);
            }
        });
    },
    editEmployee : function(e) {
        var target = e.target;
        if(target.tagName != "A") {
            target = target.parentElement;
        }
        var employeeID = target.getAttribute('data-id');
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
    filterEmployees : function(e) {
        var value = e.target.value.toLowerCase();
        this.setState({
            filteredEmployees : _.filter(this.state.employees, function(employee){
                return (employee.name.toLowerCase().indexOf(value) > -1);
            })
        })
    },
    render : function() {
        console.log(this.state.filteredEmployees);
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
            <div>
                <div className="row">
                    <h3 className="header col s6"> All Employees </h3>
                    <div className="input-field col offset-s2 s4">
                        <i className="material-icons prefix">search</i>
                        <input onChange={this.filterEmployees} id="search" type="text"></input>
                        <label htmlFor="search">Search</label>
                    </div>
                </div>


                <div className="row">
                {
                    _.map(this.state.filteredEmployees, function(employee){
                        return (
                            <div className="col s12 m4 l3">
                                <div className="card">
                                    <div className="card-image person">
                                        <img src="http://dismagazine.com/uploads/2011/08/notw_silhouette-1.jpg"/>
                                        <span className="card-title white-text">{employee.name}</span>
                                    </div>
                                    <div className="card-content">
                                        <span className="bold">Hourly Rate: </span> {employee.hourlyRate}<br/>
                                        <span className="bold">Start Date: </span> {employee.startDate}<br/>
                                        <span className="bold">Telephone: </span> {employee.telephone}<br/>
                                        <span className="bold">State/ZipCode: </span>{employee.state}/{employee.zipCode}<br/>
                                    </div>
                                    <div className="card-action">
                                        <a href="#" data-id={employee.id} onClick={self.editEmployee}>
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
                <div id="modalAddEmployee" className="modal modal-fixed-footer">
                    {editModal}
                </div>
            </div>
        )
    }
})
ReactDOM.render(
    <Employees/>,
    document.getElementById('employeesTab')
)
