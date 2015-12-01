if(!window.currentUser) {
    window.location.href = "/"
}

var ItemPicker = React.createClass({
    getInitialState : function() {
        return {
            filteredItems : [],
            allItems : [],
            picked : null,
            loading : true
        }
    },
    componentDidMount : function() {
        var self = this;
        $.ajax({
            url : '/api/items',
            method : 'GET',
            success : function(response) {
                self.setState({
                    allItems : response,
                    filteredItems : response
                });
            }
        })
    },
    pickItem : function(e) {
        // console.log(e.nativeEvent);
        // console.log(e.target);
        // debugger;
        var target = e.target;
        if(e.target.tagName == "TD") {
            target = target.parentElement;
        }
        var itemID = target.getAttribute('data-id');
        this.setState({
            picked : _.find(this.state.allItems, function(item) {
                return item.id == itemID
            })
        })
    },
    submit : function() {
        if(this.state.picked) {
            this.props.onSubmit(this.state.picked);
        } else {
            this.props.onClose();
        }

    },
    close : function() {
        this.props.onClose()
    },
    filterItems : function(e) {
        var value = e.target.value.toLowerCase();
        if(value == "") {
            this.setState({
                filteredItems : this.state.allItems
            })
        } else {
            this.setState({
                filteredItems : _.filter(this.state.allItems, function(item) {
                    return item.name.toLowerCase().indexOf(value) > -1
                })
            });
        }
    },
    render : function() {
        var self = this;
        var tableBody = <tr><td colSpan="4">No items to display :( </td></tr>
        if(this.state.filteredItems.length > 0) {
            tableBody = _.map(this.state.filteredItems, function(item) {
                var image = <img className="circle responsive-img" src="http://placehold.it/100x100"/>
                if(item.images.length > 0) {
                    image = <img  style={{width:'100px', height:'100px'}} src={item.images[0]} alt="" className="circle responsive-img"/>
                }
                var classes = "";
                if(self.state.picked && item.id == self.state.picked.id) {
                    classes = "selected";
                }
                return (
                    <tr onClick={self.pickItem} data-id={item.id} className={classes}>
                      <td>{image}</td>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.manufactureYear}</td>
                    </tr>
                )
            });
        }
        return (
            <div>
                <div className="modal-content">
                <div className="row">
                    <div className="input-field col s12 offset-m6 m6">
                        <input onChange={this.filterItems} ref="search" id="search" type="text" className="validate"/>
                        <label htmlFor="search">Search..</label>
                    </div>
                </div>
                <table className="striped">
                    <thead>
                      <tr>
                          <th data-field="image">Image</th>
                          <th data-field="name">Item Name</th>
                          <th data-field="type">Type</th>
                          <th data-field="manufactureYear">Manufacture Year</th>
                      </tr>
                    </thead>

                    <tbody>
                        {tableBody}
                    </tbody>
              </table>
              </div>
              <div className="modal-footer">
                <button style={{margin:'0 3px'}} onClick={this.close} className="btn waves-effect waves-light" type="submit" name="action">
                  Close
                </button>
                <button style={{margin:'0 3px'}} onClick={this.submit} className="btn waves-effect waves-light" type="submit" name="action">Submit
                  <i className="material-icons right">send</i>
                </button>
              </div>
            </div>
        )
    }
});

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
                })
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
		 	hour12: false,
		};


        var params = {
            itemID : this.state.itemPicked.id,
            sellerID : window.currentUser.id,
            closingTime : this.formatDate(dateString),
            openingBid : ReactDOM.findDOMNode(this.refs.openingBid).value,
            reserve : ReactDOM.findDOMNode(this.refs.reserve).value,
            increment : ReactDOM.findDOMNode(this.refs.increment).value,
        }

        debugger;

        var self = this;

        $.ajax({
            url : '/api/auctions',
            method : 'POST',
            data : params,
            success : function(response) {
                self.setState({
                    itemID : response.id
                });
                // self.handleUpload()
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
              <div className="row valign-wrapper">
                <div className="col s2">
                  <img src="http://placehold.it/100x100" alt="" className="circle responsive-img"/>
                </div>
                <div className="col s10">
                  <span className="black-text">
                    Click here to choose item
                  </span>
                </div>
              </div>
            </div>
        )
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
            </div>)
        }
        return (
            <div>
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
                    <button onClick={this.handleSubmit} className="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
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
