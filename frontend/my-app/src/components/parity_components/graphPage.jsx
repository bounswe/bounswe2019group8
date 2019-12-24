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
            secondaryData:[],
            parityName: this.props.firstType.split("_")[0]+"_"+this.props.secondType.split("_")[0],
            labels: [],
            data: [],
            boo:"",
            dorInt : this.props.rateType 
          }

    render() { 
        return ( 
          <div style={{ width: '90%', margin: 'auto', paddingLeft: 100, paddingRight: 100, paddingTop: 30 }}>
          <div  style={{ width: '120%',height: "120%", marginLeft: -100  }} >
            <Graph data={this.state.data} labels={this.state.labels} name={this.state.parityName} currentValue={this.state.currentValue} parityPk={this.state.pk}/>
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
        
        initial = () =>{
          var token = localStorage.getItem("userToken");
            
            
        }
        componentDidMount(){ 
          var token = localStorage.getItem("userToken");
          var current1=0
          var current2=0  
          axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.secondType + "/prices/current", {
            headers: { Authorization: `Token ${token}` }
          }).then(res => {
            current1= parseFloat(res.data.indicative_value)
            console.log(current1)
            axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.firstType + "/prices/current", {
            headers: { Authorization: `Token ${token}` }
          }).then(res => {
            current2 = parseFloat(res.data.indicative_value)
            console.log(current2)
            this.setState({currentValue:current2/current1})
          });
          });
          
         
          if(this.state.dorInt === "daily"){
            var token = localStorage.getItem("userToken");
            axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.secondType + "/prices/daily", {
              headers: { Authorization: `Token ${token}` }
            }).then(res => {
              this.setState({secondaryData:res.data.reverse()})
              axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.firstType + "/prices/daily", {
              headers: { Authorization: `Token ${token}` }
            }).then(res => {
              var parityData = res.data.reverse();
              this.setState({parityData: parityData});
              var labels = [];
              var data = [];
              var myLabel = "";
              var myLength=0
              if(this.props.firstType === "USD_USD"){
                parityData = this.state.secondaryData
                for(var i = 0; i < parityData.length; i++){
                  myLabel = parityData[i].observe_date[0] + 
                  parityData[i].observe_date[1] + 
                  parityData[i].observe_date[2] + 
                  parityData[i].observe_date[3] + 
                  parityData[i].observe_date[4] + 
                  parityData[i].observe_date[5] +
                  parityData[i].observe_date[6] +
                  parityData[i].observe_date[7] +
                  parityData[i].observe_date[8] + 
                  parityData[i].observe_date[9];
                labels.push(myLabel);
                if(this.props.secondType === "USD_USD"){
                  data.push(1);
                }           
                else{
                    data.push(1/parityData[i].indicative_value)
                  }
              }
              }
              else{
                for(var i = 0; i < parityData.length; i++){
                  myLabel = parityData[i].observe_date[0] + 
                  parityData[i].observe_date[1] + 
                  parityData[i].observe_date[2] + 
                  parityData[i].observe_date[3] + 
                  parityData[i].observe_date[4] + 
                  parityData[i].observe_date[5] +
                  parityData[i].observe_date[6] +
                  parityData[i].observe_date[7] +
                  parityData[i].observe_date[8] + 
                  parityData[i].observe_date[9];
                labels.push(myLabel);
                if(this.props.secondType === "USD_USD"){
                  data.push(parityData[i].indicative_value);
                }
                else{
                  if(typeof this.state.secondaryData[i]!== "undefined"){
                    data.push(parityData[i].indicative_value/ this.state.secondaryData[i].indicative_value)
                  }
                  else{
                    labels.pop()
                  }
                  }
                
              }
              }

              this.setState({labels: labels, data: data});
            
            });
            });

            
        }
        if(this.state.dorInt === "intradaily"){
          var token = localStorage.getItem("userToken");
          axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.secondType + "/prices/intradaily", {
            headers: { Authorization: `Token ${token}` }
          }).then(res => {
            this.setState({secondaryData:res.data})
            axios.get("http://8.209.81.242:8000/trading_equipments/" + this.props.firstType + "/prices/intradaily", {
              headers: { Authorization: `Token ${token}` }
            }).then(res => {
              var parityData = res.data;
           
              this.setState({parityData: parityData});
              var labels = [];
              var data = [];
              var myLabel = "";
              if(this.props.firstType === "USD_USD"){
                parityData = this.state.secondaryData
                for(var i = 0; i < parityData.length; i++){
                  myLabel = parityData[i].observe_time[0] + 
                  parityData[i].observe_time[1] + 
                  parityData[i].observe_time[2] + 
                  parityData[i].observe_time[3] + 
                  parityData[i].observe_time[4] + 
                  parityData[i].observe_time[5] +
                  parityData[i].observe_time[6] +
                  parityData[i].observe_time[7]
                labels.push(myLabel);
                if(this.props.secondType === "USD_USD"){
                  data.push(1);
                }
                else{
                  
                    data.push(1/parityData[i].indicative_value)
                  }
              }
              }
              else{
                for(var i = 0; i < parityData.length; i++){
                  myLabel = parityData[i].observe_time[0] + 
                  parityData[i].observe_time[1] + 
                  parityData[i].observe_time[2] + 
                  parityData[i].observe_time[3] + 
                  parityData[i].observe_time[4] + 
                  parityData[i].observe_time[5] +
                  parityData[i].observe_time[6] +
                  parityData[i].observe_time[7]
                labels.push(myLabel);
                if(this.props.secondType === "USD_USD"){
                  data.push(parityData[i].indicative_value);
                }
           
                else{
                  if(typeof this.state.secondaryData[i]!== "undefined"){
                    data.push(parityData[i].indicative_value/ this.state.secondaryData[i].indicative_value)
                  }
                  else{
                    labels.pop()
                  }
                  }
              }
              }
  
              for(var i =0; i<labels.length;i++){
                for (var j=0; j<labels.length-1;j++){
                  if (labels[j] > labels[j+1]){
                    var x = data[j];
                    var y = labels[j]
                    parityData[j] = parityData[j+1];
                    parityData[j+1] = x;
                    labels[j] = labels[j+1];
                    labels[j+1] = y;
                  }
                }
              }
              this.setState({labels: labels, data: data});
           
            });
          });
         
        }        
            
     
               
    }
    refreshPage = () =>{
      setTimeout(function(){ this.state.boo = 'foo'; this.forceUpdate() }.bind(this), 10000);
    }
}
 
export default GraphPage;