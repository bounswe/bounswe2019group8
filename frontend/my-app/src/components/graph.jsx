import { Line } from "react-chartjs-2";
import React, { Component } from "react";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
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
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};
var options = {
  responsive: true,
  datasetStrokeWidth: 3,
  pointDotStrokeWidth: 4,
  scaleLabel: "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>",
  backgroundColor: "red"
};

class Graph extends Component {
  //displayName = "LineExample";

  render() {
    return (
      <div className="col-md-5">
        <h2>Line Example</h2>
        <Line data={data} height={100} options={options} />
      </div>
    );
  }
}
export default Graph;
