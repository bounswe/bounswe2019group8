import axios from "axios";
import React, { Component } from "react";
import ArticleHolder from "./articleHolder"

class MainArticleHolder extends Component {
    state = {  
        articles: [],
        gridOfArticles: [] 
    }
    render() { 
        return ( 
            <ArticleHolder articles></ArticleHolder>
         );
    }
    componentDidMount(){
        console.log("Efe");
        var token = localStorage.getItem("userToken");
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
                this.state.gridOfArticles.push([]);
                count += 1;
              }
              for (var j = 0; j < 5; j++) {
                if (i + j < this.state.articles.length) {
                  this.state.gridOfArticles[count].push(this.state.articles[i + j]);
                }
                if (i + j == this.state.articles.length) {
                  break;
                }
              }
              if (i + j == this.state.articles.length) {
                break;
              }
            }
            console.log(this.state.gridOfArticles);
          });
        //const listItems = this.state.gridOfArticles.map(line => <li>{line}</li>);
      }
    }
}
 
export default MainArticleHolder;