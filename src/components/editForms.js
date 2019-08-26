import React, { Component } from "react";
import moment from "moment";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from "@material-ui/styles";
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core";
import CalendarIcon from "../assets/calendar.svg";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { materialTheme, BootstrapInput} from './materialUIOverrides';
import Radio from '@material-ui/core/Radio';
import RemoveIcon from "../assets/removeIcon.svg";
import DayPicker from "./formElements/dayPicker";
import RadioGroup from '@material-ui/core/RadioGroup';

// import TimePicker from 'rc-time-picker';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddScheduleIcon from "../assets/addSchedule.svg";
import AddRuleIcon from "../assets/addRuleIcon.svg";

import Checkbox from '@material-ui/core/Checkbox';
import Repeats from "../components/formElements/repeats";
import {postNewSchedule, postNewRule} from '../services/deleteRuleService';
import {
  DatePicker,
  TimePicker,
} from '@material-ui/pickers';
import { tupleTypeAnnotation } from "@babel/types";


export default class RuleForm extends Component {
  constructor(props) {

    super(props);
    this.state = {
      ruleAction: "",
      addType: "weekly",
      addTime: moment(),
      addEndTime: moment(),
      addWeeklyDay: "Monday",
      period: 0,
      datePickerOpen: false,
      endDatePickerOpen: false,
      addEndTimeEnable: false,
      startTime: moment().minutes(0).hour(0).seconds(0),
      dayTimesDaily: [],
      dayTimesWeekly: [],
      dayTimesMonthly: [],
      testChecked: false,
      adding: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.openEndDatePicker = this.openEndDatePicker.bind(this);
    this.closeEndDatePicker = this.closeEndDatePicker.bind(this);
    // this.handleChangeScheduleType = this.handleChangeScheduleType.bind(this);
    this.handleTimeChangeHour = this.handleTimeChangeHour.bind(this);
    this.handleTimeChangeA = this.handleTimeChangeA.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }
  componentDidMount() {

  }
  componentDidUpdate(prevProps) {

    // if(JSON.stringify(prevProps.ruleData) !== JSON.stringify(this.props.ruleData)){
    //     let rule = this.props.ruleData;
    //     console.log(rule);
    //     this.setState({
    //       ruleName: rule.ruleName,
    //       ruleDescription: rule.ruleDescription,
    //       ruleClassname: rule.ruleClassname,
    //       ruleAction: rule.ruleAction,
    //       data: rule.data,
    //       schedule: rule.schedule
    //     });

    // }
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
        datePickerOpen: false
      }
    });
    this.closeDatePicker();
  }

  handleTimeChange = param => (time) => {
    this.setState({
      [param]: time,
      datePickerOpen: false
    });
  }
  handleTimeChangeHour(event) {
    alert(event.target.name);
  }
  handleTimeChangeA(event) {
    alert(event.target.name);
  }

  handleSaveClick(){
    this.setState({
      adding: true
    }, ()=>{
      let schedulePayloads = [];
      let schedulePromiseArray = [];
      console.log(this.props.schedules);
      this.props.schedules.forEach(schedule=>{
        if(schedule.times.length  == 0){
          let scheduleObj = {
            ruleName: this.props.name,
            createDate: schedule.startDate.format(),
            endDate: (schedule.endDate ? schedule.endDate.format() : null),
            ruleSchedule: window.btoa("{}"),
            active:false,
          }
          schedulePayloads.push(scheduleObj);
        }else{
          schedule.times.forEach(time=>{
            let dayTimes;
            if(time.type == 'daily'){
              dayTimes = {"0":time.time}
            }
            if(time.type == 'interval' || time.type == 'hourly'){
              dayTimes = null;
            }
            if(time.type == 'weekly'){
              dayTimes = {"0":time.dayOfWeek+"-"+time.time}
            }
            if(time.type == 'monthly'){
              dayTimes = {"0":time.dayOfmonth+"-"+time.time}
            }
            if(time.type =='yearly'){
              dayTimes= {"0": time.month+"-"+time.dayOfmonth+"-"+time.time}
            }
        
            let scheduleObj = {
              ruleName: this.props.name,
              createDate: schedule.startDate.format("MMM DD, YYYY hh:mm:ss a"),
              endDate: (schedule.endDate ? schedule.endDate.format("MMM DD, YYYY hh:mm:ss a") : null),
              ruleScheduleType: time.type,
              ruleSchedule: window.btoa(JSON.stringify({
                dayTimes: dayTimes,
                period: time.period
              })),
              active:true,
            }
            schedulePayloads.push(scheduleObj);
          });
        }
      });
      schedulePayloads.forEach((payload)=>{
        schedulePromiseArray.push(postNewSchedule(payload));
      });
      let rulePayload = {
        name: this.props.name,
        ruleType: this.props.ruleType,
        ruleData: window.btoa(JSON.stringify({
          name: this.props.name,
          targetDirectory: this.props.data.targetDirectory,
          days: this.props.data.days,
          type: this.props.data.type,
          maxDepth: this.props.data.maxDepth,
          ruleToRun: this.props.data.ruleToRun, 
          wildcardString: this.props.data.wildcardString
        })),
        ruleDataType: "JSON",
        active: true,
        ruleClassname: this.props.ruleClassname,
        ruleAction: null,
        description: this.props.description
      }
      schedulePromiseArray.push(postNewRule(rulePayload));
      this.props.openAnimationModal();
      Promise.all(schedulePromiseArray).then(()=>{
        this.props.getRules();
      });

    });    
  }
  openEndDatePicker() {
    this.setState({
      endDatePickerOpen: true,
    });
  }
  closeEndDatePicker() {
    this.setState({
      endDatePickerOpen: false,
    });
  }
  handleEndDateChange = (idx) => (date) => {
    this.setState(prevState => {
      let schedules = prevState.schedules.slice();
      schedules[idx].createDate = date;
      return {
        schedules: schedules,
      }
    });
  }


  // handleChangeScheduleType(e){
  //   let schedule = this.state.schedule;
  //   schedule.ruleScheduleType = e.target.value;
  //   console.log(schedule);
  //   this.setState({schedule});
  // }
  generateScheduleJSX() {
    let scheduleJSX = this.props.schedules.map((schedule, idx) => {
      return (
        <li key={idx} className="scheduleWrapper">
          <a className="remove-schedule" onClick={this.props.removeSchedule.bind(this, idx)}>X</a>
          <div className="label">Rule Start Date and Time:</div>

          <div className="date-entry">
            <img className="calendar-icon" src={CalendarIcon}></img>

            <DatePicker
              margin="none"
              id="mui-pickers-date"
              label=""
              format="MM/DD/YYYY"
              value={this.props.schedules[idx].startDate}
              onChange={this.props.handleDateChange(idx, "startDate")}
              className="tuna-datePicker"
              disableToolbar={true}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />

          </div>
          <div className="time-entry">
            <TextField
              label=""
              type="time"
              defaultValue="00:00"
              className="tuna-timeText"
              name="time"
              value={moment(this.props.schedules[idx].startDate).format("HH:mm")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 900, // 5 min
              }}
              onChange={this.props.handleDateChange(idx, "startDate")}
            />
          </div>
          <div className="end-Date center">
            <span className="label">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.schedules[idx].enableEndDate}
                    onChange={this.props.handleChangeCheckBox(idx, "enableEndDate")}
                    name="enableEndDate"
                    value="enableEndDate"
                    color="#FFBA00"
                    className="checkbox"
                    disableRipple
                    inputProps={{
                      'aria-label': 'secondary checkbox',
                    }}
                  />
                }
              />
              End Date:
            </span>
            {this.props.schedules[idx].enableEndDate &&
              <div className="date-entry">
                <img className="calendar-icon" src={CalendarIcon}></img>
                <DatePicker
                  margin="none"
                  id="mui-pickers-date"
                  label=""
                  format="MM/DD/YYYY"
                  value={this.props.schedules[idx].endDate}
                  onChange={this.props.handleDateChange(idx, "endDate")}
                  disableToolbar={false}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </div>
            }
          </div>
          <div className="end-Date schedule-repeats">
            <span className="label">
              Repeat
            </span>
            <div className="repeats-wrapper">
              <Repeats
                schedule={this.props.schedules[idx]}
                scheduleIdx={idx}
                repeatChange={this.props.repeatChange}
                removeRepeat={this.props.removeRepeat}
                addRepeat={this.props.addRepeat}
              />
              <a className="addTimeButton" onClick={this.props.addRepeat(idx)}>+ Add Time</a>
            </div>
          </div>

        </li>

      );
    });

    return scheduleJSX;

  }


  render() {
    let scheduleJSX = this.generateScheduleJSX();
    return (
      <div className="modal-body">
        <div className="field-section first-fields">
          <div className="field-n-line">
            <div className="field-n">1</div>
            <div className="line"></div>
          </div>
          <div className="field-entry">
            <div className="field-label">Rule Info</div>
            <TextField
              id="standard-name"
              label="Rule Name*"
              name="name"
              className="add-input"
              value={this.props.name}
              onChange={this.props.handleChange}
              margin="normal"
            />
            {/* <input placeholder="" value={this.state.ruleName} className="add-input" name="ruleName" onChange={this.handleChange}></input> */}
            <TextField
              id="standard-description"
              label="Rule Description*"
              multiline
              rows={1}
              rowsMax={3}
              name="description"
              className="add-input"
              value={this.props.description}
              onChange={this.props.handleChange}
              margin="normal"
            />
            {/* <textarea placeholder="Rule Description" value={this.state.ruleDescription} className="add-input" name="ruleruleDescription" onChange={this.handleChange}></textarea> */}
            <TextField
              id="standard-className"
              label="Rule Class Name"
              name="ruleClassname"
              className="add-input"
              value={this.props.ruleClassname}
              onChange={this.props.handleChange}
              margin="normal"
            />
            <TextField
              id="standard-name"
              label="Rule Action"
              name="ruleAction"
              className="add-input"
              value={this.props.ruleAction}
              onChange={this.props.handleChange}
              margin="normal"
            />
          </div>
        </div>
        <div className="field-section">
          <div className="field-n-line">
            <div className="field-n">2</div>
            <div className="line"></div>
          </div>
          <div className="field-entry">
            <div className="field-label">Type</div>
            <div>
              <RadioGroup
                aria-label="ruleType"
                name="ruleType"
                className="tuna-radio"
                value={this.props.ruleType}
                onChange={this.props.handleChange}
              >
                <FormControlLabel value="WATCHFOLDER_RULE" control={<Radio />} label="Watchfolder" />
                <FormControlLabel disabled value="DELETE_N_REQUEST_RULE" control={<Radio />} label="General Delete" />
                <FormControlLabel disabled value="GENERAL_DELETE_RULE" control={<Radio />} label="Delete and Request" />

              </RadioGroup>
            </div>
          </div>
        </div>
        <div className="field-section">
          <div className="field-n-line">
            <div className="field-n">3</div>
            <div className="line"></div>
          </div>
          <ThemeProvider theme={materialTheme}>

            <div className="field-entry">
              <div className="field-label">Schedules <img src={AddScheduleIcon} className="addScheduleButton" onClick={this.props.addSchedule} /></div>
              <ol className="schedule-list">
                {scheduleJSX}

              </ol>
              {/* <div className="scheduleWrapper">
                <div className="date-entry">
                  <img className="calendar-icon" src={CalendarIcon}></img>
                  <DatePicker
                    margin="none"
                    id="mui-pickers-date"
                    label=""
                    format="MM/DD/YYYY"
                    value={this.state.addTime}
                    onChange={this.handleTimeChange("addTime")}
                    className="tuna-datePicker"
                    disableToolbar={true}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </div>
                <div className="end-Date">
                  <span className="label">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.endDateEnable}
                          onChange={this.handleChangeCheckBox("endDateEnable")}
                          name="endDateEnable"
                          value="endDateEnable"
                          color="#FFBA00"
                          className="checkbox"
                          disableRipple
                          inputProps={{
                            'aria-label': 'secondary checkbox',
                          }}
                        />
                      }
                    />
                    End Date:
                    </span>
                  {this.state.endDateEnable &&
                    <div className="date-entry">
                      <img className="calendar-icon" src={CalendarIcon}></img>
                      <DatePicker
                        margin="none"
                        id="mui-pickers-date"
                        label=""
                        format="MM/DD/YYYY"
                        value={this.state.addEndTime}
                        onChange={this.handleTimeChange("addEndTime")}
                        disableToolbar={true}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </div>
                  }
                </div>
              </div> */}
            </div>

          </ThemeProvider>

        </div>
        <div className="field-section first-fields">
          <div className="field-n-line">
            <div className="field-n">4</div>
          </div>
          <div className="field-entry rule-info">
            <div className="field-label">Rule Info</div>
            <TextField
              id="standard-target-directory"
              label="Target Directory*"
              name="targetDirectory"
              className="add-input"
              value={this.props.data.targetDirectory}
              onChange={this.props.handleDataChange}
              margin="normal"
            />
            <TextField
              id="standard-wldcard"
              label="Wildcard String*"
              name="wildcardString"
              className="add-input half"
              value={this.props.data.wildcardString}
              onChange={this.props.handleDataChange}
              margin="normal"
            />
            <FormControl className="add-input half">
              <InputLabel htmlFor="filetype-simple">File Type</InputLabel>
              <Select
                value={this.props.data.type}
                onChange={this.props.handleDataChange}
                inputProps={{
                  name: 'type',
                  id: 'filetype-simple',
                }}
                MenuProps={{
                  className:"tuna-select",
                  MenuListProps:{
                    disableRipple: true,
                  }
                }}
              >
                <MenuItem value={"b"}>block (buffered) special</MenuItem>
                <MenuItem value={"c"}>character (unbuffered) special</MenuItem>
                <MenuItem value={"d"}>directory</MenuItem>
                <MenuItem value={"p"}>named pip (FIFO)</MenuItem>
                <MenuItem value={"f"}>regular file</MenuItem>
                <MenuItem value={"l"}>symbolic link</MenuItem>
                <MenuItem value={"s"}>socket</MenuItem>
                <MenuItem value={"D"}>door (Solaris)</MenuItem>

              </Select>
            </FormControl>
            <TextField
              id="standard-max-depth"
              label="Max Depth"
              type="number"
              name="maxDepth"
              className="add-input half"
              value={this.props.data.maxDepth}
              onChange={this.props.handleDataChange}
              margin="normal"
            />
            <TextField
              id="standard-days"
              label="File Age (in days)"
              type="number"
              name="days"
              className="add-input half"
              value={this.props.data.days}
              onChange={this.props.handleDataChange}
              margin="normal"
            />
            <TextField
              id="standard-host-name"
              label="Host Name"
              name="hostName"
              className="add-input half"
              value={this.props.data.hostName}
              onChange={this.props.handleDataChange}
              margin="normal"
            />

            {/* <input placeholder="" value={this.state.ruleName} className="add-input" name="ruleName" onChange={this.handleChange}></input> */}
            <TextField
              id="standard-backup-directory"
              label="Backup Directory"
              name="moveDirectory"
              className="add-input"
              value={this.props.data.moveDirectory}
              onChange={this.props.handleDataChange}
              margin="normal"
            />
            {/* <textarea placeholder="Rule Description" value={this.state.ruleDescription} className="add-input" name="ruleruleDescription" onChange={this.handleChange}></textarea> */}
            <TextField
              id="standard-rule-to-run"
              label="Rule To Run"
              name="ruleToRun"
              className="add-input"
              value={this.props.data.ruleToRun}
              onChange={this.props.handleDataChange}
              margin="normal"
            />

          </div>
        </div>
        <div className="addRuleButtonWrapper">
            <button className="delete-ui-button" onClick={this.handleSaveClick}>
              <img className="addRuleIcon" src={AddRuleIcon}/>
              Create Rule
            </button>
        </div>
      </div>
    );
  }
}
