import React from 'react';
import axios from 'axios';

class PredictionSummary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            voted: false,
            upVotes: 0,
            downVotes: 0,
        };
    }

    vote(direction) {
        if (this.state.voted)
            return;

        axios.post(`tr-eqs/${this.props.symbol}/predictions`, { vote: direction }).then(
            ({data}) => {
                this.setState({ upVotes: data.upvote, downVotes: data.downvote, voted: true })
            }
        );

    }

    componentDidMount() {
        axios.get(`tr-eqs/${this.props.symbol}/predictions`).then(({data}) => this.setState({ upVotes: data.upvote, downVotes: data.downvote }));
    }

    render() {
        const { voted, upVotes, downVotes } = this.state;

        return (
            <div style={{border: "2px solid red", margin: "20px", padding: "5px"}}>
                <h3>
                    Predictions:
                </h3>
                <button onClick={() => this.vote(1)} disabled={voted}>
                    INCREASES ({upVotes || 0} votes)
                </button>
                <button onClick={() => this.vote(0)} disabled={voted}>
                    DECREASES ({downVotes || 0} votes)
                </button>
                <h3>
                    Result:
                    {upVotes > downVotes ? 'Increase' : 'Decrease'}
                </h3>
            </div>
        );
    }
}

export default PredictionSummary;
