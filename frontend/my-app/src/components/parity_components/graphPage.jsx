import React, { Component } from 'react';
import Graph from "./graph";
import axios from "axios";
class GraphPage extends Component { 
        state={
            pk:this.props.match.params.pk,
            parityData: [],
            labels: [],
            data: [] 
          }

    render() { 
        return ( 
            <div>
                <Graph data={this.state.data} labels={this.state.labels}/>
            </div>
         );
        }
    componentWillMount(){
            var token = localStorage.getItem("userToken");
            axios.get("http://8.209.81.242:8000/trading_equipments/" + this.state.pk + "/parities", {
              headers: { Authorization: `Token ${token}` }
            }).then(res => {
              var parityData = res.data;
              this.setState({parityData: parityData});
              var labels = [];
              var data = [];
              for(var i = 0; i < parityData.length; i++){
                labels.push(parityData[i].observed_at);
                data.push(parityData[i].close);
              }
              this.setState({labels: labels});
              this.setState({data: data});
            });
            
    }
}
 
export default GraphPage;