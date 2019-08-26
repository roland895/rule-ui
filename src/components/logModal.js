import React, { Component } from "react";
import moment from "moment";
// import RuleForm from "./editForms";
// import TypeIcon from "../assets/type-icon.svg";
// import DateIcon from "../assets/date-icon.svg";
// import LastIcon from "../assets/last-ran-icon-white.svg";
// import ScheduleIcon from "../assets/schedule-icon.svg";
import TextField from '@material-ui/core/TextField';
import EditIcon from "../assets/editIcon.svg";
import EditIconBtn from "../assets/editIconBtn.svg";
import { findStorage } from "../services/utils";
import DescriptionIcon from "../assets/description-icon.svg";
import ExecuteIcon from "../assets/execute-log-icon.svg";
import DeleteIcon from "../assets/deleteIcon.svg";
import { ThemeProvider } from "@material-ui/styles";
import { materialTheme } from './materialUIOverrides';
import MenuItem from '@material-ui/core/MenuItem';
import AddSchedule from "../assets/addSchedule.svg";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandIcon from "../assets/expandIcon.svg";
import WarningIcon from "../assets/warning.svg";
import {getErrorLog, postNewSchedule, editRule, putSchedule} from '../services/deleteRuleService';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {
  DatePicker,
  TimePicker,
} from '@material-ui/pickers';
import Repeats from "../components/formElements/repeats";
import Modal from '@material-ui/core/Modal';

export default class LogModal extends Component {
  constructor(props) {

    super(props);
    this.state = {
      accordianToggleDetails: false,
      accordianToggleLog: false,
      deleteModal: false,
      errors: [],
      OGSchedule: null,
    };
    this.close = this.close.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.preventClose = this.preventClose.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleExpansion = this.handleExpansion.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
  }

  handleExpansion = panel => (event, isExpanded) => {
    this.setState({
      [panel]: isExpanded
    });
  };
  handleDeleteClick() {
    this.setState({
      deleteModal: true
    });
  }
  cancelDelete() {
    this.setState({
      deleteModal: false
    });
  }
  close() {
    this.props.closeRuleDisplayModal();
    this.cancelDelete();
  }
  preventClose(e) {
    e.stopPropagation();
  }

  toggleEdit() {
    this.props.toggleEdit();
  }

