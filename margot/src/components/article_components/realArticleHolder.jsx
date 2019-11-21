import React, { Component } from "react";
import ArticleLine from "./articleLine";
import "./articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import ArticleHolder from "./articleHolder";

class RealArticleHolder extends Component {
  state = {
    articles: [],
    gridOfArticles: []
  };
  componentDidMount() {
    var token = localStorage.getItem("userToken");
    var tempList =[];
    console.log(token);
    axios
      .get("http://8.209.81.242:8000/articles", {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({ articles: res.data });
        console.log(this.state.articles);
        console.log("hi");
        var count = -1;
        for (var i = 0; i < this.state.articles.length; i++) {
          if (count < i / 5) {
            tempList.push([]);
            count += 1;
          }
          for (var j = 0; j < 5; j++) {
            if (5 * i + j < this.state.articles.length) {
              tempList[count].push(
                this.state.articles[5 * i + j]
              );
            }
            if (5 * i + j === this.state.articles.length) {
              break;
            }
          }
          if (5 * i + j === this.state.articles.length) {
            break;
          }
        }
        this.setState({gridOfArticles:tempList})
        console.log(this.state.gridOfArticles)
    });
    //const listItems = this.state.gridOfArticles.map(line => <li>{line}</li>);
  }
  render() {
    if(this.state.gridOfArticles.length>0){
        return (
            <React.Fragment>
               <Button className="write-article" >
                  Write an article
                </Button>
               {console.log("sa")}
               <ArticleHolder articles={this.state.articles} gridOfArticles={this.state.gridOfArticles}/>
               
            </React.Fragment>
          );
    }
    else{
        return(<React.Fragment/>)
    }
  }

}

export default RealArticleHolder;
