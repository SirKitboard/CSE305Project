if(!window.currentUser) {
    window.location.href = "/"
}
// console.log(window.currentUser);

var AddItem = React.createClass({
    getInitialState: function() {
        return {
            complete : false,
            itemID : null
        }
    },
    componentDidMount: function() {
        // var self = this;
        // $.ajax({
        //     url:'/api/customers/'+window.currentUser.id+'/stats',
        //     success: function(response) {
        //         console.log(response);
        //         _.extend(window.currentUser, response)
        //         self.forceUpdate();
        //     }
        // });
        //
        // $('.modal-trigger').leanModal();
    },
    handleFile : function(e) {
        // console.log(e);
        // console.log(e.nativeEvent.target.files);
    },
    handleUpload : function() {
        var files = ReactDOM.findDOMNode(this.refs.files);
        var formD = new FormData();
        console.log(files.files);
        $.each(files.files, function(key, value) {
            formD.append(key, value);
        });
        console.log(formD);
        var self = this;
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
                self.setState({
                    complete : true
                })
            }
        })
    },
    handleSubmit : function() {
        var files = ReactDOM.findDOMNode(this.refs.files);
        if(files.files.length < 1) return;

        var params = {
            name : ReactDOM.findDOMNode(this.refs.name).value,
            manufactureYear : ReactDOM.findDOMNode(this.refs.manufactureYear).value,
            type : ReactDOM.findDOMNode(this.refs.type).value,
            description : ReactDOM.findDOMNode(this.refs.description).value
        }

        // debugger;

        var self = this;

        $.ajax({
            url : '/api/items',
            method : 'POST',
            data : params,
            success : function(response) {
                self.setState({
                    itemID : response.id
                });
                self.handleUpload()
            }
        })
    },
    render: function() {
        // console.log('render');
        if(this.state.complete) {
            return (
                <div>
                    <h3>Item Added!</h3>
                    <h4><a href="/#modalLogin">Click here to go home and login</a></h4>
                </div>
            )
        }
        return (
            <div>
            <div className="row">
                <div className="input-field col s12">
                    <input ref="name" id="name" type="text" className="validate" length="20"/>
                    <label htmlFor="name">Name</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12 m6">
                    <input ref="type" id="type" type="text" className="validate" length="20"/>
                    <label htmlFor="type">Type</label>
                </div>
                <div className="input-field col s12 m6">
                    <input ref="manufactureYear" id="manufactureYear" type="number" className="validate"/>
                    <label htmlFor="manufactureYear">Manufacture Year</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                  <textarea id="description" ref="description" className="materialize-textarea"></textarea>
                  <label htmlFor="description">Textarea</label>
                </div>
            <div className="file-field input-field">
                  <div className="btn">
                    <span>Images</span>
                    <input onChange={this.handleFile} ref="files" type="file" accept="image/*" multiple/>
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                  </div>
                </div>
            </div>
            <div className="row">
            <button onClick={this.handleSubmit} className="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
                <i className="material-icons right">send</i>
            </button>
            </div>
            </div>
        )

    }
});
var addItem = <AddItem/>
ReactDOM.render(
  addItem,
  document.getElementById('addItemContainer')
);
