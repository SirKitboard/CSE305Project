var Sales = React.createClass({
    getInitialState : function() {
        return {
            auctions : [],
            openEditModal : false,
            selectedEmployee : null
        }
    },
      componentDidMount : function() {
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
                    return (
                        <div className="col s12 m4 l3">
                            <div className="card">
                                <div className="card-image">
                                    <img src={imageURL}/>
                                    <span className="card-title white-text">{auction.itemName}<br/>{auction.currentBid}</span>
                                </div>
                                <div className="card-content">
                                    <span className="bold">Winner: </span>{auction.winnerName}<br/>
                                    <span className="bold">Seller: </span> {auction.sellerName}<br/>
                                    <span className="bold">Ended: </span> {auction.closingTime}<br/>
                                    
                                    
                                </div>
                                <div className="card-action">
                                    <a href={"/auctions/"+auction.id}>View</a>
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
