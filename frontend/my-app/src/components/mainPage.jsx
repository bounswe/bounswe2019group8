import React, { Component } from "react";
import Chart2 from "./chart2";
import Chart from "./chart";
import "./mainPage.css";
class MainPage extends Component {
  state = {};
  render() {
    return (
      <div>
        <Chart2 class="myChart" />
      </div>
    );
  }
}

export default MainPage;
