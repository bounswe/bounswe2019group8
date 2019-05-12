import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class EqList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            symbols: [],
        };
    }

    componentDidMount() {
        axios.get(`tr-eqs`).then(({data}) => this.setState({ symbols: data }));
    }

    renderList() {
        return (<div>{this.state.symbols.map(s => <div><Link to={`/tr-eqs/${s}`}>{s}</Link></div>)}</div>);
    }

    render() {
        return (
            <div>{this.state.symbols.length ? this.renderList() : 'Loading...'}</div>
        );
    }
}

export default EqList;
