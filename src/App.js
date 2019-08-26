import React, { Component } from 'react';
import './App.scss';
import './styles/modal.scss';
import moment from 'moment';

import Brush from './assets/brush.svg';
import DeleteRuleTimeline from './components/timeline/delete-timeline';
import {getRulesPromise, getSchedule, getLog} from './services/deleteRuleService';
import LastRun from './components/lastRunRules/last-run';
import RuleList from './components/ruleList/rule-list';
import Modal from 'react-modal';
import CreateModal from './components/createModal';
import LogModal from './components/logModal';
import { thisExpression } from '@babel/types';
import AddRuleIcon from "./assets/addRuleIcon.svg";
import {hasDayTimes} from "./services/utils";
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,.5)';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      id:"",
      ruleData:[],
      createModalOpen:false,
      displayRuleModal:false,
      dataLoaded: false,
      selectedRule:null,
      isEdit:false,
      name: "",
      description: "",
      ruleType: "WATCHFOLDER_RULE",
      ruleDate: moment(),
      data: {
        hostname: '',
        moveDirectory: "",
        targetDirectory: "",
        days: 0,
        type: "",
        maxDepth: 1,
        wildcardString: "",
        ruleToRun: "",
      },
      ruleDataType: 'JSON',
      ruleClassname: "",
      ruleAction: "",
      schedules: [],
    }
    this.toggleCreateModal = this.toggleCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.toggleRuleDisplayModal = this.toggleRuleDisplayModal.bind(this);
    this.closeRuleDisplayModal = this.closeRuleDisplayModal.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.disableEdit = this.disableEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.repeatChange = this.repeatChange.bind(this);
    this.removeRepeat =  this.removeRepeat.bind(this);
    this.addRepeat = this.addRepeat.bind(this);
    this.addSchedule  = this.addSchedule.bind(this);
    this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
    this.getRules = this.getRules.bind(this);
    this.getSchedule = this.removeSchedule.bind(this);
    this.removeSchedule = this.removeSchedule.bind(this);
  }
  componentDidMount(){

    this.getRules();
  }
  getRules(){
    let promiseArray = []
    let deleteRules;
    getRulesPromise.then((data)=>{
      data.forEach((rule, idx, arr) => {
        promiseArray.push(Promise.all([getSchedule(rule.name),getLog(rule.name)]).then((values)=>{
          arr[idx].schedule = values[0];
          arr[idx].log = values[1];
          deleteRules = data;
        }));
      });
      Promise.all(promiseArray).then(()=>{
        this.setState({
          ruleData: deleteRules
        });
      });
    });

  }
  toggleCreateModal(){
    this.setState({
      createModalOpen: true,
      id:"",
      name: "",
      description: "",
      ruleType: "WATCHFOLDER_RULE",
      period: 0,
      ruleClassname: "",
      ruleAction: "",
      schedules: [{
        startDate: moment(),
        startTime: moment().format("HH:mm"),
        endDate: moment(),
        endTime: '',
        times: [],
        enableEndDate: false,
      }],
      data: {
        hostname: '',
        moveDirectory: "",
        targetDirectory: "",
        days: 0,
        type: "",
        maxDepth: 1,
        wildcardString: "",
        ruleToRun: "",
      },
    });
  }
  closeCreateModal(){
    this.setState({
      createModalOpen: false
    });
  }
  createTimeObject(schedule){
    let dayTimesArray
    let timesArray = [];
    if(hasDayTimes.indexOf(schedule.ruleScheduleType) !== -1){
      dayTimesArray = Object.keys(schedule.ruleSchedule.dayTimes).map((key) => {
        return schedule.ruleSchedule.dayTimes[key];
      });
    }else{
      dayTimesArray = [schedule.ruleSchedule.period];
    }
    if (schedule.ruleScheduleType == "interval") {
      timesArray.push({
        time: '',
        type: schedule.ruleScheduleType,
        dayOfWeek: "Monday",
        dayOfmonth: 1,
        month:1,
        period: schedule.ruleSchedule.period,
        id: schedule.id
      });
    }
    if (schedule.ruleScheduleType == "hourly") {
      timesArray.push({
        time: '',
        type: schedule.ruleScheduleType,
        dayOfWeek: "Monday",
        dayOfmonth: 1,
        month:1,
        period: schedule.ruleSchedule.period,
        id: schedule.id
      });
    }
    if (schedule.ruleScheduleType == "daily") {
      dayTimesArray.forEach((dayTime) => {
        timesArray.push({
          time: dayTime,
          type: schedule.ruleScheduleType,
          dayOfWeek: "Monday",
          dayOfmonth: 1,
          month:1,
          period: schedule.ruleSchedule.period,
          id: schedule.id
        });
      });
    }
    if (schedule.ruleScheduleType == "weekly") {
      dayTimesArray.forEach((dayTime) => {
        timesArray.push({
          time: dayTime.split("-")[1],
          type: schedule.ruleScheduleType,
          dayOfWeek: dayTime.split("-")[0],
          dayOfmonth: 1,
          month:1,
          period: schedule.ruleSchedule.period,
          id: schedule.id
        });
      });
    }
    if (schedule.ruleScheduleType == "monthly") {
      dayTimesArray.forEach((dayTime) => {
        timesArray.push({
          time: dayTime.split("-")[1],
          type: schedule.ruleScheduleType,
          dayOfWeek: "Monday",
          dayOfmonth: dayTime.split("-")[0],
          month:1,
          period: schedule.ruleSchedule.period,
          id: schedule.id
        });
      });
    }
    if (schedule.ruleScheduleType == "yearly") {
      dayTimesArray.forEach((dayTime) => {
        timesArray.push({
          time: dayTime.split("-")[2],
          type: schedule.ruleScheduleType,
          dayOfWeek: "Monday",
          dayOfmonth: dayTime.split("-")[1],
          month:  dayTime.split("-")[0],
          period: schedule.ruleSchedule.period,
          id: schedule.id
        });
      });
    }
    return timesArray
  }
  toggleRuleDisplayModal(selectedRule){
    if(selectedRule){
      let selectedRuleObj;
      if(typeof selectedRule == "string"){
        selectedRuleObj = this.state.ruleData.filter((rule)=>{
          return rule.name == selectedRule
        })[0];
      }else{
        selectedRuleObj =selectedRule;
      }
      this.setState({
        displayRuleModal: true,
        selectedRule:selectedRuleObj,
      });
      let rule = selectedRuleObj;
      let scheduleTimes = [];

      if (selectedRuleObj.schedule.length > 0) {
        selectedRuleObj.schedule.forEach(schedule => {
          if (scheduleTimes.filter((time) => {
            return moment(time.startDate).format() == moment(schedule.createDate).format()
          }).length > 0 && scheduleTimes.filter((time) => {
            return moment(time.endDate).format() == moment(schedule.endDate).format()
          }).length > 0) {
            //add into times array for matching schedule
            let matchingIndex  = scheduleTimes.findIndex((time)=>{
              return moment(time.startDate).format() == moment(schedule.createDate).format() &&  moment(time.endDate).format() == moment(schedule.endDate).format()
            });

            scheduleTimes[matchingIndex].times = scheduleTimes[matchingIndex].times.concat(this.createTimeObject(schedule));
          }
          else {
            let enableEndDate = false;
            let timesArray = this.createTimeObject(schedule);
            scheduleTimes.push({
              startDate: moment(schedule.createDate),
              startTime: moment(schedule.createDate).format("HH:mm"),
              endDate: moment(schedule.endDate),
              endTime: moment(schedule.endDate).format("HH:mm"),
              times: timesArray,
              enableEndDate: enableEndDate,
            });

          }
        });


      }
      this.setState({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        ruleType: rule.ruleType,
        ruleClassname: rule.ruleClassname,
        ruleAction: rule.ruleAction,
        data: rule.ruleData,
        ruleDate: rule.ruleDate,
        schedules: scheduleTimes
      });

    }
    //handle name case

  }
  closeRuleDisplayModal(){
    this.setState({
      displayRuleModal: false,
      isEdit: false
    });
  }
  toggleEdit(){
    this.setState({
      isEdit: true
    });
  }
  disableEdit(){
    this.setState({
      isEdit: false
    });
  }
  handleChange(evt) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [evt.target.name]: evt.target.value });

  }
  handleDataChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState((prevState) => {
      let newData = Object.assign({}, prevState.data);
      newData[name] = value;
      return {
        data: newData,
      }
    });
  }
  handleDateChange = (idx, name) => (date) => {
    this.setState(prevState => {
      let schedules = prevState.schedules.slice();
      schedules[idx][name] = date;
      return {
        schedules: schedules,
      }
    });
  }
  repeatChange = (idxSchedule, idxTimes, name) => (evt) => {
    let newValue = evt.target.value;
    if(evt.target  == null){
      newValue = evt.currentTarget.value;
    }
    this.setState((prevState) => {
      let schedules = prevState.schedules.slice();
      schedules[idxSchedule].times[idxTimes][name] = newValue;

      return ({
        schedules: schedules,
      })
    });
  }
  removeRepeat = (scheduleIdx, repeatIdx) => {
    this.setState((prevState) => {
      let schedules = prevState.schedules.slice();
      schedules[scheduleIdx].times.splice(repeatIdx, 1);
      return ({
        schedules: schedules,
      })
    });
  }
  addRepeat = (idx) => (event) => {
    this.setState((prevState) => {
      let schedules = prevState.schedules.slice();
      schedules[idx].times.push({
        time: "00:00",
        type: "daily",
        dayOfWeek: "Monday",
        dayOfmonth: 1,
        period: 0,
        id: null,
      });
      return ({
        schedules: schedules,
      })
    })
  }
  addSchedule(){
    this.setState((prevState) => {
      let schedules = prevState.schedules.slice();
      schedules.push({
        startDate: moment(),
        startTime: moment().format("HH:mm"),
        endDate: moment(),
        endTime: '',
        times: [],
        enableEndDate: false
      });
      return ({
        schedules: schedules,
      })
    });
  }
  removeSchedule(idx){
    this.setState((prevState) => {
      let schedules = prevState.schedules.slice();
      schedules.splice(idx,1);
      return ({
        schedules: schedules,
      })
    });
  }
  handleChangeCheckBox = (idx,name) => (event, checked) => {
    this.setState((prevState) => {
      let schedules = prevState.schedules.slice();
      schedules[idx][name] = checked;

      return ({
        schedules: schedules,
      })
    });
  };
  render() {
    let overlayClass = "overlay-off";
    let overlayClassRule =  "overlay-off";
    if(this.state.createModalOpen){
      overlayClass = "overlay-on";
    }
    if(this.state.displayRuleModal){
      overlayClassRule ="overlay-on";
    }
      return (
      <div className={"App " + (this.state.createModalOpen || this.state.displayRuleModal ? "modal-open":"")}>
        <nav className="nav-bar">
          <div className="nav-container">
            <div className="logo">
              <img src={Brush}></img>
              Delete Tool
            </div>
            <button className="delete-ui-button" onClick={this.toggleCreateModal}>
              <img className="addRuleIcon" src={AddRuleIcon}/>
              Create Rule
            </button>
          </div>
        </nav>
        <DeleteRuleTimeline deleteRules={this.state.ruleData} selectRule={this.toggleRuleDisplayModal}></DeleteRuleTimeline>
        
        <div className="container">
            <LastRun deleteRules={this.state.ruleData} selectRule={this.toggleRuleDisplayModal}></LastRun>
            <RuleList deleteRules={this.state.ruleData} selectRule={this.toggleRuleDisplayModal}></RuleList>
        </div>
        
        <div className={"modal-overlay " + overlayClass} onClick={this.closeCreateModal}>
            <CreateModal 
              {...this.state}
              closeModal={this.closeCreateModal}
              handleChange={this.handleChange}
              handleDataChange={this.handleDataChange}
              handleDateChange={this.handleDateChange}
              repeatChange={this.repeatChange}
              addRepeat={this.addRepeat}
              removeRepeat={this.removeRepeat}
              handleChangeCheckBox={this.handleChangeCheckBox}
              addSchedule={this.addSchedule}
              removeSchedule={this.removeSchedule}
              getRules={this.getRules}

            ></CreateModal>
        </div>
        <div className={"modal-overlay " + overlayClassRule} onClick={this.closeRuleDisplayModal}>
            <LogModal 
              {...this.state}
              handleChange={this.handleChange}
              handleDataChange={this.handleDataChange}

              toggleEdit={this.toggleEdit}
              closeRuleDisplayModal={this.closeRuleDisplayModal}
              handleDateChange={this.handleDateChange}
              repeatChange={this.repeatChange}
              removeRepeat={this.removeRepeat}
              addRepeat={this.addRepeat}
              disableEdit={this.disableEdit}
              toggleEdit={this.toggleEdit}
              addSchedule={this.addSchedule}
              removeSchedule={this.removeSchedule}
              getRules={this.getRules}
            >

            </LogModal>
        </div>
      </div>
    )
  }
}

export default App;
