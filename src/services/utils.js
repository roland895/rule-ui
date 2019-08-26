let findStorage = function(rule){
  let returDir;
  rule.ruleData.targetDirectory.split("/").forEach(directory=>{ 
    if(directory == "ISILON2"){
      returDir = directory;
    }
    if( directory == "DELIVERY2" || directory == "DIGITAL_DELIVERY"){
      returDir = "DELIVERY2";
    }
    if( directory == "DVS-RT1"){
      
      returDir = directory;
    }
  });
  return returDir;
};
const hasDayTimes = ["daily", "weekly", "monthly", "yearly"];


export {findStorage, hasDayTimes}
