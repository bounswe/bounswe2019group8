import React, { Component } from 'react';
import Graph from "./graph";
import axios from "axios";
import "./graphPage.css"
import TradingEqCommentHolder from "./tradingEqCommentHolder";
import ArticleCommentHolder2 from '../article_components/articleCommentHolder2';
import ParityMakeComment from '../article_components/parity_make_comment';
import "../article_components/wholeArticlePage.css";
import { FaHeart } from "react-icons/fa";
import { MdBookmarkBorder } from "react-icons/md";
import { Jumbotron, Badge, Button } from "react-bootstrap";


class GraphPage extends Component {
  state = {
    pk: this.props.pk,
    currentValue: 0,
    secondaryData: [],
    parityName: this.props.firstType.split("_")[0] + "_" + this.props.secondType.split("_")[0],
    labels: [],
    data: [],
    boo: "",
    prices: [],
    dorInt: this.props.rateType
  }

  render() {
    const { data, labels } = this.getDataForGraph();
    console.log('data', data)
    console.log('labels', labels)
    return (
      <div style={{ backgroundColor:'#343a40', paddingLeft:40, paddingRight:40,
       letterSpacing:2, width: '70%', margin: 'auto', marginTop: 20, paddingTop: 30 }}>
        <div style={{
          border:'2px groove black',
          borderRadius:16, paddingBottom: 30,
          backgroundColor: 'whitesmoke', margin: 'auto',
          padding: 15
        }} >
          <div style={{width:'100%'}}>
            <Graph data={data} labels={labels} name={this.state.parityName} currentValue={this.state.currentValue} parityPk={this.state.pk} />
          </div>
        </div>

        <div style={{ background: 'none', borderLeft: 'none', marginTop: 80, width: '60%', paddingBottom: 40, marginTop: 48 }}>
          <div id='commentContainer' style={{ borderLeft: 'none', background: 'none', marginBottom: 16 }}>
            <ArticleCommentHolder2 articlePk={this.state.pk} />
          </div>

        </div>
        <div id='makeCommentContainer' style={{  }} >
            <ParityMakeComment doubleTap={this.props.doubleTap} articlePk={this.state.pk} />
          </div>
      </div>

    );
  }

  getFullDate(price) {
    return new Date(`${price.observe_date}T${price.observe_time}`);
  }

  formatDateTime(date) {
    let copy = new Date(date.getTime());
    copy.setHours(copy.getHours() + 3);
    date = copy;
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
  }

  formatDate(date) {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

  formatPriceDate(price) {
    if (price.interval === 'intraday') {
      console.log(this.getFullDate(price))
      return this.formatDateTime(this.getFullDate(price));
    }

    return this.formatDate(new Date(`${price.observe_date}`));
  }

  getPrices(sym) {
    const priceType = this.props.rateType.split('_')[0];
    const interval = (priceType === 'daily') ? this.props.rateType.split('_')[1] : 'intraday';

    const pricesMap = this.state.prices[sym];

    if (pricesMap)
      return (pricesMap[priceType] || []).filter(p => p.interval === interval);
    else
      return [];
  }

  getDataForGraph() {
    let labels = [], data = [];

    if (this.props.firstType === 'USD_USD') {
      const prices = this.getPrices(this.props.secondType);

      data = prices.map(p => 1 / parseFloat(p.indicative_value));
      labels = prices.map(p => this.formatPriceDate(p));
    } else if (this.props.secondType === 'USD_USD') {
      const prices = this.getPrices(this.props.firstType);

      data = prices.map(p => parseFloat(p.indicative_value));
      labels = prices.map(p => this.formatPriceDate(p));
    } else {
      let leftPrices = this.getPrices(this.props.firstType),
            rightPrices = this.getPrices(this.props.secondType),
            zipped = [];
      const count = Math.min(leftPrices.length, rightPrices.length);

      const priceType = this.props.rateType.split('_')[0];

      if (priceType === 'intradaily') {
        leftPrices = count ? leftPrices.slice(-count) : [];
        rightPrices = count ? rightPrices.slice(-count) : [];

        zipped = leftPrices.map((p, i) => [p, rightPrices[i]]);
      } else {
        for (let i = 0; i < leftPrices.length; ++i) {
          const found = rightPrices.find(p => p.observe_date === leftPrices[i].observe_date);

          if (found) {
            zipped.push([leftPrices[i], found]);
          }
        }
      }

      console.log(zipped);

      data = zipped.map(pricePair => parseFloat(pricePair[0].indicative_value / pricePair[1].indicative_value));
      labels = zipped.map(pricePair => this.formatPriceDate(pricePair[0]));
    }

    if (this.props.graphType !== 'normal') {
      const windowSize = parseInt(this.props.graphType.substring(2));
      let newData = [];

      for (let i = 0; i < data.length; ++i) {
          let sum = 0, c = 0;

          for (let j = Math.max(i - windowSize + 1, 0); j <= i; ++j) {
            sum += data[j];
            c += 1;
          }

          newData.push(sum / c);
      }

      data = newData;
    }

    return { data: data.slice(-30), labels: labels.slice(-30) };
  }

  populatePrices(sym, type, forceRefresh) {
    const priceType = type.split('_')[0];

    if (sym === 'USD_USD')
      return Promise.resolve();

    const pricesForSym = this.state.prices[sym] || {};

    if ((priceType in pricesForSym) && !forceRefresh)
      return Promise.resolve();

    return axios.get(`/trading_equipments/${sym}/prices/${priceType}`,
       { headers: { Authorization: `Token ${localStorage.getItem("userToken")}` } })
       .then(({data}) => {
         let fetchedPrices = data || [];

         fetchedPrices.sort((p1, p2) => (this.getFullDate(p1) - this.getFullDate(p2)));

         if (priceType !== 'intradaily')
           fetchedPrices.reverse();

         this.setState({ prices: {...this.state.prices, [sym]: {...pricesForSym, [priceType]: fetchedPrices} } });
     });
  }

  componentDidMount() {
    this.populatePrices(this.props.firstType, this.props.rateType, false).then(() => console.log(this.state));
    this.populatePrices(this.props.secondType, this.props.rateType, false).then(() => console.log(this.state));


    var token = localStorage.getItem("userToken");
    var current1 = 0
    var current2 = 0
    axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.secondType + "/prices/current", {
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      current1 = parseFloat(res.data.indicative_value)
      console.log(current1)
      axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.firstType + "/prices/current", {
        headers: { Authorization: `Token ${token}` }
      }).then(res => {
        current2 = parseFloat(res.data.indicative_value)
        console.log(current2)
        this.setState({ currentValue: current2 / current1 })
      });
    });
  }

  refreshPage = () => {
    setTimeout(function () { this.state.boo = 'foo'; this.forceUpdate() }.bind(this), 10000);
  }
}

export default GraphPage;
