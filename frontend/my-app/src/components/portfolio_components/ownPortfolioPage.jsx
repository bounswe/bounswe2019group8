import React, { Component } from 'react';
import {Button, Badge, Tabs, Tab} from "react-bootstrap";
import "./ownPortfolioPage.css";
import { FaFolderOpen} from "react-icons/fa";

class OwnPortfolioPage extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="portfolio-outer-div">
                <Tabs defaultActiveKey="your-portfolios" style={{fontWeight:'lighter',  justifyContent: 'center', backgroundColor:'whitesmoke' , borderRadius:"3px"}}>
                    <Tab eventKey="your-portfolios" title={<div><FaFolderOpen></FaFolderOpen> Your Portfolios</div>}>
                        <div className="your-portfolios-div">
                            <Button className="create-portfolio-button">Create a new portfolio</Button>
                        </div>
                    </Tab>
                    <Tab eventKey="followed-portfolios" title={<div><FaFolderOpen></FaFolderOpen> Followed Portfolios </div>} >
                    </Tab>
                 </Tabs>
            </div>
         );
    }
}
 
export default OwnPortfolioPage;