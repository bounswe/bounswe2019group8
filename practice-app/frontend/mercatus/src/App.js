import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import TradingEquipment from './TradingEquipment';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:5000';

function App() {
    return (
        <Router>
            <div>
            <nav>
                <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about/">About</Link>
                </li>
                <li>
                    <Link to="/users/">Users</Link>
                </li>
                </ul>
            </nav>

            <Route path="/tr-eqs/:symbol" component={TradingEquipment} />
            </div>
        </Router>
        );
}

export default App;
