import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Jumbotron, Button, Modal, ModalFooter, Card, ModalBody } from "react-bootstrap";
import axios from "axios";
import ArticleMakeComment from "./article_make_comment";
import ArticleCommentHolder from "./articleCommentHolder";
import "./wholeArticlePage.css";
import ArticleLikeButton from "./articleLikeButton";
import ArticleDislikeButton from "./articleDislikeButton";
import { withRouter } from "react-router-dom";
import ArticleLike from "./articleLike";
import ArticleDislike from "./articleDislike";
import { FaHeart } from "react-icons/fa";
import { MdBookmarkBorder, MdDeleteForever, MdClose } from "react-icons/md";
import AnnotatedArticle from "./annotated_article";
import ModalHeader from "react-bootstrap/ModalHeader";



class WholeArticlePage extends Component {
  constructor() {
    super();
    this.state = {
      articleTitle: "",
      articleContent: "",
      authorId: -1,
      authorName: "",
      articlePk: "",
      articleRanking: 0,
      likeState: 0,
      rating: 0,
      annot: '',
      textStart: 0,
      textEnd: 0,
      x: 0,
      y: 0,
      showModal: false,
      annotationInfo: [],
      shownAnnotation: null,
      showSpecificAnnotation: false,
      annotationOwnerName: "",
      specificAnnotationContent: '',
      specificAnnotationOwnerPk: 0,
      specificAnnotationX: 0,
      specificAnnotationY: 0,
      specificAnnotationPk: 0,
      specificAnnotationQuote: '',
      showErrorMessage: false
    };
    this.articleRef = React.createRef()
    this.handleShow = this.handleShow.bind(this)
    this.handleNoteChange = this.handleNoteChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.getTextSelection = this.getTextSelection.bind(this)
    this.getTextLength = this.getTextLength.bind(this)
    this.getNodeTextLength = this.getNodeTextLength.bind(this)
    this.getNodeOffset = this.getNodeOffset.bind(this)
    this.handleSelectionChange = this.handleSelectionChange.bind(this)
    this.isEditor = this.isEditor.bind(this)
    this.handleAnnotationModal = this.handleAnnotationModal.bind(this)
    this.getAnnotationOwner = this.getAnnotationOwner.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  getTextSelection(editor) {
    const selection = window.getSelection();
    if (selection != null && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        start: this.getTextLength(editor, range.startContainer, range.startOffset),
        end: this.getTextLength(editor, range.endContainer, range.endOffset)
      };
    } else
      return null;
  }

  getTextLength(parent, node, offset) {
    var textLength = 0;
    if (node.id == 'articleContainer') return 0
    if (node.nodeName == '#text') {
      textLength += offset;
    }
    else for (var i = 0; i < offset; i++)
      textLength += this.getNodeTextLength(node.childNodes[i]);

    if (node != parent)
      textLength += this.getTextLength(parent, node.parentNode, this.getNodeOffset(node));

    return textLength;
  }

  getNodeTextLength(node) {
    var textLength = 0;
    if (node.nodeName == 'BR')
      textLength = 1;
    else if (node.nodeName == '#text')
      textLength = node.nodeValue.length;
    else if (node.childNodes != null)
      for (var i = 0; i < node.childNodes.length; i++)
        textLength += this.getNodeTextLength(node.childNodes[i]);

    return textLength;
  }

  getNodeOffset(node) {
    return node == null ? -1 : 1 + this.getNodeOffset(node.previousSibling);
  }

  handleSelectionChange(e) {
    this.setState({
      annot: '',
      showSpecificAnnotation: false

    })
    e.preventDefault();
    if (this.isEditor(document.activeElement)) {
      const textSelection = this.getTextSelection(document.activeElement);
      if (textSelection != null) {
        const text = document.activeElement.innerText;
        const selection = text.slice(textSelection.start, textSelection.end);

        this.setState({
          annot: selection,
          textStart: textSelection.start,
          textEnd: textSelection.end,
          x: e.pageX,
          y: e.pageY,
        })
      }
    }
  }

  isEditor(element) {
    return element != null && element.classList.contains('editor');
  }


  calc() {
    let sum = 0
    for (var i = 0; i < this.state.annotationInfo.length; i++)
      sum = sum + this.state.annotationInfo[i].to_position - this.state.annotationInfo[i].from_position
    return sum;
  }

  handleShow() {
    let status = this.state.showModal
    this.setState({
      showModal: !status
    })
  }

  handleError() {
    let status = this.state.showErrorMessage
    this.setState({
      showErrorMessage: !status
    })
  }

