    var converter = new Showdown.converter();
    var Comment = React.createClass({
        render: function() {
            var rawMarkup = converter.makeHtml(this.props.children.toString());
            return(
                <div className="comment">
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    <span dangerouslySetInnerHTML={{__html: rawMarkup }} />
                </div>
            );
        }
    });
    var CommentList = React.createClass({
        render: function() {
            //console.log("CommentList props data: ");
            //console.log(this.props.data);
            var commentNodes = this.props.data.map(function(comment) {
                return(
                    <Comment author={comment.author}>
                        {comment.message}
                    </Comment>
                );
            });
            return(
                <div className="commentList">
                    {commentNodes}
                </div>
            );
        }
    });
    var CommentForm = React.createClass({
        handleSubmit: function(e) {
            var author = this.refs.author.getDOMNode().value.trim();
            var message = this.refs.message.getDOMNode().value.trim();
            if(!author || !message) {
                e.preventDefault();
            }
            
            this.props.onCommentSubmit({author: author, message: message});
            this.refs.author.getDOMNode().value = '';
            this.refs.message.getDOMNode().value = '';    
            
            e.preventDefault();
        },
        render: function() {
            return(
                <form className="commentForm" onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Your Name" ref="author" />
                    <input type="text" placeholder="Say something..." ref="message" />
                    <input type="submit" value="Post" />
                </form>
            );
        }
    });
    var CommentsSystem = React.createClass({
        commentXhr: null,
        loadCommentsFromServer: function() {
            this.commentXhr = $.ajax({
                url: this.props.url,
                type: 'POST',
                dataType: 'json',
                // You would remove the data and POST part but we are in jsFiddle
                data: {},
                success: function(data) {
                    //console.log('loadCommentsFromServer success');
                    //console.log(data);
                    this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        handleCommentSubmit: function(comment) {
            // Push the new comment to DOM right away
            var comments = this.state.data;
            var newComments = comments.concat([comment]);
            
            // Cancel the old request to the server
            this.commentXhr.abort();
            
            //console.log("New Comments: ");
            //console.log(newComments);
            this.setState({data: newComments});
            // We do this only in this jsFiddle so it doesn't disappear after the first interval and we regernate
            commentData.push(comment);
    
            // Then save it off to the server
            $.ajax({
                url: this.props.url,
                type: 'POST',
                dataType: 'json',
                data: comment,
                success: function(data) {
                    // Yay, we submitted data
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
    
        getInitialState: function() {
            return { 
                data: []
            };
        },
        componentDidMount: function() {
            this.loadCommentsFromServer();
        },
        render: function() {
            return(
                <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList data={this.state.data} />
                    <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
                </div>
                
            );
        }
    });
    
    React.renderComponent(
        <CommentsSystem url="/comments_source/" />,
        document.getElementById('comments')
    );