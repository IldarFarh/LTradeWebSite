import React from 'react';

class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
    handleChange() {
    this.props.onUserInput(
      this.filterTextInput.value
    );
  }
	render() {
		return(
			<div className="form-group">
				<div className="input-group">
					<input type="text" className="form-control" ref={(input) => this.filterTextInput = input} value={this.props.filterText} onChange={this.handleChange} placeholder="Поиск.." />
					<span className="input-group-btn">
			      <button className="btn btn-default" type="button"><i className="fa fa-search"></i></button>
		    	</span>
				</div>
			</div>
	)}
};

export default Searchbar;