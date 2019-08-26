import moment from 'moment';

export let getRulesPromise = new Promise((res, rej)=>{
  let parsedData;
  fetch("http://localhost:8151/rule-mgmt/rules").then((response)=>{
    return response.json();
  }).then((data)=>{
    parsedData = Object.values(data);
    Object.values(data).forEach((rule, idx)=>{
      parsedData[idx].ruleData = JSON.parse(window.atob(rule.ruleData));
    });

    res(parsedData);
  });
  // setTimeout(()=>{
  //   res([
  //     {
  //       active: true,
  //       id:1,
  //       name: "rule name 1",
  //       ruleDescription: 'test description',
  //       ruleType:"WATCHFOLDER_RULE",
  //       ruleData: {
  //         name:'watchFolderRule1',
  //         hostname: '10.134.43.28',
  //         targetDirectory: "/media/DVS-RT1/DC/VENICE/Mediator_GMO_Playlist/",
  //         moveDirectory: "/media/DVS-RT1/DC/backup",
  //         days:10,
  //         type: "f",
  //         maxDepth: 3,
  //         wildcardString: "mac",
  //         ruleToRun: "/home/Scripts/remove_files_dvsg.sh"
  //       },
  //       ruleDataType: 'JSON',
  //       ruleDate: "2019-06-06T23:48:01Z",
  //       ruleClassname:"com.nbcuni.ont.rule.mgmt.watchfolder.domain.WatcherFolderConfiguration",
  //       ruleAction:"com.nbcuni.ont.test.TestBusinessAction",
  //     },
  //     {
  //       active: true,
  //       id:2,
  //       name: "rule name 2",
  //       ruleDescription: 'test description',
  //       ruleType:"WATCHFOLDER_RULE",
  //       ruleData: {
  //         name:'watchFolderRule2',
  //         hostname: '10.134.43.28',
  //         targetDirectory: "/media/DVS-RT1/DC/VENICE/Mediator_GMO_Playlist/",
  //         moveDirectory: "/media/DVS-RT1/DC/backup",
  //         days:10,
  //         type: "f",
  //         maxDepth: 3,
  //         wildcardString: "mac",
  //         ruleToRun: "/home/Scripts/remove_files_dvsg.sh"
  //       },
  //       ruleDataType: 'JSON',
  //       ruleDate: "2019-06-04T23:48:01Z",
  //       ruleClassname:"com.nbcuni.ont.rule.mgmt.watchfolder.domain.WatcherFolderConfiguration",
  //       ruleAction:"com.nbcuni.ont.test.TestBusinessAction",
  //     },
  //     {
  //       active: true,
  //       id:3,
  //       name: "rule name 3",
  //       ruleDescription: 'test description',
  //       ruleType:"WATCHFOLDER_RULE",
  //       ruleData: {
  //         name:'watchFolderRule3',
  //         hostname: '10.134.43.28',
  //         targetDirectory: "/media/DVS-RT1/DC/VENICE/Mediator_GMO_Playlist/",
  //         moveDirectory: "/media/DVS-RT1/DC/backup",
  //         days:10,
  //         type: "f",
  //         maxDepth: 3,
  //         wildcardString: "mac",
  //         ruleToRun: "/home/Scripts/remove_files_dvsg.sh"
  //       },
  //       ruleDataType: 'JSON',
  //       ruleDate: "2019-06-05T23:48:01Z",
  //       ruleClassname:"com.nbcuni.ont.rule.mgmt.watchfolder.domain.WatcherFolderConfiguration",
  //       ruleAction:"com.nbcuni.ont.test.TestBusinessAction",
  //     },
  //     {
  //       active: true,
  //       id:4,
  //       name: "rule name 4",
  //       ruleDescription: 'test description',
  //       ruleType:"WATCHFOLDER_RULE",
  //       ruleData: {
  //         name:'watchFolderRule4',
  //         hostname: '10.134.43.28',
  //         targetDirectory: "/media/DVS-RT1/DC/VENICE/Mediator_GMO_Playlist/",
  //         moveDirectory: "/media/DVS-RT1/DC/backup",
  //         days:10,
  //         type: "f",
  //         maxDepth: 3,
  //         wildcardString: "mac",
  //         ruleToRun: "/home/Scripts/remove_files_dvsg.sh"
  //       },
  //       ruleDataType: 'JSON',
  //       ruleDate: "2019-06-03T23:48:01Z",
  //       ruleClassname:"com.nbcuni.ont.rule.mgmt.watchfolder.domain.WatcherFolderConfiguration",
  //       ruleAction:"com.nbcuni.ont.test.TestBusinessAction",
  //     },
  //     {
  //       active: true,
  //       id:5,
  //       ruleName: "rule name 5",
  //       ruleDescription: 'test description',
  //       ruleType:"WATCHFOLDER_RULE",
  //       ruleData: {
  //         name:'watchFolderRule5',
  //         hostname: '10.134.43.28',
  //         targetDirectory: "/media/DVS-RT1/DC/VENICE/Mediator_GMO_Playlist/",
  //         moveDirectory: "/media/DVS-RT1/DC/backup",
  //         days:10,
  //         type: "f",
  //         maxDepth: 3,
  //         wildcardString: "mac",
  //         ruleToRun: "/home/Scripts/remove_files_dvsg.sh"
  //       },
  //       ruleDataType: 'JSON',
  //       ruleDate: "2019-06-02T23:48:01Z",
  //       ruleClassname:"com.nbcuni.ont.rule.mgmt.watchfolder.domain.WatcherFolderConfiguration",
  //       ruleAction:"com.nbcuni.ont.test.TestBusinessAction",
  //     },
  //     {
  //       active: true,
  //       id:6,
  //       ruleName: "rule name 6",
  //       ruleDescription: 'test description',
  //       ruleType:"WATCHFOLDER_RULE",
  //       ruleData: {
  //         name:'watchFolderRule6',
  //         hostname: '10.134.43.28',
  //         targetDirectory: "/media/ISILON2/DC/VENICE/Mediator_GMO_Playlist/",
  //         moveDirectory: "/media/ISILON2/DC/backup",
  //         days:10,
  //         type: "f",
  //         maxDepth: 3,
  //         wildcardString: "mac",
  //         ruleToRun: "/home/Scripts/remove_files_dvsg.sh"
  //       },
  //       ruleDataType: 'JSON',
  //       ruleDate: "2019-06-01T23:48:01Z",
  //       ruleClassname:"com.nbcuni.ont.rule.mgmt.watchfolder.domain.WatcherFolderConfiguration",
  //       ruleAction:"com.nbcuni.ont.test.TestBusinessAction",
  //     },
  //   ])
  // }, 1000);
});

