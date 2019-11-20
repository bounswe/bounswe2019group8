import React, { Component } from "react";
import ArticleCard from "./articleCard";
class ArticleLine extends Component {
  state = {
    articles: [] //These can be at most 5.
  };
  render() {
    return (
      <div>
        <ul className="articleLine">
          {this.props.articles.map(article => (
            <li>
              <ArticleCard
                articleContent={article.content}
                articleAuthorId={article.author}
                articleTitle={article.title}
                articlePk={article.pk}
                articleRate={article.rating}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default ArticleLine;
