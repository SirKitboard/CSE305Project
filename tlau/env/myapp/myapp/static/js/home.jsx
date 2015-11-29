var HotItems = React.createClass({
    getInitialState: function() {
        return {
            hotItems : [],
            suggestedItems : [],
            loading : 0,
        }
    },
    componentDidMount: function() {
        var self = this;
        $.ajax({
            url : 'api/items/hot',
            success: function(response) {
                self.setState({
                    hotItems : response,
                    loading : self.state.loading+1
                });
            },
            error : function() {
                console.log('ERRRROR')
                self.setState({
                    hotItems : [],
                    loading : self.state.loading+1
                })
            }
        });
        $.ajax({
            url : 'api/items/suggestions',
            success: function(response) {
                self.setState({
                    suggestedItems : response,
                    loading : self.state.loading + 1
                });
                self.fetchThumnails();
            },
            error : function() {
                console.log('ERRRROR')
                self.setState({
                    suggestedItems : [],
                    loading : self.state.loading + 1
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
        console.log(this.state.loading)
        if(this.state.loading < 1) {
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
            var suggestedItems = <h5>Search for items to get better suggestions!</h5>
            var hotItems = <h5>No hot items :(</h5>;
            if(this.state.suggestedItems.length > 0) {
                suggestedItems = _.map(this.state.suggestedItems, function(item) {
                    var imageURL = "http://placehold.it/300x300"
                    if(item.images.length > 0) {
                        imageURL = item.images[0]
                    }
                    return (
                        <div className="col s12 m4 l2">
                        <div className="card small">
                            <div className="card-image">
                                <img src={imageURL}/>
                                <span className="card-title">{item.name}</span>
                            </div>
                            <div className="card-content">
                                <p>{item.description}</p>
                            </div>
                            <div className="card-action">
                                <a href="#">View</a>
                            </div>
                        </div>
                        </div>
                    )
                })
            }
            if(this.state.hotItems.length > 0) {
                hotItems = _.map(this.state.hotItems, function(item) {
                    var imageURL = "http://placehold.it/300x300"
                    if(item.images.length > 0) {
                        imageURL = item.images[0]
                    }
                    var link = "/item/"+item.id;
                    return (
                        <div className="col s12 m4 l2">
                        <div className="card small">
                            <div className="card-image">
                                <img src={imageURL}/>
                                <span className="card-title">{item.name}</span>
                            </div>
                            <div className="card-content">
                                <p>{item.description}</p>
                            </div>
                            <div className="card-action">
                                <a href={link}>View</a>
                            </div>
                        </div>
                        </div>
                    )
                })
            }
            return (
                <div>
                    <div className="row">
                        <div className="col s12">
                            <h3>Hot Items</h3>
                                <div className="row">
                                {hotItems}
                                </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <h3>Suggested Items</h3>
                            {suggestedItems}
                        </div>
                    </div>
                </div>
            )
        }
    }
});
var hotItems = <HotItems/>
ReactDOM.render(
  hotItems,
  document.getElementById('hotItems')
);