  saveHandler() {
    let schedulePayloads = [];
    let schedulePromiseArray = [];

    //Get deleted items 
    let deletedSchedules = [];
    console.log(this.state.OGSchedule);
    let previousScheduleIds = this.state.OGSchedule.map((schedule)=>{return schedule.times})[0].map((scheduleTimes)=>{return scheduleTimes.id});
    let currentScheduleIds = this.props.schedules.map((schedule)=>{return schedule.times})[0].map((scheduleTimes)=>{return scheduleTimes.id});

    previousScheduleIds.forEach((prevId)=>{
      if(currentScheduleIds.indexOf(prevId) == -1){
        deletedSchedules.push(prevId);
      }
    });
    console.log(deletedSchedules);

      


    this.props.schedules.forEach(schedule => {
        schedule.times.forEach((time)=>{
          let dayTimes;
          if (time.type == 'daily') {
            dayTimes = { "0": time.time }
          }
          if (time.type == 'interval' || time.type == 'hourly') {
            dayTimes = null;
          }
          if (time.type == 'weekly') {
            dayTimes = { "0": time.dayOfWeek + "-" + time.time }
          }
          if (time.type == 'monthly') {
            dayTimes = { "0": time.dayOfmonth + "-" + time.time }
          }
          if (time.type == 'yearly') {
            dayTimes = { "0": time.month + "-" + time.dayOfmonth + "-" + time.time }
          }
          let scheduleObj = {
            ruleName: this.props.name,
            createDate: schedule.startDate.format("MMM DD, YYYY hh:mm:ss a"),
            endDate: (schedule.endDate ? schedule.endDate.format("MMM DD, YYYY hh:mm:ss a") : null),
            ruleSchedule: window.btoa(JSON.stringify({
              dayTimes: dayTimes,
              period: time.period
            })),            
            active: schedule.active,
            id: time.id,
          }
          schedulePayloads.push(scheduleObj);
        });
    });
    schedulePayloads.forEach((payload) => {
      if(payload.id){
        schedulePromiseArray.push(putSchedule(payload));

      }else{
        schedulePromiseArray.push(postNewSchedule(payload));
      }
    });
    let rulePayload = {
      id: this.props.id,
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
    schedulePromiseArray.push(editRule(rulePayload));
    //this.props.openAnimationModal();
    Promise.all(schedulePromiseArray).then(() => {
      this.props.getRules();
    });
    this.props.disableEdit();
  }

  makeLogTableJSX() {
    let jsxArray = [];

    for (let i = 0; this.state.errors.length > i; i++) {

      jsxArray.push(<tr>
        <th>{moment(this.state.errors[i].dateOccurred).format("MM/DD/YYYY hh:immA")}</th>
        <th>{this.state.errors[i].errorMessage}</th>
      </tr>);

    }
    if (jsxArray.length == 0) {
      jsxArray.push(<tr>
        <th></th>
        <th></th>
      </tr>);
    }

    return jsxArray;
  }

  componentDidUpdate(prevProps) {

    if (this.props.selectedRule && prevProps.selectedRule && prevProps.selectedRule.name !== this.props.selectedRule.name || (prevProps.selectedRule == null && this.props.selectedRule)) {
      getErrorLog(this.props.selectedRule.name).then((data) => {
        this.setState({
          errors: data,
        });
      });
      this.setState({
        OGSchedule: this.props.schedules
      });
    }
    
  }

  componentDidMount() {
    if (this.props.selectedRule) {
      getErrorLog(this.props.selectedRule.name).then((data) => {
        this.setState({
          errors: data,
        });
      });
      this.setState({
        OGSchedule: this.props.schedules
      });

    }
  }
  generateScheduleJSX() {
    let JSX = [];
    this.props.schedules.forEach((schedule, scheduleIdx) => {
      let unEditSchedule;
      let unEditRepeats = "";
      let timesN = schedule.times.length;
      schedule.times.forEach((time, idx) => {
        let everyString;
        switch (time.type) {
          case "interval":
            everyString = "every" + time.period + "minutes";
            break;
          case "hourly":
            everyString = "every hour";
            break;
          case "daily":
            everyString = "every  " + time.time;
            break;
          case "weekly":
            everyString = "every " + time.dayOfWeek;
            break;
          case "monthly":
            everyString = "every " + time.dayOfmonth;
            break;

        }


        if (timesN == 1) {
          unEditRepeats += time.type + " > " + everyString
        } else if (timesN !== idx) {
          unEditRepeats += time.type + " > " + everyString + ", "
        } else {
          unEditRepeats += time.type + " > " + everyString
        }

      });

      unEditSchedule =
        <li key={scheduleIdx}>
          <div className="itemRow">
            <span className="label">Start Date:</span>
            <span>
              {moment(schedule.startDate).format("MM/DD/YYYY hh:mmA")}
            </span>
          </div>
          <div className="itemRow">

            <span className="label">End Date:</span>
            <span>
              {(schedule.endDate) &&
                moment(schedule.endDate).format("MM/DD/YYYY hh:mmA")
              }
              {(!schedule.endDate) &&
                "None"
              }
            </span>
          </div>
          <div className="itemRow">

            <span className="label">Repeat:</span>
            <span>
              {(schedule.endDate) &&
                moment(schedule.endDate).format("MM/DD/YYYY hh:mmA")
              }
              {(!schedule.endDate) &&
                "None"
              }
            </span>
          </div>
        </li>

      let scheduleJSX = <li className="schedule-item" key={scheduleIdx}>
        {(this.props.isEdit) && 
          <a className="remove-schedule" onClick={this.props.removeSchedule.bind(this, scheduleIdx)}>X</a>
        }
        <div className="number">{scheduleIdx + 1}.</div>
        <div className="itemRow">
          <span class="schedule-label" >
            Start Date:
          </span>
          {(!this.props.isEdit) &&
            <span>{moment(schedule.startDate).format("MM/DD/YYYY hh:mmA")}</span>
          }
          {this.props.isEdit &&
            <DatePicker
              margin="none"
              id="mui-pickers-date"
              label=""
              format="MM/DD/YYYY"
              value={this.props.schedules[scheduleIdx].startDate}
              onChange={this.props.handleDateChange(scheduleIdx, "startDate")}
              className="tuna-datePicker"
              disableToolbar={true}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          }
          {this.props.isEdit &&
            <TextField
              label=""
              type="time"
              defaultValue="00:00"
              className="tuna-timeText"
              name="time"
              value={moment(this.props.schedules[scheduleIdx].startDate).format("HH:mm")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 900, // 5 min
              }}
              onChange={this.props.handleDateChange(scheduleIdx, "startDate")}
            />
            // <TimePicker
            //   label=""
            //   value={this.props.schedules[scheduleIdx].startDate}
            //   onChange={this.props.handleDateChange(scheduleIdx, "startDate")}
            //   disableToolbar={false}
            //   className="tuna-timePicker"
            // />
          }
        </div>
        <div className="itemRow">
          <span class="schedule-label" >
            End Date:
          </span>
          {(!this.props.isEdit) &&
            <span>{moment(schedule.endDate).format("MM/DD/YYYY hh:mmA")}</span>
          }
          {this.props.isEdit &&
            <DatePicker
              margin="none"
              id="mui-pickers-date"
              label=""
              format="MM/DD/YYYY"
              value={this.props.schedules[scheduleIdx].endDate}
              onChange={this.props.handleDateChange(scheduleIdx, "endDate")}
              className="tuna-datePicker"
              disableToolbar={true}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          }
        </div>
        <div className="itemRow">
          <span class="schedule-label" >
            Repeat:
          </span>
          {(!this.props.isEdit) &&

            <span>{unEditRepeats}</span>
          }
          {this.props.isEdit &&

            <Repeats
              schedule={this.props.schedules[scheduleIdx]}
              scheduleIdx={scheduleIdx}
              repeatChange={this.props.repeatChange}
              removeRepeat={this.props.removeRepeat}
              addRepeat={this.props.addRepeat}
            />

          }
          {this.props.isEdit &&
            <a className="addTimeButton" onClick={this.props.addRepeat(scheduleIdx)}>+ Add Time</a>
          }
        </div>
      </li>
      JSX.push(scheduleJSX);

    });
    return JSX;
  }
  generateScheduleJSX2() {
    let JSX = [];
    this.props.schedules.forEach((schedule, scheduleIdx) => {
      JSX.push('tuna');
    });
  }