  handleSave(event) {
    event.preventDefault();
    var token = localStorage.getItem("userToken");
    const data = {
      from_position: this.state.textStart,
      to_position: this.state.textEnd,
      content: this.state.value
    }
    axios.post(
      'http://8.209.81.242:8000/articles/' + this.state.articlePk + '/annotations',
      data, {
      headers: { Authorization: `Token ${token}` }
    }).then(function (response) {
      console.log(response);
    });

    this.setState({
      value: ''
    })
    this.handleShow();
    window.location.reload();

  }
  handleNoteChange(event) {
    this.setState({ value: event.target.value });
  }
  getAnnotationOwner(ownerPk) {
    var token = localStorage.getItem("userToken");
    return axios.get("http://8.209.81.242:8000/users/" + ownerPk, {
      headers: { Authorization: `Token ${token}` }
    }).then((res) => {
      this.setState({
        annotationOwnerName: res.data.first_name + ' ' + res.data.last_name
      })
    })

  }


  deleteAnnotation(annotPk) {
    this.setState({ showSpecificAnnotation: false, })

    var token = localStorage.getItem("userToken");
    axios.delete("http://8.209.81.242:8000/articles/" + this.state.articlePk + '/annotations/' + annotPk, {
      headers: { Authorization: `Token ${token}` }
    }
    ).then((res) =>
      this.refreshPage()).catch(error => {
        if(error.response.status == 403) {
          this.setState({
            showErrorMessage:true
          })
        }
      })
    return;
  }

  handleAnnotationModal(event, ownerPk, content, quote, annotPk) {

    this.getAnnotationOwner(ownerPk)
    if (this.state.annotationOwnerName == null) return;

    this.setState({
      specificAnnotationContent: content,
      specificAnnotationOwnerPk: ownerPk,
      specificAnnotationX: event.pageX,
      specificAnnotationY: event.pageY,
      specificAnnotationPk: annotPk,
      specificAnnotationQuote: quote,
      showSpecificAnnotation: true
    })

  }

