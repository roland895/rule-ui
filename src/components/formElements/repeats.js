
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DayPicker from "./dayPicker";
import Select from '@material-ui/core/Select';
import RemoveIcon from "../../assets/removeIcon.svg";

import React, { Component } from "react";

export default class Repeats extends Component {
  constructor(props) {

    super(props);


  }
  componentDidMount() {
    // this.setState({
    //   pickedDay: this.props.selectedDay
    // });
  }


  render() {
    let JSX = [];
    let schedule = this.props.schedule;
    let scheduleIdx = this.props.scheduleIdx;
    schedule.times.forEach((time, idx) => {
      // time: dayTime,
      // type: schedule.ruleScheduleType,
      // dayOfWeek: "Monday",
      // dayOfmonth: 1,
      // period: schedule.ruleSchedule.period
      let type = time.type;
      let conditionalJSX = "tuna"
      switch (type) {
        case "interval":
          conditionalJSX = <div key={idx} className="time-entry">
            <TextField
              label="period"
              type="number"
              defaultValue="0"
              className="tuna-timeText period"

              name="period"
              value={schedule.times[idx].period}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1, // 5 min
              }}
              onChange={this.props.repeatChange(scheduleIdx, idx, "period")}

            />
          </div>

          break;
        case "hourly":
          conditionalJSX = <div key={idx} className="time-entry">
            <TextField
              label="period"
              type="number"
              defaultValue="0"
              className="tuna-timeText period"

              name="period"
              value={schedule.times[idx].period}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1, // 5 min
              }}
              onChange={this.props.repeatChange(scheduleIdx, idx, "period")}

            />
          </div>

          break;
        case "daily":
          conditionalJSX = <div key={idx} className="time-entry">

            <TextField
              label=""
              type="time"
              defaultValue="00:00"
              className="tuna-timeText"

              name="time"
              value={schedule.times[idx].time}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 900, // 5 min
              }}
              onChange={this.props.repeatChange(scheduleIdx, idx, "time")}

            />
          </div>;
          break;
        case "weekly":
          conditionalJSX =
            <div key={idx} className="period-entry">
              <div className="time-entry">
                <TextField
                  label=""
                  type="time"
                  defaultValue="00:00"
                  className="tuna-timeText"
                  name="time"
                  value={schedule.times[idx].time}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 900, // 5 min
                  }}
                  onChange={this.props.repeatChange(scheduleIdx, idx, "time")}
                />
              </div>
              <DayPicker
                dayClick={this.props.repeatChange(scheduleIdx, idx, "dayOfWeek")}
                selectedDay={schedule.times[idx].dayOfWeek}
              >
              </DayPicker>
            </div>;

          break;
        case "monthly":
          conditionalJSX =
            <div key={idx} className="period-entry">
              <div className="time-entry">
                <TextField
                  label=""
                  type="time"
                  defaultValue="00:00"
                  className="tuna-timeText"
                  name="time"
                  value={schedule.times[idx].time}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 900, // 5 min
                  }}
                  onChange={this.props.repeatChange(scheduleIdx, idx, "time")}
                />
              </div>
              <TextField
                label="Day"
                type="number"
                defaultValue={1}
                className="tuna-timeText day"
                name="dayOfmonth"
                value={schedule.times[idx].dayOfmonth}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: 31, // 5 min
                }}
                onChange={this.props.repeatChange(scheduleIdx, idx, "dayOfmonth")}
              />
            </div>;

          break;
      case "yearly":
        conditionalJSX =
            <div key={idx} className="period-entry">
              <TextField
                label="Month"
                type="number"
                defaultValue={1}
                className="tuna-timeText month"
                name="month"
                value={schedule.times[idx].month}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: 12, // 5 min
                }}
                onChange={this.props.repeatChange(scheduleIdx, idx, "dayOfmonth")}
              />
                          <TextField
                label="Day"
                type="number"
                defaultValue={1}
                className="tuna-timeText day"
                name="dayOfmonth"
                value={schedule.times[idx].dayOfmonth}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: 31, // 5 min
                }}
                onChange={this.props.repeatChange(scheduleIdx, idx, "dayOfmonth")}
              />
              <div className="time-entry">
                <TextField
                  label=""
                  type="time"
                  defaultValue="00:00"
                  className="tuna-timeText"
                  name="time"
                  value={schedule.times[idx].time}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 900, // 5 min
                  }}
                  onChange={this.props.repeatChange(scheduleIdx, idx, "time")}
                />
              </div>
            </div>;
            

          break;
      }
      let timeJSX =
        <div key={idx} className="repeat-item">
          <div className="end-Date">
            <img src={RemoveIcon} className="remove-icon" onClick={() => { this.props.removeRepeat(scheduleIdx, idx) }} />
            <Select
              value={schedule.times[idx].type}
              onChange={this.props.repeatChange(scheduleIdx, idx, "type")}
              inputProps={{
                name: 'ruleScheduleType',
                id: 'schedule-type',
              }}
              className="type-selector"
            >
              <MenuItem value="interval">Interval</MenuItem>
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>

            </Select>
            {conditionalJSX}
          </div>
        </div>
      JSX.push(timeJSX);
    });
    return JSX;
  }

}