import React, { Component } from 'react';

import Toolbar from './components/Toolbar/Toolbar';
import Table from './components/Table/Table';


class App extends Component {
  render()
    {
        return (
            <div className="App">
                <Toolbar/>
                <Table/>
            </div>
        );
    }
}

export default App;
