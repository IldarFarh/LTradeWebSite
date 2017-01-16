import React from 'react';
import Searchbar from './Searchbar';
import Phonebase from './Phonebase';
import io from 'socket.io-client'

class PhonebaseContainer extends React.Component {
  constructor() {
    super();
    this.state = {
			directoryList: [],
			filterText: ""
		};
		this.handleUserInput = this.handleUserInput.bind(this);
	}

 	componentWillMount() {
        this.socket = io('http://localhost:3000');
	
	       this.socket.on('disconnect', () => {
            this.setState({ 
                title: 'disconnected'
            });
        });

        this.socket.on('getphonebook', x => this.setState(x));
	   }
  
  handleUserInput(filterText) {
    this.setState({
      filterText: filterText
    });
    this.socket.emit("searchBar",filterText);
  }
	render() {
		return (
			<div className="PhonebaseContainer">
				<Searchbar  filterText={this.state.filterText}
          					onUserInput={this.handleUserInput}/>
				<Phonebase directoryList = {this.state.directoryList}
										filterText={this.state.filterText}/>
			</div>
		)}
};

export default PhonebaseContainer;