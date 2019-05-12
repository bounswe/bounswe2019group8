import React from 'react';
import CommentsView from '../CommentsView';
import PredictionSummary from '../PredictionSummary';
import PriceSummary from '../PriceSummary';
import "./tr-eq.css";

class TradingEquipment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
        };
    }

    render() {
        const { symbol } = this.props.match.params;

        return (
            <div>
                <div className="symbol-header">{symbol}</div>
                <PriceSummary symbol={symbol} />
                <PredictionSummary symbol={symbol} />
                <CommentsView symbol={symbol} />
            </div>
        )
    }
}

export default TradingEquipment;
