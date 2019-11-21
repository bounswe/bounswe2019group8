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
        {this.componentDidMount}
        <div>
          <Button className="write-article" onClick={this.postArticle}>
            Write an article
          </Button>
          {console.log(this.state.gridOfArticles)}
          <div>
            <ul className="myUl">
              {console.log("Hello")}
              {this.state.gridOfArticles.map(line => (
                <li>
                  <ArticleLine articles={line} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
  componentDidMount() {
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
        console.log("olm");
        console.log(this.state.gridOfArticles);
      });
    //const listItems = this.state.gridOfArticles.map(line => <li>{line}</li>);
  }
}

export default ArticleHolder;
