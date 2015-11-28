window.ImageScroller = React.createClass({
	getInitialState: function(){
		return {
			currentIndex : 0,
		}
	},

	nextImage: function(){
		this.setState({
			currentIndex: (this.state.currentIndex + 1) % this.props.images.length
		})
	},

	previousImage: function(){
		var nextIndex = this.state.currentIndex -1;
		if(nextIndex < 0) {
			nextIndex = this.props.images.length -1;
		}
		this.setState({
			currentIndex: nextIndex
		})

	},

	render : function(){
		return (
			<div className = "col s12 m4 l3">
				<div className= "row">
				<img className = "col s12" id="thumbnail" src={this.props.images[this.state.currentIndex]}/>
				</div>
				<div className = "row">
				<button onClick = {this.previousImage} className="btn waves-effect waves-light col s6 z-depth-2" type ="bidButton"><i className="material-icons">arrow_back</i></button>
				<button onClick = {this.nextImage} className="btn waves-effect waves-light col s6 z-depth-2" type ="bidButton"><i className="material-icons">arrow_forward</i></button>
				</div>
			</div>


		)
	}
})
