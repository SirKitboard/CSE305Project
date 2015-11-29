var HotItems = React.createClass({
    getInitialState: function() {
        return {
            auctions : [],
            loading : true,
        }
    },
    componentDidMount: function() {
        var self = this;
        $.ajax({
            url : 'api/auctions/open',
            success: function(response) {
                self.setState({
                    auctions : response,
                    loading : false
                });
                self.fetchThumnails();
            },
            error : function() {
                self.setState({
                    auctions : [],
                })
            }
        })
    },
    fetchThumnails : function() {
        var auctions = this.state.auctions;
        var self = this;
        _.each(auctions, function(auction) {
            $.ajax({
                url : 'api/items/'+auction.itemID+'/thumbnails',
                success :  function(response) {
                    auction.thumbnails = response;
                    self.setState({
                        auctions : auctions
                    })
                }
            })
        });
    },
    render: function() {
        // console.log('render');
        if(this.state.loading) {
            return (
                <div>
                <h5>Loading..</h5>
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
                </div>
            )
        }
        else {
            if(this.state.auctions.length == 0) {
                return (<h3>No Trending Auctions</h3>)
            }
            else {
                return (
                    <div>
                        {
                            _.map(this.state.auctions, function(auction) {
                                var imageURL = "http://placehold.it/300x300"
                                if(auction.thumbnails) {
                                    imageURL = auction.thumbnails[0]
                                }
                                return (
                                    <div className="col s12 m4 l3">
                                    <div className="card small">
                                        <div className="card-image">
                                            <img src={imageURL}/>
                                            <span className="card-title">{auction.name}</span>
                                        </div>
                                        </div>
                                        <div className="card-content">
                                            <p>{auction.description}</p>
                                        </div>
                                        <div className="card-action">
                                            <a href="#">View</a>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        }
    }
});
var hotItems = <HotItems/>
ReactDOM.render(
  hotItems,
  document.getElementById('hotItems')
);
