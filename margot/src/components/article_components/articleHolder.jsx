import React, { Component } from "react";
import ArticleLine from "./articleLine";
import "./articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";

class ArticleHolder extends Component {
  state = {
    articles: [],
    gridOfArticles: []
  };

  render() {
    return (
      <React.Fragment>
       
            <ul className="myUl">
              {console.log("Hello")}
              {this.props.gridOfArticles.forEach(function(line) {
               return( <li>
                <ArticleLine articles={line} />
              </li>)
              
              })}
            </ul>
        
      </React.Fragment>
    );
  }

}

export default ArticleHolder;
