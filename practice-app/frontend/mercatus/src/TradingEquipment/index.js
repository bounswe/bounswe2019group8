import React from 'react';
import axios from 'axios';
import './comment.css';

class TradingEquipment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
        };
    }

    getSymbol() {
        return this.props.match.params.symbol;
    }

    componentDidMount() {
        axios.get(`tr-eqs/${this.getSymbol()}/comments`).then(res => this.setState({ comments: res.data }));
    }

    renderComment(comment) {
        return (
            <div key={comment.id} className="comment-container">
                <div className="author"><b>{comment.author}</b> yazdı:</div>
                <div>{comment.content}</div>
            </div>)
    }

    render() {
        console.log(this.state);
        return (
            <div>
                {this.state.comments.map(comment => this.renderComment(comment))}
            </div>
        )
    }
}

export default TradingEquipment;