  render() {
    let logTable = (this.props.selectedRule ? this.makeLogTableJSX() : '');
    let scheduleList = (this.props.selectedRule ? this.props.selectedRule.schedule.map(schedule => schedule.ruleScheduleType).join(', ') : "");
    let scheduleJSX = this.generateScheduleJSX();
    let ruleName = (this.props.selectedRule ? this.props.selectedRule.name : '');
    return (
      <ThemeProvider theme={materialTheme}>
        <div className="modal-content" onClick={this.preventClose}>
          <div className="modal-header">
            <img src={EditIcon}></img>
            {(this.props.selectedRule && !this.props.isEdit) &&
              <span>{this.props.selectedRule.name}</span>
            }
            {(this.props.selectedRule && this.props.isEdit) &&
              <TextField
                id="standard-description"
                label=""
                name="name"
                className="add-input header"
                value={this.props.name}
                onChange={this.props.handleChange}
                margin="normal"
              />
            }
            <div className="modal-close" onClick={this.props.closeRuleDisplayModal}>
              x
            </div>
          </div>
          {(this.props.selectedRule) &&
            <div className="modal-body log">
              <div className="rule-details">
                <ul className="rule-details-list left">
                  <li>
                    <span className="label">Rule Type</span>
                    {(!this.props.isEdit && this.props.selectedRule) &&
                      <p>
                        {this.props.ruleType}
                      </p>
                    }
                    {this.props.isEdit &&
                      <Select
                        value={this.props.ruleType}
                        onChange={this.props.handleChange}
                        inputProps={{
                          name: 'ruleType',
                          id: 'schedule-type',
                        }}
                        className="tuna-dropdown"
                      >
                        <MenuItem value="WATCHFOLDER_RULE">Watchfolder Rule</MenuItem>
                        <MenuItem value="DELETE_N_REQUEST_RULE" disabled>Delete and Request Rule</MenuItem>
                        <MenuItem value="GENERAL_DELETE_RULE" disabled>General Delete Rule</MenuItem>
                      </Select>
                    }
                  </li>
                  <li>
                    <span className="label">Target Directory</span>
                    {(!this.props.isEdit && this.props.selectedRule) &&
                      <p>
                        {this.props.data.targetDirectory}
                      </p>
                    }
                    {this.props.isEdit &&
                      <TextField
                        id="standard-name"
                        label=""
                        name="targetDirectory"
                        className="add-input"
                        value={this.props.data.targetDirectory}
                        onChange={this.props.handleDataChange}
                        margin="normal"
                      />
                    }
                  </li>
                  <li>
                    <span className="label">Last Ran Date</span>
                    <p>
                      {moment(this.props.selectedRule.log.lastRanDate).format("MM/DD/YYYY")}
                    </p>
                  </li>
                  <li>
                    <span class="label">Wildcard String</span>
                    {(!this.props.isEdit && this.props.selectedRule) &&
                      <p>
                        {this.props.data.wildcardString}
                      </p>
                    }
                    {this.props.isEdit &&
                      <TextField
                        id="standard-name"
                        label=""
                        name="wildcardString"
                        className="add-input"
                        value={this.props.data.wildcardString}
                        onChange={this.props.handleDataChange}
                        margin="normal"
                      />
                    }

                  </li>
                  <li>
                    <span className="label">Rule Description</span>
                    {(!this.props.isEdit && this.props.selectedRule) &&
                      <p>
                        {this.props.selectedRule.description}
                      </p>
                    }
                    {this.props.isEdit &&
                      <TextField
                        id="standard-description"
                        label=""
                        multiline
                        rows={1}
                        rowsMax={3}
                        name="description"
                        className="add-input"
                        value={this.props.description}
                        onChange={this.props.handleChange}
                        margin="normal"
                      />
                    }
                  </li>
                </ul>
                <ul className="rule-details-list right">
                  <li>
                    <span className="label">
                      Schedule
                  </span>
                    {this.props.isEdit &&
                      <span className="add-Schedule" onClick={this.props.addSchedule}>
                        <img src={AddSchedule}>
                        </img>
                        Add Schedule
                    </span>
                    }
                    <div className="schedule-wrapper">
                      <ul>
                        {scheduleJSX}
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <ExpansionPanel expanded={this.state.accordianToggleDetails} onChange={this.handleExpansion('accordianToggleDetails')}>
                <ExpansionPanelSummary
                  expandIcon={<img src={ExpandIcon}></img>}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  Advanced Metadata
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className="rule-details">
                    <ul className="rule-details-list left">
                      <li>
                        <span className="label">Days</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.data.days}
                          </p>
                        }
                        {this.props.isEdit &&
                          <TextField
                            id="standard-name"
                            label=""
                            name="days"
                            className="add-input"
                            type="number"
                            value={this.props.data.days}
                            onChange={this.props.handleDataChange}
                            margin="normal"
                          />
                        }
                      </li>
                      <li>
                        <span className="label">Host Name</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.data.hostname}
                          </p>
                        }
                        {this.props.isEdit &&
                          <TextField
                            id="standard-name"
                            label=""
                            name="hostname"
                            className="add-input"
                            value={this.props.data.hostname}
                            onChange={this.props.handleDataChange}
                            margin="normal"
                          />
                        }
                      </li>
                      <li>
                        <span className="label">Rule Action</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.ruleAction}
                          </p>
                        }
                        {this.props.isEdit &&
                          <TextField
                            id="standard-name"
                            label=""
                            name="ruleAction"
                            className="add-input"
                            value={this.props.ruleAction}
                            onChange={this.props.handleChange}
                            margin="normal"
                          />
                        }

                      </li>
                      <li>
                        <span className="label">Rule Class</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.selectedRule.ruleClassname}
                          </p>
                        }
                        {this.props.isEdit &&
                          <TextField
                            id="standard-description"
                            label=""
                            name="ruleClassname"
                            className="add-input"
                            value={this.props.ruleClassname}
                            onChange={this.props.handleChange}
                            margin="normal"
                          />
                        }
                      </li>
                      <li>
                        <span className="label">File type</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.data.type}
                          </p>
                        }
                        {this.props.isEdit &&
                        <FormControl className="add-input">
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
                        }
                      </li>
                    </ul>
                    <ul className="rule-details-list right">
                      <li>
                        <span className="label">Rule Establish Date</span>
                        <p>
                          {moment(this.props.ruleDate).format("MM/DD/YYYY")}
                        </p>

                      </li>
                      <li>
                        <span className="label">Rule to Run</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.data.ruleToRun}
                          </p>
                        }
                        {this.props.isEdit &&
                          <TextField
                            id="standard-name"
                            label=""
                            name="ruleToRun"
                            className="add-input"
                            value={this.props.data.ruleToRun}
                            onChange={this.props.handleDataChange}
                            margin="normal"
                          />
                        }
                      </li>
                      <li>
                        <span className="label">Max Depth</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.data.maxDepth}
                          </p>
                        }
                        {this.props.isEdit &&
                          <TextField
                            id="standard-name"
                            label=""
                            type="number"
                            name="maxDepth"
                            className="add-input"
                            value={this.props.data.maxDepth}
                            onChange={this.props.handleDataChange}
                            margin="normal"
                          />
                        }
                      </li>
                      <li>
                        <span className="label">Move Directory</span>
                        {(!this.props.isEdit && this.props.selectedRule) &&
                          <p>
                            {this.props.data.moveDirectory}
                          </p>
                        }
                        {this.props.isEdit &&
                          <TextField
                            id="standard-name"
                            label=""
                            name="moveDirectory"
                            className="add-input"
                            value={this.props.data.moveDirectory}
                            onChange={this.props.handleDataChange}
                            margin="normal"
                          />
                        }
                      </li>
                    </ul>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={this.state.accordianToggleLog} onChange={this.handleExpansion('accordianToggleLog')}>
                <ExpansionPanelSummary
                  expandIcon={<img src={ExpandIcon}></img>}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  Rule Error Log
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className="rule-execute-log">
                    <table className="log-table">
                      <tbody>
                        <tr>
                          <th>Date</th>
                          <th>Error Message</th>
                        </tr>
                        {logTable}
                      </tbody>
                    </table>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <div className="button-wrapper">
                <div className="delete-button" onClick={this.handleDeleteClick}>
                  <img src={DeleteIcon}></img>
                  Delete
              </div>
                {!this.props.isEdit &&
                  <div className="edit-button" onClick={this.toggleEdit}>
                    <img src={EditIconBtn}></img>
                    Edit
              </div>
                }
                {this.props.isEdit &&
                  <div className="edit-button" onClick={this.saveHandler}>
                    <img src={EditIconBtn}></img>
                    Save
                </div>
                }
              </div>
            </div>
          }
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.deleteModal}
          onClose={this.cancelDelete}
          onClick={this.preventClose}
        >
          <div style={{
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
          }} className="deleteModal">
            <p id="simple-modal-description">
              Are you sure to delete the "{ruleName}" Rule?
            </p>
            <img src={WarningIcon}></img>
            <div className="button-wrapper">
              <div className="delete-button" onClick={this.close}>
                Delete
                </div>
              <div className="edit-button" onClick={this.cancelDelete}>
                Cancel
                </div>
            </div>
          </div>
        </Modal>
      </ThemeProvider>
    );
  }
}
