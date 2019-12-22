import React from 'react'
import ReactFragment from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import "./wholeArticlePage.css";
import axios from "axios";



class AnnotatedArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortedAnnotations: [],
        }
        this.initData = this.initData.bind(this)
    }

    initData() {
        const myArray = [].concat(this.props.annotationList)
        myArray.sort(function (a, b) { return parseInt(a.from_position) - parseInt(b.from_position) })
        return <div>{this.controller(myArray)}</div>

    }


    styledText(text, from, to, annotation) {
        const colors = ['#F2FFEA', '#ECF4FF', '#FFF9EA', '#F5EEFD']
        let fullName = ""

        const rand = Math.floor(Math.random() * 4 + 0)
        // send color, user, note, text to another component
        let substr = text.substring(from, to)
        let modified =
            <em className='styledTextPart'><a
                onClick={(e) => this.props.handleAnnotationModal(e, annotation.owner, annotation.content, substr, annotation.pk)}
                style={{ backgroundColor: colors[rand], fontSize: 18 }}
            >
                {substr}
            </a></em>

        return modified
    }



    controller(sortedArr) {
        let text = this.props.articleContent
        let arrLength = sortedArr.length
        if (arrLength == 0)
            return text
        let rangeFrom = 0
        let rangeTo = sortedArr[0].from_position
        let firstPart = text.substring(rangeFrom, rangeTo)
        let result = []

        result.push(firstPart)
        for (var i = 0; i < arrLength - 1; i++) {
            result.push(this.styledText(text, sortedArr[i].from_position, sortedArr[i].to_position, sortedArr[i]))
            result.push(text.substring(sortedArr[i].to_position, sortedArr[i + 1].from_position))

        }
        result.push(this.styledText(text, sortedArr[arrLength - 1].from_position, sortedArr[arrLength - 1].to_position, sortedArr[i]))

        result.push(text.substring(sortedArr[arrLength - 1].to_position, text.length))
        return result
    }

    render() {
        
        //let processed = this.controller(sortedArr)
        return this.initData()
       // return <div>{processed}</div>
    }

    componentDidUpdate() {
    }
    //let text = document.getElementById('articleText1').textContent.trim()
    //document.getElementById('articleText1').innerHTML = text.substring(0, start) +
    //   '<span style="background:yellow">' +
    //    text.substring(start, end) +
    //     "</span>" + text.substring(end);
}

export default AnnotatedArticle