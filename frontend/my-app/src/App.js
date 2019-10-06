import React from 'react';
import './App.css';
import Login from "./containers/Login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function App() {
  return (
      <Router>
          <Route path="/login" exact component={Login} />
      </Router>

  );
}

export default App;
