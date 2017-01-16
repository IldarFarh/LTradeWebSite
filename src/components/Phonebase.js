import React from 'react';

class DirectoryContainer extends React.Component {
  render() {
    return (
    	<div hidden={this.props.people.length==0}>
	    <div className="panel panel-default">
		  <div className="panel-heading">
		    <p className="panel-title">
				<a data-toggle="collapse" data-parent="#accordion" href={"#phonebase" + this.props._id}>
					{this.props.title}<span className="label label-default float-right">{this.props.people.length}</span></a>
		  		</p>
			  </div>
				<div id={"phonebase" + this.props._id} className={(this.props.filterText != "")?"panel-collapse collapse in":"panel-collapse collapse"}>
			  	<div className="panel-body">
						<ul className="list-group">
							{this.props.people.map(pip => 
								<li key={pip._id} className="list-group-item">
									<a href="#" type="button" data-toggle="modal" data-target={"#phoneModal" + pip._id}>{pip.name}</a>
								</li>
							)}
						</ul>
			    </div>
			  </div>
		</div>
		<div className="container">
			{this.props.people.map(pip => 
				<div key={"modal" + pip._id} className="modal fade" id={"phoneModal" + pip._id} role="dialog">
			    <div className="modal-dialog">
			    
				  <div className="modal-content">
			        <div className="modal-header">
			          <button type="button" className="close" data-dismiss="modal">&times;</button>
			          <h4 className="modal-title">{pip.name}</h4>
			        </div>
			        <div className="modal-body">
						<p><span className="fa fa-briefcase"></span> {pip.post}</p>
						<p><span className="fa fa-phone"></span> {pip.phone}</p>
						<p><span className="fa fa-envelope-o"></span><a href={"mailto:" + pip.email} target="_top"> {pip.email}</a></p>
			          	<p><span className="fa fa-mobile"></span> {pip.mobphone}</p>
			          	<p><span className="fa fa-birthday-cake"></span> {pip.datebirth}</p>
			        </div>
			        <div className="modal-footer">
			          <button type="button" className="btn btn-default" data-dismiss="modal">Закрыть</button> 
			        </div>
			      </div>
			      
			    </div>
			  </div>
			)}
		</div>
		</div>		
    );
  }
}

class Phonebase extends React.Component {
	render() {
		return(
			<div className="panel-group" id="accordion">
				{this.props.directoryList.map(dir => 
					<DirectoryContainer key={dir._id} {...dir} filterText={this.props.filterText}/> 
				)}
			</div>
	)}
};

Phonebase.propTypes = {
	directoryList: React.PropTypes.array
}

export default Phonebase;