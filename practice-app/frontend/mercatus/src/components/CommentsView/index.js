import React from 'react';
import axios from 'axios';
import './comment.css';

class CommentsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            author: '',
            content: '',
        };

        this.handleCommentAuthorChange = this.handleCommentAuthorChange.bind(this);
        this.handleCommentContentChange = this.handleCommentContentChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    componentDidMount() {
        this.refreshComments();
    }

    renderComment(comment) {
        return (
            <div key={comment.id} className="comment-container">
                <div className="author"><b>{comment.created_at}</b> tarihinde <b>{comment.author}</b> yazdı:</div>
                <div>{comment.content}</div>
            </div>
        )
    }

    refreshComments() {
        axios.get(`tr-eqs/${this.props.symbol}/comments`).then(res => this.setState({ comments: res.data }));
    }

    handleCommentAuthorChange(event) {
        this.setState({author: event.target.value});
    }

    handleCommentContentChange(event) {
        this.setState({content: event.target.value});
    }

    submitComment() {
        const {author, content} = this.state;
        this.setState({author: '', content: ''});

        axios.post(`tr-eqs/${this.props.symbol}/comments`, { author, content }).then(
            () => this.refreshComments()
        );
    }

    render() {
        return (
            <div style={{border: "2px solid red", margin: "20px", padding: "5px"}}>
                <h3>User Comments</h3>
                {this.state.comments.map(comment => this.renderComment(comment))}

                <div style={{border: "2px solid black", margin: "25px"}}>
                    <label>
                        Name:
                        <input type="text" name="name" onChange={this.handleCommentAuthorChange} value={this.state.author} />
                    </label>
                    <br></br>
                    <br></br>
                    <label>
                        Comment:
                        <textarea name="Comment" onChange={this.handleCommentContentChange} value={this.state.content}/>
                    </label>
                    <br></br>
                    <br></br>
                    <button onClick={this.submitComment}>Submit comment</button>
                </div>
            </div>
        )
    }
}

export default CommentsView;
