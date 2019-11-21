import { Line } from "react-chartjs-2";
import React, { Component } from "react";
import { Badge } from "react-bootstrap";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "USD/EUR",
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
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

class Graph extends Component {
  //displayName = "LineExample";

  render() {
    return (
      <div className="col-md-6">
        <Badge>USD/EUR</Badge>
        <Line data={data} height={150} />
      </div>
    );
  }
}
export default Graph;
