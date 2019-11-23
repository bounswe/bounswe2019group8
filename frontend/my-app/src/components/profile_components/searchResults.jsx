import React, { Component } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import {withRouter} from "react-router-dom";

class SearchResults extends Component {
  state = {
    api: axios.create({
        baseURL: "http://8.209.81.242:8000/"
      }),
      followings:[]
  };

  componentDidMount(){
    var tempList =[];
    this.state.api
      .post(
        "user_searches",
        {
          search_text: this.props.match.params.search
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userToken")}`
          }
        }
      )
      .then(response => {
        
        response.data.forEach((element)=>{
            tempList.push(element)
          });
         this.setState({followings:tempList})
     
        
       });
  }
  render() {
    console.log("i get clalled")
    return(
    <React.Fragment>
       <Card style={{ width: "36rem", align: "center" }}>
       {console.log(this.state.followings)}
          <ListGroup className="list-group-flush">
          <ListGroup.Item>
             Results :
              <ListGroup className="list-group-flush">
                {this.state.followings.map((f, i) => (
                   <ListGroup.Item action href ={"/profile/"+f.pk}>
                      {i + 1} - {`${f.first_name} ${f.last_name}`}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </ListGroup.Item>     
          </ListGroup>
       
        </Card>
    </React.Fragment>
    )
  }

}
export default withRouter(SearchResults);
