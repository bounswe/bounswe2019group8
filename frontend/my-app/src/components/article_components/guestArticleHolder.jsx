import React, { Component } from "react";
import ArticleCard from "./articleCard";
import "./articleHolder.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Tabs, Tab } from "react-bootstrap";
import WriteArticlePage from './writeArticlePage'
import { FaFeatherAlt} from "react-icons/fa";
import {TiThMenuOutline} from "react-icons/ti";

class ArticleHolder extends Component {
  state = {
    finalList: [],
    articles: [],
    gridOfArticles: [],
    count: 0
  };
  render() {
    return (
      <React.Fragment>
        <Tabs defaultActiveKey="articles" style={{fontWeight:'lighter', 
          justifyContent: 'center', 
          backgroundColor:'whitesmoke' }}>
          <Tab eventKey="articles" title={<div><TiThMenuOutline></TiThMenuOutline> Articles List</div>}>
            <div className="container" style={{marginTop:8}}>
              <div className="article-card-container">{this.state.finalList}</div>
            </div>
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
  componentWillMount() {
    axios
      .get("http://8.209.81.242:8000/articles").then(res => {
        var articleList2 = res.data;
        localStorage.setItem("articleList", JSON.stringify(articleList2));
        let articleList = JSON.parse(localStorage.getItem("articleList"));

        let finalList = [];

        for (var i = 0; i < articleList.length; i++) {
          finalList.push(
            <ArticleCard
              articleContent={articleList[i].content}
              articleAuthorId={articleList[i].author}
              articleTitle={articleList[i].title}
              articlePk={articleList[i].pk}
              articleRate={articleList[i].rating}
            />
          );
        }
        this.setState({ finalList: finalList })
      }

      );

  }
}

export default ArticleHolder;
