import React, {Component} from "react";
export default class DayPicker extends Component {
  constructor(props){

    super(props);


  }
  componentDidMount(){
    // this.setState({
    //   pickedDay: this.props.selectedDay
    // });
  }

  render(){
    const pickedDay = this.props.selectedDay;
    return(
      <div className="day-picker">
        <button className={"day " + (pickedDay == "Sunday" ? "selected":"")} value="Sunday" onClick={this.props.dayClick}>
          S
        </button>
        <button className={"day " + (pickedDay == "Monday" ? "selected":"")} value="Monday" onClick={this.props.dayClick}>
          M
        </button>
        <button className={"day " + (pickedDay == "Tuesday" ? "selected":"")} value="Tuesday" onClick={this.props.dayClick}>
          T
        </button>
        <button className={"day " + (pickedDay == "Wednesday" ? "selected":"")} value="Wednesday" onClick={this.props.dayClick}>
          W
        </button>
        <button className={"day " + (pickedDay == "Thursday" ? "selected":"")} value="Thursday" onClick={this.props.dayClick}>
          T
        </button>
        <button className={"day " + (pickedDay == "Friday" ? "selected":"")} value="Friday" onClick={this.props.dayClick}>
          F
        </button>
        <button className={"day " + (pickedDay == "Saturday" ? "selected":"")} value="Saturday" onClick={this.props.dayClick}>
          S
        </button>
      </div>
    );
  }
}
