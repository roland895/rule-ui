import React, {Component} from "react";
import "../../styles/activity-timeline.scss";
import LastIcon from "../../assets/last-icon.svg";
import NextIcon from "../../assets/next-icon.svg";
import { nfbind } from "q";
import moment from "moment";
import { tupleTypeAnnotation } from "@babel/types";
import {hasDayTimes} from "../../services/utils";
import {getLatestLogs} from "../../services/deleteRuleService";

export default class LastRun extends Component {
  constructor(props){

    super(props);
    this.state = {
      storages:["ISILON2","DELIVERY2","DVS-RT1"],
      latestLogs: []
    }
  }
  componentDidMount(){
    getLatestLogs().then((data)=>{
      this.setState({
        latestLogs: data
      });
    });
  }
  generateUpcomingJSX(rules){
    let JSX = [];
    rules.forEach((rule, idx)=>{
      JSX.push(
        <div className="last-rule" key={idx} onClick={() => this.props.selectRule(rule.ruleName)}>


          <div>
            <img src={LastIcon}></img>
            <div className="rule-name-and-date">
              <span>
                {moment(rule.lastRanDate).format("MM/DD/YYYY hh:mm a")}
              </span>
              <span>
                {rule.ruleName}
              </span>
            </div>
          </div>
        </div>
      )
    });
    return JSX;
  }
  getUpComing(){
    let nextItems=[];
    let currentTime = moment();
    this.props.deleteRules.forEach((rule)=>{
      if(rule.schedule !== undefined && rule.active){
        let ruleCreation = moment(rule.createDate);
        let ruleEndDate = moment("01-01-3000", "MM-DD-YYYY");
        rule.schedule.forEach((schedule)=>{
          let ruleSchedule;
          if(schedule.endDate){
            ruleEndDate = moment(schedule.endDate);
          }
          if(hasDayTimes.indexOf(schedule.ruleScheduleType) !== -1){
            ruleSchedule = Object.keys(schedule.ruleSchedule.dayTimes).map(function(key) {
              return [key, schedule.ruleSchedule.dayTimes[key]];
            });
          }else{
            ruleSchedule = [schedule.ruleSchedule.period];
          }

          let delta;
          let ruleRunTime;
          let future24hour = moment().add(24, 'hours');

            if(schedule.ruleScheduleType == 'interval' || schedule.ruleScheduleType == 'hourly'){
              ruleSchedule.forEach(period=>{
                let indexStart = currentTime.clone().minute(0).second(0);
                let indexHour = indexStart.clone().add(1, 'hour');
                if(schedule.ruleScheduleType == 'interval'){
                  let scheduleTime = indexStart.add(period,"minutes")
                  while(indexStart.isBefore(future24hour)){
                    if(scheduleTime.isAfter(currentTime)){
                      if(scheduleTime.isAfter(indexHour)){
                        indexStart.add(1,'hour');
                        scheduleTime = indexStart.clone().minute(0).second(0);
                        
                      }
                      else{
                        nextItems.push({
                          ruleName: rule.name,
                          lastRanDate: scheduleTime,
                        })
                      }
                    }else{
                      indexStart.add(1,'hour');
                      scheduleTime = indexStart.clone().minute(0).second(0);
                    }
                    scheduleTime.add(period, "minutes");
                  }
                }
                if(schedule.ruleScheduleType == 'hourly'){
                  let scheduleTime = indexStart.add(period,"minutes")
                  while(indexStart.isBefore(future24hour)){
                    if(scheduleTime.isAfter(currentTime)){
                      nextItems.push({
                        ruleName: rule.name,
                        lastRanDate: scheduleTime,
                      });
                    }
                    indexStart.add(1,'hour');
                    scheduleTime = indexStart.clone().minute(0).second(0);

                  }
                }
              })
            }
            if(schedule.ruleScheduleType == 'daily'){
              // addToJSX(rule, ruleSchedule)
              ruleSchedule.forEach(dayTimes=>{
                let hour = dayTimes[1].split(":")[0];
                let minute = dayTimes[1].split(":")[1];
                ruleRunTime = currentTime.clone().hour(hour).minute(minute).second(0);
                delta = ruleRunTime.diff(currentTime);
                nextItems.push({
                  ruleName: rule.name,
                  lastRanDate: ruleRunTime,
                });
              });
            }              

              if(schedule.ruleScheduleType === 'weekly'){
                ruleSchedule.forEach(time => {
                  let dayName = time[1].split("-")[0];
                  let hour = time[1].split("-")[1].split(":")[0];
                  let minute = time[1].split("-")[1].split(":")[1];
                  let day = 0;
                  switch(dayName){
                    case "Sunday":
                      day = 0;
                      // delta = moment().diff(moment().day(0).hour(hour).minute(minute));
                      break;
                    case "Monday":
                      day = 1;
                      break;
                    case "Tuesday":
                      day = 2;
                      break;
                    case "Wednesday":
                      day = 3;
                      break;
                    case "Thursday":
                      day = 4;
                      break;
                    case "Friday":
                      day = 5;
                      break;
                    case "Saturday":
                      day = 6;
                      break;
                  }
                  ruleRunTime = currentTime.clone().startOf('week').hour(hour).minute(minute).second(0).day(day);
                  if(ruleRunTime.isSameOrBefore(future24hour)){
                    nextItems.push({
                      ruleName: rule.name,
                      lastRanDate: ruleRunTime,
                    });
                  }
  
                }); 
              }
              if(schedule.ruleScheduleType === 'monthly'){
                ruleSchedule.forEach(time => {
                  let date = time.split("-")[0];
                  let hour = time.split("-")[1].split(":")[0];
                  let minute = time.split("-")[1].split(":")[1];
                  ruleRunTime = currentTime.clone().startOf('month').hour(hour).minute(minute).second(0).date(date);
                  if(ruleRunTime.isSameOrBefore(future24hour)){
                    nextItems.push({
                      ruleName: rule.name,
                      lastRanDate: ruleRunTime,
                    });
                  }
                });
              }
  
        });
      }

    });
    nextItems.sort((a, b)=>{
      return moment(a.lastRanDate).diff(moment(b.lastRanDate));
    });
    return nextItems;
  }
  getNextRule(storage){
    let filteredRulesByStorageName = this.props.deleteRules.filter(rule=>{
      if(storage == "DELIVERY2"){
        return rule.ruleData.targetDirectory.split("/").indexOf(storage) > 0 || rule.ruleData.targetDirectory.split("/").includes("");

      }else{
        return rule.ruleData.targetDirectory.split("/").indexOf(storage) > 0;
      }
    });
    let nextRule;
    let lowestTimeDelta;
    filteredRulesByStorageName.forEach((rule)=>{
      if(nextRule== undefined){
        nextRule = rule;
        lowestTimeDelta = this.getTimeUntilRun(rule);
      }else{
        let timeUntilRun = this.getTimeUntilRun(rule);
        if(timeUntilRun<lowestTimeDelta){
          lowestTimeDelta = timeUntilRun;
          nextRule = rule;
        }
      }
    });

    return nextRule;
  }
  getTimeUntilRun(rule){
    let lowestDelta;
    rule.schedule.forEach(schedule=>{
      let ruleSchedule = Object.keys(schedule.ruleSchedule.dayTimes).map(function(key) {
        return schedule.ruleSchedule.dayTimes[key];
      });
      if(schedule.ruleScheduleType== "daily"){
        ruleSchedule.forEach(time => {
          let hour = time.split(":")[0];
          let minute = time.split(":")[1];
          let delta = moment().minute(minute).hour(hour).second(0).diff(moment());
          if(delta < 0){
             delta+=86400000;
          }
          if(lowestDelta ==  undefined){
            lowestDelta = delta;
          }else if(delta<lowestDelta){
            lowestDelta = delta;
          }
        });
  
      }
      if(schedule.ruleScheduleType == "weekly"){
        ruleSchedule.forEach(time => {
          let dayName = time.split("-")[0];
          let hour = time.split("-")[1].split(":")[0];
          let minute = time.split("-")[1].split(":")[1];
          let delta;
          switch(dayName){
            case "Sunday":
              delta = moment().day(0).hour(hour).minute(minute).diff(moment());
              break;
            case "Monday":
              delta = moment().day(1).hour(hour).minute(minute).diff(moment());
              break;
            case "Tuesday":
              delta = moment().day(2).hour(hour).minute(minute).diff(moment());
              break;
            case "Wednesday":
              delta = moment().day(3).hour(hour).minute(minute).diff(moment());
              break;
            case "Thursday":
              delta = moment().day(4).hour(hour).minute(minute).diff(moment());
              break;
            case "Friday":
              delta = moment().day(5).hour(hour).minute(minute).diff(moment());
              break;
            case "Saturday":
              delta = moment().day(6).hour(hour).minute(minute).diff(moment());
              break;
          } 
          if(delta<0){
            delta += (86400000*7); 
          }
          if(lowestDelta ==  undefined){
            lowestDelta = delta;
          }else if(delta<lowestDelta){
            lowestDelta = delta;
          }
        });
      };
      if(schedule.ruleScheduleType == "Monthly"){
        ruleSchedule.forEach(time => {
          let day = time.split("-")[0];
          let hour = time.split("-")[1].split(":")[0];
          let minute = time.split("-")[1].split(":")[1];
          let delta;
          delta = moment().date(day).hour(hour).minute(minute).diff(moment());
  
          if(delta<0){
            delta = moment().add(1, "month").date(day).hour(hour).minute(minute).diff(moment()); 
          }
          if(lowestDelta ==  undefined){
            lowestDelta = delta;
          }else if(delta<lowestDelta){
            lowestDelta = delta;
          }
        });
      }
    })
    
    return lowestDelta
  }
  getLastRuleForStorage(storage){
    let filteredRulesByStorageName = this.props.deleteRules.filter(rule=>{
      return rule.ruleData.targetDirectory.split("/").indexOf(storage) > 0;
    });
    let mostRecent;
    filteredRulesByStorageName.forEach((rule)=>{
      if(mostRecent === undefined){
        mostRecent = rule;
      }else if(moment(rule.log.lastRanDate).isAfter(moment(mostRecent.log.lastRanDate))){
        mostRecent = rule;
      }
    });
    return mostRecent;
  }
  
