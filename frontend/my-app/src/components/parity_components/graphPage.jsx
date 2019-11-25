import React, { Component } from 'react';
import Graph from "./graph";
import axios from "axios";
import "./graphPage.css"
import TradingEqCommentHolder from "./tradingEqCommentHolder";

class GraphPage extends Component { 
        state={
            pk:this.props.match.params.pk,
            currentValue: 0,
            parityName: "",
            labels: [],
            data: [] 
          }

    render() { 
        return ( 
            <div className="my-parity-container">
              <div className="my-div">
                <Graph data={this.state.data} labels={this.state.labels} name={this.state.parityName}/>
                <div class="vl"></div>
                <TradingEqCommentHolder currentValue={this.state.currentValue}  pk={this.state.pk}/>
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
}
 
export default GraphPage;