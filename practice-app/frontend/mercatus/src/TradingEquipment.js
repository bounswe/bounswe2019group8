import React from 'react';
import axios from 'axios';

class TradingEquipment extends React.Component {
    getSymbol() {
        return this.props.match.params.symbol;
    }

    componentDidMount() {
        axios.get(`tr-eqs/${this.getSymbol()}/comments`);
    }

    render() {
        console.log(this.props.match.params.symbol)
        return <div/>;
    }
}

export default TradingEquipment;
