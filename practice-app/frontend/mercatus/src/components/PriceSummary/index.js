import React from 'react';
import axios from 'axios';

class PriceSummary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            price: 0,
        };
    }

    componentDidMount() {
        this.refteshPrice();
    }

    refteshPrice() {
        axios.get(`tr-eqs/${this.props.symbol}/price`).then(res => this.setState({ price: res.data.price }));
    }

    render() {
        return (
            <div style={{ border: "2px solid red", margin: "20px", padding: "5px" }}>
                <b>Price: $</b>{this.state.price}
                <button onClick={() => this.refteshPrice()}>Refresh</button>
            </div>
        )
    }
}

export default PriceSummary;
