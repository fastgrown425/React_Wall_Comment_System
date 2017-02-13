var WallContainer=React.createClass({
   render: function(){
    return(
    <div id="wallContainer">
     <h1>Social Network System with React JS Demo</h1>
     <WallFeed/>
    </div>
    );
   }
});

var WallFeed=React.createClass({
  getInitialState: function(){
    return {data: []};
  },
  updatesFromServer: function()
  {
    var dataPost='';
    var reactThis=this;
    ajaxPostReact('newsFeed.php', dataPost, reactThis, function(data){
      reactThis.setState({data: data.updates});
    });
  },
  updateAjaxSubmit: function(update)
  {
    var reactThis=this;
    ajaxPostReact('updateFeed.php', update , reactThis, function(data){
       var updates = reactThis.state.data;
       var newUpdates = [data.updates[0]].concat(updates);
       reactThis.setState({data: newUpdates});
    });
  },
  deleteUpdate: function(e)
  {
    var updateIndex=e.target.getAttribute('value');
    var update_id=e.target.getAttribute('data');
    var data='updateID='+update_id;
    var reactThis=this;
    ajaxPostReact('deleteUpdate.php', data , reactThis, function(data){
      reactThis.state.data.splice(updateIndex,1);
      reactThis.setState({data: reactThis.state.data});
    });
  },
  componentDidMount: function()
  {
    this.updatesFromServer();
  },
  render: function(){
    return(
        <div>
        <WallForm onUpdateSubmit={this.updateAjaxSubmit}/>
        <WallUpdates data={this.state.data} deleteUpdate={this.deleteUpdate}/>
        </div>
    );
  }
});

var WallForm=React.createClass({
  getInitialState: function(){
    return { user_update: ''};
  },
  componentDidMount: function(){
    ReactDOM.findDOMNode(this.refs.updateInput).focus();
  },
  updateChange: function(e){
    this.setState({user_update: e.target.value });
  },
  updateSubmit: function(e){
    e.preventDefault();
    var user_update= this.state.user_update.trim();
    if(!user_update)
    {
      return;
    }
    else
    {
      this.props.onUpdateSubmit({ user_update: user_update});
      this.setState({  user_update: ''});
    }
  },
  render: function(){
    return(
      <form onSubmit={this.updateSubmit} >
      <textarea ref="updateInput" value={this.state.user_update} onChange={this.updateChange}></textarea>
      <input type='submit' value='Post' id='wallPost'/>
      </form>
    );
  }
});

var WallUpdates=React.createClass({
  textToLinkHTML: function(content){
    var finalContent=textToLink(content);
    return {__html: finalContent}
  },
  render: function(){
    var updatesEach=this.props.data.map(function(update, index)
    {
      return(
        <div className="feedBody" key={update.created}>
        <img src={update.profile_pic} className="feedImg" />
        <div className="feedText">
        <b>{update.name}</b>
        <a href="#" className="feedDelete" value={index} data={update.update_id} onClick={this.props.deleteUpdate} >X</a>
        <span dangerouslySetInnerHTML={this.textToLinkHTML(update.user_update)}  />   
        </div>
        //Comments Block
        </div>
      )
    }, this);
    return(
      <div id="wallFeed">
      {updatesEach}
      </div>
    );
  },
});

ReactDOM.render(
  <WallContainer/>,
  document.getElementById('container')
);