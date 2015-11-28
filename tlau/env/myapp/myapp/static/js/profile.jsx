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

        $('.modal-trigger').leanModal();
    },
    render: function() {
        // console.log('render');
        if(window.currentUser.type==0) {
            return (
                <div>
                    <div className="profileAndStats row">
                        <div className="col s12 m6 row">
                            <div className="col s4"><i className="profileIcon material-icons">account_circle</i></div>
                            <div className="col s8">
                                <h4>Hi {window.currentUser.firstName}</h4>
                                <h5>You're looking great today! </h5>
                                <a className="modal-trigger waves-effect waves-light btn" href="#modalUpdate">Update Profile</a> <span style={{marginLeft:'5px', fontSize:'20px'}} className="amber-text text-lighten-1">{window.currentUser.rating}<i className="material-icons">star</i></span>
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
                </div>
            )
        }
        else {
            return (<h1>Employee profiles under construction</h1>)
        }
    }
});
var profile = <Profile/>
ReactDOM.render(
  profile,
  document.getElementById('profileContainer')
);
ReactDOM.render(
  <CustomerEditor customer={window.currentUser}/>,
  document.getElementById('updateContainer')
);