export let getSchedule = function(name){
  return new Promise((res, rej)=>{
    let parsedData;
    fetch("http://localhost:8151/rule-mgmt/rule-schedule/"+name).then((response)=>{
      return response.json();
    }).then((data)=>{
      parsedData = Object.values(data);
      Object.values(data).forEach((rule, idx)=>{
        parsedData[idx].ruleSchedule = JSON.parse(window.atob(rule.ruleSchedule));
      });
      res(parsedData);
    });
  })
//   return new Promise((res, rej)=>{
//     setTimeout(()=>{
//       switch (name){
//         case 1:
//           res([{
//             "id":"d8d70b80-8efe-11e9-b807-872e8c269726",
//             "ruleName":"samepleWatchName",
//             "createDate":"2019-06-14T23:48:01Z",
//             "endDate":"2020-06-14T23:48:02Z",
//             "ruleSchedule":
//               {
//                 "dayTimes":{"0":"09:30","1":"17:40"},
//                 "period":0
//               },
//             "ruleScheduleType":"daily"
//           }]);
//           break;
//         case 2:
//           res([{
//             "id":"d8d70b80-8efe-11e9-b807-872e8c269727",
//             "ruleName":"samepleWatchName2",
//             "createDate":"2019-06-14T23:48:01Z",
//             "endDate":"2020-06-14T23:48:02Z",
//             "ruleSchedule":
//               {
//                 "dayTimes":{"0":"10:30","1":"18:40"},
//                 "period":0
//               },
//             "ruleScheduleType":"daily"
//           }]);
//           break;
//         case 3:
//           res([{
//             "id":"d8d70b80-8efe-11e9-b807-872e8c269728",
//             "ruleName":"samepleWatchName3",
//             "createDate":"2019-06-14T23:48:01Z",
//             "endDate":"2020-06-14T23:48:02Z",
//             "ruleSchedule":
//               {
//                 "dayTimes":{"0":"11:00"},
//                 "period":0
//               },
//             "ruleScheduleType":"daily"
//           }]);
//           break;
//         case 4:
//           res([{
//             "id":"d8d70b80-8efe-11e9-b807-872e8c269729",
//             "ruleName":"samepleWatchName4",
//             "createDate":"2019-06-14T23:48:01Z",
//             "endDate":"2020-06-14T23:48:02Z",
//             "ruleSchedule":
//               {
//                 "dayTimes":{"0":"12:00"},
//                 "period":0
//               },
//             "ruleScheduleType":"daily"
//           }]);
//           break;
//         case 5: 
//           res([{
//             "id":"d8d70b80-8efe-11e9-b807-872e8c269730",
//             "ruleName":"samepleWatchName5",
//             "createDate":"2019-06-14T23:48:01Z",
//             "endDate":"2020-06-14T23:48:02Z",
//             "ruleSchedule":
//               {
//                 "dayTimes":{"0":"13:00"},
//                 "period":0
//               },
//             "ruleScheduleType":"daily"
//           }]);
//           break;
        
//         case 6: 
//           res([{
//             "id":"d8d70b80-8efe-11e9-b807-872e8c269730",
//             "ruleName":"samepleWatchName6",
//             "createDate":"2019-06-14T23:48:01Z",
//             "endDate":"2020-06-14T23:48:02Z",
//             "ruleSchedule":
//               {
//                 "dayTimes":{"0":"13:00"},
//                 "period":0
//               },
//             "ruleScheduleType":"daily"
//           }]);
//           break;
//       }
//     }, 1000);
//   });
}
export let getErrorLog = function(ruleName){
  return new Promise((res, rej)=>{
    fetch("http://localhost:8151/rule-mgmt/error-logs/" + ruleName +"/7").then((response)=>{
      return response.json();
    }).then((data)=>{
      res(data);
    })
    .catch(error => console.error('Error:', error));
  });
}
export let getLog = function(ruleName){
  return new Promise((res, rej)=>{
    fetch("http://localhost:8151/rule-mgmt/logs/" + ruleName).then((response)=>{
      return response.json();
    }).then((data)=>{
      res(data);
    })
    .catch(error => console.error('Error:', error));
  });
}
export let postNewRule = function(payload){

  return new Promise((res, rej)=>{
    fetch("http://localhost:8151/rule-mgmt/save", {
      method: "POST",
      body: JSON.stringify(payload),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response)=>{
      return response.json();
    }).then((data)=>{
      res(data);
    })
    .catch(error => console.error('Error:', error));
  });
}
export let editRule = function(payload){
  return new Promise((res, rej)=>{
    fetch("http://localhost:8151/rule-mgmt/update", {
      method: "PUT",
      body: JSON.stringify(payload),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response)=>{
      return response.json();
    }).then((data)=>{
      res(data);
    })
    .catch(error => console.error('Error:', error));
  });
}
export let postNewSchedule = function(payload){

  return new Promise((res, rej)=>{
    fetch("http://localhost:8151/rule-mgmt/save-schedule", {
      method: "POST",
      body: JSON.stringify(payload),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response)=>{
      return response.json();
    }).then((data)=>{
      res(data);
    })
    .catch(error => console.error('Error:', error));
  });
}
export let putSchedule = function(payload){
  return new Promise((res, rej)=>{
    fetch("http://localhost:8151/rule-mgmt/save-schedule", {
      method: "PUT",
      body: JSON.stringify(payload),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response)=>{
      return response.json();
    }).then((data)=>{
      res(data);
    })
    .catch(error => console.error('Error:', error));
  });
}
export let getLatestLogs = function(){
  return new Promise((res, rej)=>{
    fetch("http://localhost:8151/rule-mgmt/latest-logs/48").then((response)=>{
      return response.json();
    }).then((data)=>{
      res(data);
    })
    .catch(error => console.error('Error:', error));
  });
}