  render(){
    //let nextIsilon = this.getNextRule("ISILON2");
    //let nextDelivery2 = this.getNextRule("DELIVERY2");
    let pastRulesJSX = this.generateUpcomingJSX(this.state.latestLogs);
    let upComingRuleseJSX =  this.generateUpcomingJSX(this.getUpComing());
    let nextDVS =  this.getNextRule("DVS-RT1");
    let lastDVS = this.getLastRuleForStorage("DVS-RT1");
    return(<div className="last-run-wrapper">
      <h2>Storage Activity Timeline</h2>
      <div className="activity-container-wrapper">
        <div className="activity-container">
          <div className="activity-header isilon2">
            <span>Previously Ran</span>
            <div className="mask"></div>
          </div>
          <div className="activity">
            {pastRulesJSX}
          </div>
        </div>
        <div className="activity-container">
          <div className="activity-header isilon2">
            <span>Upcoming</span>
            <div className="mask"></div>
          </div>
          <div className="activity">
            {upComingRuleseJSX}
          </div>
        </div>
        {/* <div className="activity-container">
          <div className="activity-header isilon2">
            <span>DBS-RT 1</span>
            <div className="mask"></div>
          </div>
          {nextDVS && 
            <div className="activity">
              <div className="last-rule">
                <img src={LastIcon}></img>
                <div className="activity-label">
                  Last Rule
                </div>
                <div className="rule-name-and-date">
                  <span>
                    {lastDVS.name}
                  </span>
                  <span>
                    {moment(lastDVS.log.lastRanDate).format("MM/DD/YYYY hh:mmA")}
                  </span>
                </div>
              </div>
              <div className="next-rule">
                <img src={NextIcon}></img>
                <div className="activity-label">
                  Next Rule
                </div>
                <div className="rule-name-and-date">
                  <span>
                    {nextDVS.name}
                  </span>
                  <span>
                    {moment(this.getTimeUntilRun(nextDVS)).add(moment().valueOf(), "ms").format("MM/DD/YYYY hh:mmA")}
                  </span>
                </div>
              </div>
            </div>
          }          
        </div> */}
      </div>
    </div>);
  }
}
