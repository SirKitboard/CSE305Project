var Sales = React.createClass({
    getInitialState : function() {
        return {
            auctions : [],
            openEditModal : false,
            selectedEmployee : null
        }
    },
    componentDidMount : function() {
        this.reloadAuctions();
    },
    reloadAuctions : function() {
        var self = this;
        $.ajax({
            url: '/api/auctions/unapproved',
            method: 'GET',
            success: function(response){
                self.setState({
                    auctions : response
                });
                console.log(response);
            }
        });
    },
    approveAuction : function(e) {
        var auctionID = e.target.getAttribute('data-id');
        var self = this;
        $.ajax({
            url : '/api/auctions/'+auctionID+'/win',
            data : {
                auctionID
            },
            method : 'POST',
            success : function() {
                self.reloadAuctions();
            }
        })

    },
    render : function() {
        var self = this;

        return (
            <div className="row">
            {
                _.map(this.state.auctions, function(auction){
                	var imageURL = "http://placehold.it/300x300"
                    if(auction.itemImage.length > 0) {
                        imageURL = auction.itemImage[0]
                    }
                    var winnerName = (<span><span className="bold">Winner: </span>{auction.winnerName}</span>)
                    // debugger;
                    if(!auction.currentBid) {
                        winnerName = (<span className="bold">No Bids</span>);
                    } else if(auction.currentBid < auction.reserve) {
                        winnerName = (<span className="bold">Reserve not met</span>);
                    }
                    return (
                        <div className="col s12 m4 l3">
                            <div className="card">
                                <div className="card-image">
                                    <img src={imageURL}/>
                                    <span className="card-title white-text">{auction.itemName}<br/>{auction.currentBid}</span>
                                </div>
                                <div className="card-content">
                                    {winnerName}<br/>
                                    <span className="bold">Seller: </span> {auction.sellerName}<br/>
                                    <span className="bold">Ended: </span> {auction.closingTime}<br/>
                                </div>
                                <div className="card-action">
                                    <a href={"/auctions/"+auction.id}>View</a>
                                    <a href="#" data-id={auction.id} onClick={self.approveAuction}>Approve</a>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

            </div>
        )
    }
})
ReactDOM.render(
    <Sales/>,
    document.getElementById('salesTab')
)
