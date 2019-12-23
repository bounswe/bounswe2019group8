import React, { Component } from 'react';
import { ListGroupItem, Button } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import axios from  "axios";
import ArticleCommentHolder2 from '../article_components/articleCommentHolder2';
import ParityMakeComment from '../article_components/parity_make_comment';
import { Line } from "react-chartjs-2";

class TradingEquipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equipments: [],
      sym: this.props.match.params.sym,
      comments: [],
    };

    this.onCommentSubmit = this.onCommentSubmit.bind(this);
  }

  onCommentSubmit(comment) {
    this.setState({ comments: [...this.state.comments, comment]});
  }

  getEquipment() {
    return this.state.equipments.find(e => e.sym === this.state.sym);
  }

  handleSymChange(sym) {
    this.setState({sym});
    this.populateComments(sym);
    this.populatePrices(sym);
  }

  renderEquipmentSelection() {
    return (
        <div class="container">

        <div class="row">
          <div class="col">
            <h2 style={{color: "#fff"}}>Trading Equipments</h2>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <select value={this.state.sym} onChange={event => this.handleSymChange(event.target.value)}>
              {this.state.equipments.map(eq => <option value={eq.sym}>{eq.name}</option>)}
            </select>
          </div>

      </div>  </div>
      );
  }

  render() {
    return (
      <div class="container">
      {this.renderEquipmentSelection()}
      {this.state.sym && this.renderSelectedEquipment()}
      </div>
    )
  }

  getFullDate(price) {
    return new Date(`${price.observe_date}T${price.observe_time}`);
  }

  formatDate(date) {
    return `${date.getDay()}/${date.getMonth()}/${date.getYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
  }

  renderGraph(equipment) {
    let prices = this.state.intradailyPrices;

    if (!prices) {
      return;
    }

    prices.sort((p1, p2) => (this.getFullDate(p1) - this.getFullDate(p2)));

    console.log('sorted', prices);

    let data = {
      labels: prices.map(p => this.formatDate(this.getFullDate(p))),
      datasets: [
        {
          fill: false, //works

          lineTension: 0.1, // works
          backgroundColor: "rgb(255,0,0)",
          borderColor: "rgb(75,192,192)", //works
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
          label: equipment.sym,
          data: prices.map((p, i) => ({x: i, y: p.indicative_value}))
        }
      ]
    };

    return (
        <div style={{backgroundColor: "#fff"}}>
      <Line data={data} />
      </div>);
  }

  renderSelectedEquipment() {
    const equipment = this.getEquipment();
    const displayName = equipment ? equipment.name : "";

    return (
        <div class="container">

        <div class="row">
          <div class="col">
            <h2 style={{color: "#fff"}}>{displayName} ({this.state.sym})</h2>
          </div>
        </div>
        <div class="row">
          <div class="col">
            {equipment && this.renderGraph(equipment)}
          </div>
          <div class="col">
            {equipment && <ArticleCommentHolder2 comments={this.state.comments} />}
            {equipment && <ParityMakeComment doubleTap={this.onCommentSubmit} articlePk={equipment.pk} />}
          </div>

        </div>  </div>
      );
  }

  fetchTradingEquipments() {
    return axios.get("/trading_equipments", { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } });
  }

  populateComments(sym) {
    const equipment = this.state.equipments.find(e => e.sym === sym);

    if (!equipment)
      return;

    return axios.get(`/trading_equipments/${equipment.pk}/comments`,
       { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } })
       .then(({data}) => {
         this.setState({ comments: data || [] })
       });
  }

  populatePrices(sym) {
    axios.get(`/trading_equipments/${sym}/prices/daily`,
       { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } })
       .then(({data}) => {
         this.setState({ dailyPrices: data || [] })
       });

     axios.get(`/trading_equipments/${sym}/prices/intradaily`,
        { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } })
        .then(({data}) => {
          this.setState({ intradailyPrices: data || [] })
        });
  }

  componentDidMount() {
    this.fetchTradingEquipments().then(({data}) => {
      this.setState({ equipments: data || [] });
      console.log(this.state);
    }).then(() => this.populateComments(this.state.sym));

    this.populatePrices(this.state.sym);
  }
}

export default withRouter(TradingEquipment);
