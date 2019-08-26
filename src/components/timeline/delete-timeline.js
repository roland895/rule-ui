import React, {Component} from "react";
import moment from 'moment';
import "../../styles/timeline.scss";
import  {hasDayTimes} from "../../services/utils";


export default class DeleteRuleTimeline extends Component {
  constructor(props){
    super(props);
    this.state = {
      timelineStart:moment().subtract(1, 'day'),
      timelineEnd: moment().add(1, 'day')
    }
  }
  
  componentDidMount(){
    this.centerTimeline();
    this.clickAndDrag();
  }
  centerTimeline(){
    let timelineWidth = document.querySelector(".lineWrapper").offsetWidth;
    document.querySelector(".timelineWrapper").scrollLeft = timelineWidth/2 - window.innerWidth/2
    // var mouseWheelEvt = function (event) {
    //   if (event.currentTarget.doScroll)
    //     event.currentTarget.doScroll(event.wheelDelta>0?"left":"right");
    //   else if ((event.wheelDelta || event.detail) > 0)
    //     event.currentTarget.scrollLeft -= 20;
    //   else
    //     event.currentTarget.scrollLeft += 20;
  
    //   return false;
    // }
    //document.querySelector(".timelineWrapper").addEventListener("mousewheel", mouseWheelEvt);

  }
  //code taken from internet for click and drag
  clickAndDrag(){
    const slider = document.querySelector('.timelineWrapper');
    let isDown = false;
    let startX;
    let scrollLeft;
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX); //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }
  addRuleEvents(timeStart, timeEnd){
    let ruleRunTime;
    let rulesJSX = [];
    let runTimes = [];
    let events = [];

    this.props.deleteRules.forEach((rule)=>{

      let addToEventList = function(){
        if(ruleRunTime.isBetween(timeStart, timeEnd)){
          if(runTimes.indexOf(ruleRunTime.format()) === -1){
            runTimes.push(ruleRunTime.format());
            events.push({
              eventTime: ruleRunTime,
              ruleStorage: [rule.ruleData.targetDirectory.split("/")[2]],
              name: [rule.name],
              rules: [rule]
            });
          }
          else{
  
            events.some((event,idx, arr)=>{
              if(event.eventTime.format() === ruleRunTime.format()){
                arr[idx].ruleStorage.push(rule.ruleData.targetDirectory.split("/")[2]);
                arr[idx].name.push(rule.name);
                arr[idx].rules.push(rule)
              } 
              return event.eventTime.format() === ruleRunTime.format()
            });
  
          }
        }
      };
      if(rule.schedule !== undefined){
        let ruleCreation = moment(rule.ruleDate);
        let ruleEndDate = moment("01-01-3000", "MM-DD-YYYY");
        rule.schedule.forEach((schedule)=>{
          if(schedule.endDate){
            ruleEndDate = moment(schedule.endDate);
          }
          let ruleSchedule
          if(hasDayTimes.indexOf(schedule.ruleScheduleType) !== -1){
            ruleSchedule = Object.keys(schedule.ruleSchedule.dayTimes).map(function(key) {
              return [key, schedule.ruleSchedule.dayTimes[key]];
            });
          }else{
            ruleSchedule = [schedule.ruleSchedule.period];
          }
          if(moment(schedule.createDate).isBefore(timeStart) && moment(schedule.endDate).isAfter(timeEnd)){
            if(schedule.ruleScheduleType == 'interval' || schedule.ruleScheduleType == 'hourly'){
              let future24hour = timeEnd;    
              let currentTime = timeStart;
              ruleSchedule.forEach(period=>{
                let indexStart = currentTime.clone().minute(0).second(0);
                let indexHour = indexStart.clone().add(1, 'hour');
                // if(schedule.ruleScheduleType == 'interval'){
                //   let scheduleTime = indexStart.add(period,"minutes")
                //   while(indexStart.isBefore(future24hour)){
                //     if(scheduleTime.isAfter(currentTime)){
                //       if(scheduleTime.isAfter(indexHour)){
                //         indexStart.add(1,'hour');
                //         scheduleTime = indexStart.clone().minute(0).second(0);
                        
                //       }
                //       else{
                //         ruleRunTime= scheduleTime;
                        
                //         addToEventList();
                //       }
                //     }else{
                //       indexStart.add(1,'hour');
                //       scheduleTime = indexStart.clone().minute(0).second(0);
                //     }
                //     scheduleTime.add(period, "minutes");
                //   }
                // }
                if(schedule.ruleScheduleType == 'hourly'){
                  let scheduleTime = timeStart.clone().hour(0).second(0).add(period,"minutes");
                  // while (indexStart.isBefore(future24hour)) {
                  //   //if(scheduleTime.isAfter(currentTime)){

                  //   ruleRunTime = scheduleTime;

                  //   addToEventList();
                  //   // }
                  //   indexStart.add(1, 'hour');
                  //   scheduleTime = indexStart.clone().minute(0).second(0);

                  // }
                }
              })
            }

            if(schedule.ruleScheduleType == 'daily'){
              // addToJSX(rule, ruleSchedule)
              ruleSchedule.forEach(dayTimes=>{
                let hour = dayTimes[1].split(":")[0];
                let minute = dayTimes[1].split(":")[1];
                ruleRunTime = timeStart.clone().hour(hour).minute(minute).second(0);

                addToEventList();
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
                  ruleRunTime = timeStart.clone().startOf('week').hour(hour).minute(minute).second(0).day(day);
                  addToEventList();
  
                }); 
              }
              if(schedule.ruleScheduleType === 'monthly'){
                ruleSchedule.forEach(time => {
                  let date = time[1].split("-")[0];
                  let hour = time[1].split("-")[1].split(":")[0];
                  let minute = time[1].split("-")[1].split(":")[1];
                  ruleRunTime = timeStart.clone().startOf('month').hour(hour).minute(minute).second(0).date(date);
                  addToEventList();
                });
              }
  
  
            
          }else{
            console.log(
              "timeStart: " +  timeStart.format() + "/n" +
              "timeEnd: " + timeEnd.format() + "/n" 
            );
          }
        });
      }
    });
    events.forEach((event)=>{
      let ruleClass = "before";
      if(event.eventTime.isAfter(moment())){
        ruleClass = "after";
      }
      let rulez = [];
      event.rules.forEach((rule, idx)=>{
        rulez.push(
          <div className={(idx !== event.rules.length-1)? "ruleWrapper" : "ruleWrapper last"} onClick={() => this.props.selectRule(rule)}>
            <div className="rule-name">
              <p>
              {event.ruleStorage[idx]}
              </p>
              <p>
                {event.name[idx]}
              </p>
            </div>
          </div>
        )
      });
      rulesJSX.push(<div data-timestart={event.eventTime} style={{left: (100*event.eventTime.diff(timeStart, "minutes")/60)-40 + "px"}} className={"delete-rule-event " + ruleClass}>
        {rulez}
        <div className="marker"></div>
      </div>);
    });

    return rulesJSX;
  }
  buildLineJSX(timeStart, timeEnd) {
    let timeIndex = timeStart.clone();
    let lineJSX = [];
    let labelDistance;
    while(timeIndex.isBefore(moment())){
      let rules;//rule jsx
      let timeChunkEnd = timeIndex.clone().add(1, "hour");
      labelDistance = (100*(timeIndex.clone().minute(0).second(0).diff(timeIndex, "minutes")/60))-21;
      let line = <div className="line before"></div>;
      rules = this.addRuleEvents(timeIndex, timeChunkEnd);
      if(timeChunkEnd.isAfter(moment())){
        lineJSX.push(<div className="hour-wrapper past" key={timeIndex}>        
          <div style={{width: 100 * moment().diff(timeIndex, "minutes")/60 + "px"}} className="line before"></div>
          <div style={{width: 100 * timeChunkEnd.diff(moment(), 'minutes')/60 + 2 + "px", left:100 * moment().diff(timeIndex, "minutes")/60 + "px"}} className="line after"></div>
          <div style={{left: 100 * moment().diff(timeIndex, "minutes")/60 + "px"}} className="current-marker"></div>
          <div style={{left: labelDistance+'px'}} className="hour-label">
            {timeIndex.format('hhA')}
          </div>
          {rules}
        </div>);
      }else{
        lineJSX.push(<div className="hour-wrapper past" key={timeIndex}>        
        {line}
        <div style={{left: labelDistance+'px'}} className="hour-label">
          {timeIndex.format('hhA')}
        </div>
        {rules}

      </div>);
      }
      timeIndex.add(1, "hour");
    }
    while(timeIndex.isBefore(timeEnd)){
      let rules;//rule jsx
      rules = this.addRuleEvents(timeIndex, timeIndex.clone().add(1, "hour"));

      let line = <div className="line after"></div>;
      lineJSX.push(<div className="hour-wrapper after" key={timeIndex}>        
        {line}
        <div style={{left: labelDistance+'px'}} className="hour-label">
          {timeIndex.format('hhA')}
        </div>
        {rules}
      </div>)
      timeIndex.add(1, "hour");
    }
    return lineJSX;
  }
  render() {
    let line = this.buildLineJSX(this.state.timelineStart, this.state.timelineEnd);
    return <div className="timelineWrapper">
      <div className="lineWrapper">
        {line}
      </div>
    </div>;
  }
}