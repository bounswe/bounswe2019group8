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
        state={
            pk:this.props.pk,
            currentValue: 0,
            parityName: "",
            labels: [],
            data: [],
            boo:"" 
          }

    render() { 
        return ( 
          <div style={{ width: '90%', margin: 'auto', paddingLeft: 100, paddingRight: 100, paddingTop: 30 }}>
          <div  style={{ width: '120%',height: "120%", marginLeft: -100  }} >
            <Graph data={this.state.data} labels={this.state.labels} name={this.state.parityName} currentValue={this.state.currentValue}/>
          </div>
          <div id="commentContainer" style={{ width: '860px',height: "480px", marginLeft:-90, marginTop: -455,  backgroundColor: 'rgb(237, 245, 255)'}}>
          </div>

          <div style={{ width: '45%', float: 'right',marginTop: -480 }}>
            <div id='commentContainer' style={{ backgroundColor: 'rgb(208, 217, 223)', overflow: 'scroll', maxHeight: 480, marginBottom: 16 }}>
              <ArticleCommentHolder2 articlePk={this.state.pk} />
            </div>
            <div id='makeCommentContainer' style={{ float:'left' }} >
              <ParityMakeComment doubleTap={this.props.doubleTap}  articlePk={this.state.pk} />
            </div>
          </div>
        </div>
           
         );
        }
    componentWillMount(){
            var token = localStorage.getItem("userToken");
            axios.get("http://8.209.81.242:8000/trading_equipments/" + this.state.pk + "/parities", {
              headers: { Authorization: `Token ${token}` }
            }).then(res => {
              var currentValue = res.data[0].close;
              this.setState({currentValue: currentValue});
              var parityData = res.data.reverse();
              
              this.setState({parityData: parityData});
              var labels = [];
              var data = [];
              var myLabel = "";
              for(var i = 0; i < parityData.length; i++){
                  myLabel = parityData[i].observed_at[0] + 
                  parityData[i].observed_at[1] + 
                  parityData[i].observed_at[2] + 
                  parityData[i].observed_at[3] + 
                  parityData[i].observed_at[4] + 
                  parityData[i].observed_at[5] +
                  parityData[i].observed_at[6] +
                  parityData[i].observed_at[7] +
                  parityData[i].observed_at[8] + 
                  parityData[i].observed_at[9];
                labels.push(myLabel);
                data.push(parityData[i].close);
              }
              this.setState({labels: labels});
              this.setState({data: data});
            });
            axios.get("http://8.209.81.242:8000/trading_equipments/" + this.state.pk, {
              headers: { Authorization: `Token ${token}` }
            }).then(res => {
              this.setState({parityName: res.data.name});
            });
            
    }
    refreshPage = () =>{
      setTimeout(function(){ this.state.boo = 'foo'; this.forceUpdate() }.bind(this), 10000);
    }
}
 
export default GraphPage;