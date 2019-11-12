import React, { Component } from "react";
import { createChart } from "lightweight-charts";

class Chart extends Component {
  constructor(props) {
    super(props);
    const chart = createChart(document.body, { width: 400, height: 300 });
    const lineSeries = chart.addLineSeries();
    const jsonList = [
      { time: "2019-04-11", value: 80.01 },
      { time: "2019-04-12", value: 96.63 },
      { time: "2019-04-13", value: 76.64 },
      { time: "2019-04-14", value: 81.89 },
      { time: "2019-04-15", value: 74.43 },
      { time: "2019-04-16", value: 80.01 },
      { time: "2019-04-17", value: 96.63 },
      { time: "2019-04-18", value: 76.64 },
      { time: "2019-04-19", value: 81.89 },
      { time: "2019-04-20", value: 74.43 }
    ];
    console.log("here is the chart:");
    chart.applyOptions({
      priceScale: {
        position: "right",
        mode: 2,
        autoScale: false,
        invertScale: false,
        alignLabels: true,
        borderVisible: false,
        borderColor: "#555ffd",
        scaleMargins: {
          top: 0.3,
          bottom: 0.25
        }
      },
      layout: {
        backgroundColor: "#FAEBD7",
        textColor: "#696969",
        fontSize: 12,
        fontFamily: "times"
      },
      watermark: {
        color: "rgba(11, 94, 29, 0.4)",
        visible: true,
        text: "USD/GBP",
        fontSize: 24,
        horzAlign: "left",
        vertAlign: "bottom"
      },
      grid: {
        vertLines: {
          color: "rgba(70, 130, 180, 0.5)",
          style: 1,
          visible: true
        },
        horzLines: {
          color: "rgba(70, 130, 180, 0.5)",
          style: 1,
          visible: true
        }
      }
    });
    lineSeries.setData(jsonList);
  }
  componentDidMount() {}

  state = {};

  render() {
    return <div></div>;
  }
}

export default Chart;
