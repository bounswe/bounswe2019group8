import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import TradingEquipment from './components/TradingEquipment';
import EqList from './components/EqList';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.post['Content-Type'] = 'text/json';

function App() {
    return (
        <Router>
            <div>
            <nav className="navigation-bar">
                Navigation:
                <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/list/">List of Equipments</Link>
                </li>
                </ul>
            </nav>

            <Route path="/tr-eqs/:symbol" component={TradingEquipment} />
            <Route path="/list" component={EqList} />
            </div>
        </Router>
        );
}

export default App;
