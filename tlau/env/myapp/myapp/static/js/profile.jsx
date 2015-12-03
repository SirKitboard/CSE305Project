if(!window.currentUser) {
    window.location.href = "/"
}
console.log(window.currentUser);

window.user = window.currentUser;

var getQueryVariable = function  (variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
};

var profileID = getQueryVariable('id');

var Profile = React.createClass({
    getInitialState: function() {
        if(!profileID) {
            return {
                'loading' : true,
                'self' : true,
                auctions : {}
            }
        }
        else {
            window.user.id = profileID;
            return {
                'loading' : true,
                'self' : false,
                auctions: {}
            }
        }
    },
    componentDidMount: function() {
        var self = this;
        console.log(window.user);
        if(!this.state.self) {
            $.ajax({
                url:'/api/customers/'+window.user.id,
                success: function(response) {
                    console.log(response);
                    _.extend(window.user, response)
                    self.forceUpdate();
                }
            });
        }
        $.ajax({
            url:'/api/customers/'+window.user.id+'/stats',
            success: function(response) {
                self.setState({
                    loading : false
                })
                console.log(response);
                _.extend(window.user, response)
                self.forceUpdate();
            }
        });
        $.ajax({
            url:'/api/customers/'+window.user.id+'/auctionHistory',
            success: function(response) {
                self.setState({
                    auctions : response
                })
                console.log(response);
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
    componentDidUpdate : function() {
        $('.collapsible').collapsible({
          accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    },
    render: function() {
        // console.log('render');
        if(window.user.type==0) {
            if(this.state.loading) {
                return (
                    <div className="profile-card z-depth-2">
                      <div className="progress">
                          <div className="indeterminate"></div>
                      </div>
                    </div>
                )
            }
            var profileInfo = "";
            if(this.state.self) {
                profileInfo = (
                    <div className="profile-and-stats row">
                        <div className="col s12 m6 row profile">
                            <div className="col s4 profileIcon">
                                <i className=" material-icons">account_circle</i>
                            </div>
                            <div className="col s8 greeting">
                                <h4>Hi {window.user.firstName},</h4>
                                <h5>You are looking great today! </h5>
                                <div className="button-rating">
                                    <a className="modal-trigger waves-effect waves-light btn" onClick={this.openCustomerEditor}>Update Profile</a>
                                    <span className="amber-text text-lighten-2 rating">
                                        {window.user.rating}<i className="material-icons">star</i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m6 right-align">
                            <h5>Stats</h5>
                            You've sold <span className="bold green-text">{window.user.itemsSold}</span> Items<br/>
                            You've purchased <span className="bold green-text">{window.user.itemsPurchased}</span> Items<br/>
                            You've spent $<span className="bold green-text">{window.user.moneySpent}</span><br/>
                            You've earned <span className="bold green-text">{window.user.moneyMade}</span><br/>
                            You've currently have <span className="bold green-text">{window.user.activeAuctions}</span> Auctions<br/>
                            You've currently have <span className="bold green-text">{window.user.activeBids}</span> Bids<br/>
                        </div>
                    </div>
                )
            }
            else {
                profileInfo = (
                    <div className="profile-and-stats row">
                        <div className="col s12 m6 row profile">
                            <div className="col s4 profileIcon">
                                <i className=" material-icons">account_circle</i>
                            </div>
                            <div className="col s8 greeting">
                                <h4>{window.user.firstName} {window.user.lastName}</h4>
                                <div className="button-rating">
                                    <span className="amber-text text-lighten-2 rating">
                                        {window.user.rating}<i className="material-icons">star</i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m6 right-align">
                            <h5>Stats</h5>
                            Sold <span className="bold green-text">{window.user.itemsSold}</span> Items<br/>
                            Purchased <span className="bold green-text">{window.user.itemsPurchased}</span> Items<br/>
                            Spent $<span className="bold green-text">{window.user.moneySpent}</span><br/>
                            Earned <span className="bold green-text">{window.user.moneyMade}</span><br/>
                            Currently have <span className="bold green-text">{window.user.activeAuctions}</span> Auctions<br/>
                            Currently have <span className="bold green-text">{window.user.activeBids}</span> Bids<br/>
                        </div>
                    </div>
                )
            }
            return (
                <div>
                    <div className="profile-card z-depth-2">
                        {profileInfo}
                    </div>

                    <div className="template" >
                        <h3>Auction History</h3>
                        <ul className="collapsible" data-collapsible="expandable">
                            <li>
                                <div className="collapsible-header">
                                    <i className="material-icons">create</i>
                                    <span>Created</span>
                                </div>
                                <div className="collapsible-body">
                                    <div style={{margin:'5px'}} className="row">
                                    {
                                        _.map(this.state.auctions.created, function(auction) {
                                            if(auction.currentBid < auction.openingBid){
                            					auction.currentBid = auction.openingBid
                            				};
                                            var imageURL = "http://placehold.it/300x300"
        	                                if(auction.images && auction.images.length > 0) {
        	                                    imageURL = auction.images[0]
        	                                }
                                            return (
                                                <div className="col s12 m4 l3">
                                                    <div className={auction.finished ? "card small grey lighten-2" : "card small"}>
                                                        <div className="card-image">
                                                            <img src={imageURL}/>
                                                            <div  className="card-title">
                                                                <span className="white-text">{auction.itemName}</span>
                                                             <span className="card-subtitle white-text">${auction.currentBid}</span>
                                                            </div>
                                                        </div>

                                                        <div className="card-content">
                                                            <p>{auction.description}</p>
                                                        </div>

                                                        <div className="card-action"  >

                                                            <a href={"/auction/"+auction.id}>
                                                                <i className="material-icons">remove_red_eye</i>
                                                                <span>&nbsp;View</span>
                                                            </a>

                                                            {(auction.finished) ?
                                                                <a className="closed">
                                                                    <i className="material-icons">close</i>
                                                                    <span>CLOSED</span>
                                                                </a>
                                                                : ""
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="collapsible-header">
                                    <i className="material-icons">mood</i>
                                    <span>Won</span>
                                </div>
                                <div className="collapsible-body">
                                    <div style={{margin:'5px'}} className="row">
                                    {
                                        _.map(this.state.auctions.won, function(auction) {
                                            if(auction.currentBid < auction.openingBid){
                            					auction.currentBid = auction.openingBid
                            				};
                                            var imageURL = "http://placehold.it/300x300"
        	                                if(auction.images && auction.images.length > 0) {
        	                                    imageURL = auction.images[0]
        	                                }
                                            return (
                                                <div className="col s12 m4 l3">
                                                    <div className={auction.finished ? "card small grey lighten-2" : "card small"}>
                                                        <div className="card-image">
                                                            <img src={imageURL}/>
                                                            <div  className="card-title">
                                                                <span className="white-text">{auction.itemName}</span>
                                                                <span className="card-subtitle white-text">${auction.currentBid}</span>
                                                            </div>
                                                        </div>

                                                        <div className="card-content">
                                                            <p>{auction.description}</p>
                                                        </div>

                                                        <div className="card-action"  >

                                                            <a href={"/auction/"+auction.id}>
                                                                <i className="material-icons">remove_red_eye</i>
                                                                <span>&nbsp;View</span>
                                                            </a>

                                                            {(auction.finished) ?
                                                                <a className="closed">
                                                                    <i className="material-icons">close</i>
                                                                    <span>CLOSED</span>
                                                                </a>
                                                                :
                                                                ""
                                                                }

                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="collapsible-header">
                                    <i className="material-icons">history</i>
                                    <span>Participated</span>
                                </div>
                                <div className="collapsible-body">
                                    <div style={{margin:'5px'}} className="row">
                                    {
                                        _.map(this.state.auctions.participated, function(auction) {
                                            if(auction.currentBid < auction.openingBid){
                            					auction.currentBid = auction.openingBid
                            				};
                                            var imageURL = "http://placehold.it/300x300"
        	                                if(auction.images && auction.images.length > 0) {
        	                                    imageURL = auction.images[0]
        	                                }
                                            return (
                                                <div className="col s12 m4 l3">
                                                    <div className={auction.finished ? "card small grey lighten-2" : "card small"}>
                                                        <div className="card-image">
                                                            <img src={imageURL}/>
                                                            <div className="card-title">
                                                                <span className="white-text">{auction.itemName}</span>
                                                                <span className="card-subtitle white-text">${auction.currentBid}</span>
                                                            </div>
                                                        </div>

                                                        <div className="card-content">
                                                            <p>{auction.description}</p>
                                                        </div>

                                                        <div className="card-action"  >

                                                            <a href={"/auction/"+auction.id}>
                                                                <i className="material-icons">remove_red_eye</i>
                                                                <span>&nbsp;View</span>
                                                            </a>

                                                            {(auction.finished) ?
                                                                <a className="closed">
                                                                    <i className="material-icons">close</i>
                                                                    <span>CLOSED</span>
                                                                </a>
                                                                :
                                                                ""
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id="modalUpdate" className="modal">
                        <CustomerEditor onClose={this.closeCustomerEditor} customer={window.user}/>
                    </div>
                    <div className="fixed-action-btn">
                        <a href="auctions/add" className="btn-floating btn-large red">
                            <i className="large material-icons">mode_edit</i>
                        </a>
                        <ul>
                          <li><a href="/profile/receipts" className="btn-floating blue"><i className="material-icons">receipt</i></a></li>
                        </ul>
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
