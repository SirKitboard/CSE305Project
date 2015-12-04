if(!window.currentUser) {
    window.location.href = "/"
}

var CreateAuction = React.createClass({
    getInitialState: function() {
        return {
            complete : false,
            auctionID : null,
            itemPicked : null
        }
    },
    componentDidMount: function() {
        $('.modal-trigger').leanModal();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
    },

    handleUpload : function() {
        var files = ReactDOM.findDOMNode(this.refs.files);
        var formD = new FormData();
        console.log(files.files);
        $.each(files.files, function(key, value) {
            formD.append(key, value);
        });
        console.log(formD);

        $.ajax({
            url : "/api/items/"+this.state.itemID+"/image",
            method : 'POST',
            data : formD,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string
            success : function(response) {
                console.log(response);
                this.setState({
                    complete : true
                });
            }
        })
    },

    formatDate : function(date) {
        date = new Date(date);
        var dformat = [date.getFullYear(),
                       date.getMonth()+1,
                       date.getDate()].join('-')+' '+
                      [date.getHours(),
                       date.getMinutes(),
                       date.getSeconds()].join(':');

        return(dformat)

    },

    handleSubmit : function() {
        // var files = ReactDOM.findDOMNode(this.refs.files);
        // if(files.files.length < 1) return;

        var dateString = ReactDOM.findDOMNode(this.refs.closingTime).value;
        if(this.state.itemPicked == null) return;
        if(new Date() > new Date(dateString)) return;


        var options = {
		 	hour12: false
		};


        var params = {
            itemID : this.state.itemPicked.id,
            sellerID : window.currentUser.id,
            closingTime : this.formatDate(dateString),
            openingBid : ReactDOM.findDOMNode(this.refs.openingBid).value,
            reserve : ReactDOM.findDOMNode(this.refs.reserve).value,
            increment : ReactDOM.findDOMNode(this.refs.increment).value
        };

        var self = this;

        $.ajax({
            url : '/api/auctions',
            method : 'POST',
            data : params,
            success : function(response) {
                self.setState({
                    itemID : response.id
                });
                console.log("auction created");
                ReactDOM.findDOMNode(self.refs.submit).textContent = "Auction Created!";
            }
        })
    },
    setItem : function(item) {
        console.log(item);
        this.setState({
            itemPicked : item
        });
        this.closeItemPicker();
    },
    openItemPicker : function(e) {
        // console.log(e);
        console.log("CLICKED");
        $("#modalItemPicker").openModal();
    },
    closeItemPicker : function() {
        $("#modalItemPicker").closeModal();
    },
    render: function() {
        var selectedItem = (
            <div onClick={this.openItemPicker}className="card-panel grey lighten-5 z-depth-1">
              <div className="valign-wrapper">
                <div className="col s1">
                  <img src="http://placehold.it/100x100" alt="" className="circle responsive-img"/>
                </div>
                <div className="col s10">
                  <span className=" click-here black-text">
                    Click here to choose item
                  </span>
                </div>
              </div>
            </div>
        );
        if(this.state.itemPicked != null) {
            var image = <img src="http://placehold.it/100x100" alt="" className="circle responsive-img"/>
            if(this.state.itemPicked.images.length > 0) {
                image = <img style={{width:'100px', height:'100px'}}  src={this.state.itemPicked.images[0]} alt="" className="circle responsive-img"/>
            }
            selectedItem = (<div className="card-panel grey lighten-5 z-depth-1">
              <div className="row valign-wrapper">
                <div className="col s2">
                  {image}
                </div>
                <div className="col s10">
                  <span className="black-text">
                    {this.state.itemPicked.name}
                  </span>
                </div>
              </div>
            </div>
            )
        }
        return (
            <div className="auction-create">
                <div className="row">
                    {selectedItem}
                </div>
                <div className="row">
                    <div className="input-field col s12 m6">
                        <input type="date" ref="closingTime" id="closingTime" className="datepicker"/>
                        <label htmlFor="closingTime">Closing Time</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12 m4">
                        <input ref="openingBid" id="openingBid" type="number" step="0.01" min="0" className="validate"/>
                        <label htmlFor="openingBid">Opening Bid</label>
                    </div>
                    <div className="input-field col s12 m4">
                        <input id="reserve" ref="reserve" type="number" step="0.01" min="0" className="validate"/>
                        <label htmlFor="reserve">Reserve</label>
                    </div>
                    <div className="input-field col s12 m4">
                        <input id="increment" ref="increment" type="number" step="0.01" min="0" className="validate"/>
                        <label htmlFor="increment">Increment</label>
                    </div>
                </div>
                <div className="row">
                    <button onClick={this.handleSubmit} className="btn waves-effect waves-light"
                            id='login' type="submit" name="action" ref="submit">
                        Submit
                        <i className="material-icons right">send</i>
                    </button>
                </div>
                <div id="modalItemPicker" className="modal modal-fixed-footer">
                    <ItemPicker onClose={this.closeItemPicker} onSubmit={this.setItem}/>
                </div>
            </div>
        )

    }
});
var createAuction = <CreateAuction/>
ReactDOM.render(
  createAuction,
  document.getElementById('createAuctionContainer')
);
// ReactDOM.render(
//     ,
//     document.getElementById('modalItemPicker')
// )