  render() {
    const annotBoxStyle = {
      backgroundColor: 'whitesmoke', left: this.state.specificAnnotationX, top: this.state.specificAnnotationY, position: 'absolute'
    }
    let errorMsg = <Modal onHide={this.handleError} show={this.state.showErrorMessage}>
      <ModalHeader closeButton>You can not delete other users annotations.</ModalHeader>
    </Modal>
    let annotCard =
      <Card style={annotBoxStyle}>
        <Card.Header>
          <MdDeleteForever className='annotationScreenButton'
            onClick={() => this.deleteAnnotation(this.state.specificAnnotationPk)}
            style={{ float: 'left' }}></MdDeleteForever>
          <MdClose className='annotationScreenButton'
            onClick={() => this.setState({ showSpecificAnnotation: false })}
            style={{ float: 'right' }}></MdClose>
        </Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p style={{ padding: 3, fontStyle: 'italic', letterSpacing: 1.4 }}>
              {' '}
              {this.state.specificAnnotationContent}{' '}
            </p>
            <footer className="blockquote-footer">
              Annotation by <a
                href={"/profile/" + this.state.specificAnnotationOwnerPk} title="Source Title"> {this.state.annotationOwnerName} </a>
            </footer>
          </blockquote>
        </Card.Body>
      </Card>

    let ann = '"' + this.state.annot + '"'

    let annotated_article = <AnnotatedArticle annotationList={this.state.annotationInfo}
      articleContent={this.state.articleContent} handleAnnotationModal={this.handleAnnotationModal}></AnnotatedArticle>

    let modal =
      <Modal className='modal' centered show={this.state.showModal} onHide={this.handleShow} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>New Annotation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 36 }}>
          <div style={{
            padding: 24, borderLeft: '2px solid #c89666', fontStyle: 'italic', fontWeight: 'lighter',
            borderRadius: 12, color: 'black'
          }}>
            {ann}


          </div>
        </Modal.Body>

        <div style={{ margin: 'auto' }}>Notes</div>
        <Modal.Footer style={{ margin: 'auto' }}>
          <textarea value={this.state.value} onChange={this.handleNoteChange}
            style={{ padding: 12, borderRadius: 12, outline: 'none', resize: 'none', overflow: 'auto' }}
            placeholder="..." cols="48" rows="5"></textarea>
        </Modal.Footer>
        <ModalFooter >
          <div onClick={this.handleSave} className='annotationButton' style={{ border: 'none' }} >Save</div>
        </ModalFooter>
      </Modal >

    let annotationButton =
      <div onClick={this.handleShow} className='annotationButton' style={{
        left: this.state.x, top: this.state.y, position: 'absolute'
      }}>
        Annotate
    </div>

    const annotation = (this.state.annot.length > 0) ?
      ann : <div></div>
    const popover = (this.state.annot.length > 0) ?
      annotationButton : <div></div>

    const shownAnnotation = (this.state.showSpecificAnnotation) ? annotCard : null

    return (
      <div className='main' style={{ width: '70%', margin: 'auto', paddingLeft: 100, paddingRight: 100, paddingTop: 30 }}>
        <div style={{ backgroundColor: 'whitesmoke' }}>
          <div id='articleContainer' style={{ backgroundColor: 'whitesmoke', padding: 60, width: '100%', margin: 'auto' }} className="first-div">
            <div style={{ display: 'inline' }}>
              {popover}
              {modal}
              {this.state.showModal}
              {shownAnnotation}
              {this.state.showErrorMessage ? errorMsg : null}
              <Button
                id='writtenBy'
                href={"/profile/" + this.state.authorId}
                variant="outline-primary"
                className="by-author-button"
              >
                Author: {this.state.authorName}
              </Button>

              <Button
                id='rating'
                variant="outline-primary"
              >
                <FaHeart style={{ color: 'white', marginRight: 4 }}></FaHeart>
                Rating: {this.state.rating}
              </Button>
              {(localStorage.getItem("userGroup") === "2" ||localStorage.getItem("userGroup") === "1" ) &&
                 <p style={{ float: 'right' }}>
                 <ArticleLike incRating={this.incRating} decRating={this.decRating} makeLike={this.makeLike} makeNeutral={this.makeNeutral} likeState={this.state.likeState} articlePk={this.state.articlePk} />
                 <ArticleDislike incRating={this.incRating} decRating={this.decRating} makeDisslike={this.makeDisslike} makeNeutral={this.makeNeutral} likeState={this.state.likeState} articlePk={this.state.articlePk} />
               </p>
              }
             

            </div>

            <Jumbotron style={{ backgroundColor: 'whitesmoke' }} className="my-jumbotron" >
              <div style={{ float: 'left', marginLeft: 0, fontSize: 28, width: '100%' }} className="article-header">
                <MdBookmarkBorder style={{ color: 'darkblue', marginRight: 6 }}></MdBookmarkBorder>
                {this.state.articleTitle}

              </div>


              <div onMouseUp={this.handleSelectionChange}
                id='editor' spellCheck="false"
                className="editor" contentEditable="true"
                style={{ backgroundColor: 'whitesmoke', fontSize: 15 }}>
                {(annotated_article)}
              </div>


            </Jumbotron>

          </div>
        </div>
        <div style={{ width: '100%', height: 'auto', float: 'left', marginTop: 20 }}>
          <div id='commentContainer' style={{ marginBottom: 16 }}>
            <ArticleCommentHolder articlePk={this.state.articlePk} />
          </div>
          {(localStorage.getItem("userGroup") === "2" || localStorage.getItem("userGroup") === "1") &&
          <div id='makeCommentContainer' style={{ float: 'left' }} >
          <ArticleMakeComment refresh={this.refreshPage} articlePk={this.state.articlePk} />
        </div>
          }
          

        </div>


      </div >

    );
  }
  componentWillMount() {
    var token = localStorage.getItem("userToken");
    this.setState({ articlePk: this.props.match.params.id });
    axios
      .get("http://8.209.81.242:8000/articles/" + this.props.match.params.id, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        this.setState({ articleTitle: res.data.title });
        this.setState({ articleContent: res.data.content });
        this.setState({ authorId: res.data.author });
        this.setState({ articleRanking: res.data.rating })
        axios
          .get("http://8.209.81.242:8000/users/" + res.data.author, {
            headers: { Authorization: `Token ${token}` }
          })
          .then(result => {
            this.setState({
              authorName: result.data.first_name + " " + result.data.last_name
            });
          });
      });


  }

  componentDidMount() {
    let _this = this
    let vari
    var token = localStorage.getItem("userToken");
    axios.get("http://8.209.81.242:8000/articles/" + this.state.articlePk.toString() + "/annotations", {
      headers: { Authorization: `Token ${token}` }
    }).then(res => {
      this.setState({ annotationInfo: res.data });
    })

  }
  refreshPage = () => {
    window.location.reload();
  }
  makeLike = () => {
    this.setState({ likeState: 1 })
  }
  makeDisslike = () => {
    this.setState({ likeState: 2 })
  }
  makeNeutral = () => {
    this.setState({ likeState: 0 })
  }
  incRating = () => {
    var newRating = this.state.rating + 1;
    this.setState({ rating: newRating })
  }
  decRating = () => {
    var newRating = this.state.rating - 1;
    this.setState({ rating: newRating })
  }
}

export default WholeArticlePage;
