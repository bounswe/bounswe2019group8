import { Line } from "react-chartjs-2";
import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import "./graph.css";

class Graph extends Component {
  //displayName = "LineExample";
  state = {
    myLabes: null,
    myData: null,
  }
  render() {
    let data = {
      labels: this.props.labels,
      datasets: [
        {
          label: this.props.name,
          fill: false, //works
          width: "10",
          height: "5",
          lineTension: 0.1, // works
          backgroundColor: "red",
          borderColor: "rgba(75,192,192,1)", //works
          borderCapStyle: "butt", //dunno
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)", //works
          pointBackgroundColor: "#fff", //works
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#E4B8B8",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.props.data
        }
      ]
    };
    return (
      <div className="col-md-6">
        <Badge className="graph-badge">{this.props.name}</Badge>
        <Badge className="graph-badge">Current Value :{this.props.currentValue}</Badge>
        <Line data={data} height={150} />
      </div>
    );
  }

  componentWillMount(){
    
  }
}
export default Graph;
