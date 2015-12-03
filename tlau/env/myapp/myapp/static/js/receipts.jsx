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

if(window.user.type == 1) {
    window.user.id = getQueryVariable('id');
}

var Profile = React.createClass({
    getInitialState: function() {
        return {
            'loading' : true,
            receipts: {}
        }
    },
    componentDidMount: function() {
        var self = this;
        console.log(window.user);
        $.ajax({
            url:'/api/customers/'+window.user.id,
            success: function(response) {
                console.log(response);
                _.extend(window.user, response)
                self.forceUpdate();
            }
        });
        $.ajax({
            url:'/api/generate/receipt',
            data : {
                id:window.user.id
            },
            success: function(response) {
                self.setState({
                    receipts: response,
                    loading : false
                })
            }
        });
    },
    componentDidUpdate : function() {
        $('.collapsible').collapsible({
          accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    },
    render: function() {
        // console.log('render');
        if(this.state.loading) {
            return <div></div>
        }
        return (
            <div>
                <div className="template" >
                    <h3>Receipts for {window.user.name}</h3>
                    <ul className="collapsible" data-collapsible="expandable">
                        <li>
                            <div className="collapsible-header">
                                <i className="material-icons">question_answer</i>
                                <span>Sold</span>
                            </div>
                            <div className="collapsible-body">
                                {
                                    _.map(this.state.receipts.sold, function(receipt) {
                                        var imageURL = "http://placehold.it/300x300"
    	                                if(receipt.images && receipt.images.length > 0) {
    	                                    imageURL = receipt.images[0]
    	                                }
                                        return (
                                            <div className="card-panel grey lighten-5 z-depth-1">
                                              <div className="row valign-wrapper">
                                                <div className="col s2">
                                                  <img src={imageURL} style={{width:'100px', height:'100px'}}alt="" className="circle responsive-img"/>
                                                </div>
                                                <div className="col s10 black-text">
                                                    <span className="bold">{receipt.itemName}</span><br/>
                                                    <span>$ {receipt.amount} paid to <a href={"/profile?id=" + receipt.sellerID}>{receipt.sellerName}</a></span><br/>
                                                    <span>Auction <a href={"/auction/" + receipt.auctionID}>{receipt.auctionID}</a> at {receipt.time}</span><br/>
                                                    <span><a href="">Leave a review</a></span>
                                                </div>
                                              </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </li>
                        <li>
                            <div className="collapsible-header">
                                <i className="material-icons">question_answer</i>
                                <span>Purchased</span>
                            </div>
                            <div className="collapsible-body">
                                {
                                    _.map(this.state.receipts.bought, function(receipt) {
                                        var imageURL = "http://placehold.it/300x300"
    	                                if(receipt.images && receipt.images.length > 0) {
    	                                    imageURL = receipt.images[0]
    	                                }
                                        return (
                                            <div className="card-panel grey lighten-5 z-depth-1">
                                              <div className="row valign-wrapper">
                                                <div className="col s2">
                                                  <img src={imageURL} style={{width:'100px', height:'100px'}}alt="" className="circle responsive-img"/>
                                                </div>
                                                <div className="col s10 black-text">
                                                    <span className="bold">{receipt.itemName}</span><br/>
                                                    <span>Received $ {receipt.amount} from <a href={"/profile?id=" + receipt.customerID}>{receipt.boughtBy}</a></span><br/>
                                                    <span>Auction <a href={"/auction/" + receipt.auctionID}>{receipt.auctionID}</a> at {receipt.time}</span><br/>
                                                    <span><a href="">Leave a review</a></span>
                                                </div>
                                              </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="fixed-action-btn">
                    <a href="auctions/add" className="btn-floating btn-large red">
                        <i className="large material-icons">mode_edit</i>
                    </a>
                </div>
            </div>
        )
    }
});
var profile = <Profile/>;
ReactDOM.render(
  profile,
  document.getElementById('receiptsContainer')
);
