if(!window.currentUser) {
    window.location.href = "/"
}
console.log(window.currentUser);

var Profile = React.createClass({
    getInitialState: function() {
        return {
            'loading' : true
        }
    },
    componentDidMount: function() {
        var self = this;
        $.ajax({
            url:'/api/customers/'+window.currentUser.id+'/stats',
            success: function(response) {
                console.log(response);
                _.extend(window.currentUser, response)
                self.forceUpdate();
            }
        });

        // $('.modal-trigger').leanModal();
    },
    openCustomerEditor : function() {
        $("#modalUpdate").openModal();
    },
    closeCustomerEditor : function() {
        $("#modalUpdate").closeModal();
    },
    render: function() {
        // console.log('render');
        if(window.currentUser.type==0) {
            return (
                <div className="profile-card z-depth-2">
                    <div className="profile-and-stats row">
                        <div className="col s12 m6 row profile">
                            <div className="col s4 profileIcon">
                                <i className=" material-icons">account_circle</i>
                            </div>
                            <div className="col s8 greeting">
                                <h4>Hi {window.currentUser.firstName},</h4>
                                <h5>You are looking great today! </h5>
                                <div className="button-rating">
                                    <a className="modal-trigger waves-effect waves-light btn" onClick={this.openCustomerEditor}>Update Profile</a>
                                    <span className="amber-text text-lighten-1 rating">
                                        {window.currentUser.rating}<i className="material-icons">star</i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m6 right-align">
                            <h5>Stats</h5>
                            You've sold <span className="bold green-text">{window.currentUser.itemsSold}</span> Items<br/>
                            You've purchased <span className="bold green-text">{window.currentUser.itemsPurchased}</span> Items<br/>
                            You've spent $<span className="bold green-text">{window.currentUser.moneySpent}</span><br/>
                            You've earned <span className="bold green-text">{window.currentUser.moneyMade}</span><br/>
                            You've currently have <span className="bold green-text">{window.currentUser.activeAuctions}</span> Auctions<br/>
                            You've currently have <span className="bold green-text">{window.currentUser.activeBids}</span> Bids<br/>
                        </div>
                    </div>
                    <div id="modalUpdate" className="modal">
                        <CustomerEditor onClose={this.closeCustomerEditor} customer={window.currentUser}/>
                    </div>
                </div>
            )
        }
        else {
            return (<h1>Employee profiles under construction</h1>)
        }
    }
});
var profile = <Profile/>;
ReactDOM.render(
  profile,
  document.getElementById('profileContainer')
);
