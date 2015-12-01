window.ItemPicker = React.createClass({
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
