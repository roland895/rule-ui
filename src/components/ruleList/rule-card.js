import React, {Component} from "react";
import TypeIcon from "../../assets/type-icon.svg";
import DateIcon from "../../assets/date-icon.svg";
import LastIcon from "../../assets/last-ran-icon-white.svg";
import ScheduleIcon from "../../assets/schedule-icon.svg";
import {findStorage} from "../../services/utils";
import DescriptionIcon from "../../assets/description-icon.svg";
import LazyLoad from 'react-lazy-load';

import moment from "moment";
export default class RuleCard extends Component {
  constructor(props){

    super(props);
    this.state = {
    }
  }
  
  render(){
    let stateIndicator = <div className="active-indicator">active</div>
    let directory = findStorage(this.props.rule);
    
    let scheduleList = this.props.rule.schedule.map(schedule=>schedule.ruleScheduleType).join(', ');
    if(!this.props.rule.active){
      stateIndicator = <div className="inactive-indicator">inactive</div>
    }
    return(
      <LazyLoad height={364} width={"calc(50% - 15px)"} offsetTop={200}>

    <div className="rule-card" onClick={() => this.props.selectRule(this.props.rule)}>
      <div className="card-header">
        {this.props.rule.name}
        {stateIndicator}
      </div>
      <ul className="rule-card-list">
        <li>
          <div className="list-label"><img src={TypeIcon}></img>Rule Type</div>
          <div className="list-field">{this.props.rule.ruleType}</div>
        </li>
        <li>
          <div className="list-label"><img src={DateIcon}></img>Rule Establish Date</div>
          <div className="list-field">{moment(this.props.rule.ruleDate).format("MM/DD/YYYY")}</div>
        </li>
        <li>
          <div className="list-label"><img src={LastIcon}></img>Last Ran Date</div>
          <div className="list-field">{(this.props.rule.log.length>0 ? moment(this.props.rule.log[0].lastRanDate).format("MM/DD/YYYY HH:mm:ss") : "N/A")}</div>
        </li>
        <li>
          <div className="list-label"><img src={ScheduleIcon}></img>Schedule</div>
          <div className="list-field">{scheduleList}</div>
        </li>
      </ul>
      <div className="description">
        <div className="list-label"><img src={DescriptionIcon}></img>Description</div>
        <p>
          Type the description. Type the description. Type the description. Type the description. Type the description. Type the description. 
        </p>
      </div>
    </div>
    </LazyLoad>
    );
  }
}
