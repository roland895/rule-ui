import { createMuiTheme } from "@material-ui/core";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

export const materialTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
  overrides: {
    MuiInputLabel:{
      animated:{
        fontSize: "15px",
        color: "#888888",
      },
      root:{
        "&.Mui-focused":{
          color:"#FFBA00"
        },
      },
    },
    MuiInputBase:{
      root:{
        padding: "6px 0 7px"
      },
      input:{
        color: "#fff",
      },
    },
    MuiInput:{
      underline:{
        "&:after":{
          bordeBottomColor: "#FFBA00",
        },
        "&:before":{
          borderBottomColor: "#5D5333",
        }
      },
      
    },
    MuiInputBase: {
      input: {
        padding: "3px 0 3px",
      }
    },
    MuiPickersToolbar: {
      //display: "none",
      toolbar: {
        //display: "none",
        backgroundColor: "transparent",
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: "white",
      },
    },
    MuiPickersCalendarHeader: {
      daysHeader: {
        display: "none",
      },
      iconButton:{
        backgroundColor: "#393E44",
        color: "#fff",
        "&> *": {
          backgroundColor: "transparent",
        },

      },
      transitionContainer: { 
        color: "#fff"
      }
    },
    MuiInputAdornment: {
      root: {
        display: "none",
      }
    },
    MuiPopover: {
      paper:{
        backgroundColor: "#393E44",
        // marginLeft: 63,
        // marginTop: 131,
        border: "1px solid #FFBA00"
    
      }
    },
    MuiPickersDay: {
      padding: 0,
      day: {
        color: "#fff",
        backgroundColor: "#393E44",
        border: ".1px solid #96989B",
        borderRadius: 0,
        margin: "-1px",
        height:"26px",
        width: "28px",
        "&:hover":{
          border: ".1px solid #96989B",
          margin: "-1px",
        }
      },
      hidden:{
        opacity: 1,
        color: "#96989B",
        border: ".1px solid #96989B",
      },
      daySelected:{
        backgroundColor:"#2D3136",
        color: '#ffba00',
        "&:hover":{
          backgroundColor: "#2D3136",
  
        }
      },
      isSelected: {
        backgroundColor: "#2D3136",
      },
      current: {
        color: "#666666",
      },
      "&:hover":{
        backgroundColor: "#393E44",

      }
    },
    MuiPickersModal: {
      backgroundColor: "#393E44",

      dialogAction: {
        color: "#FFBA00",
      },
    },
    MuiIconButton:{
      root:{
        "&hover":{
          backgroundColor: "transparent"
        }
      }
    },
    MuiListItem:{
      button:{
        color: "#fff"
      }
    },
    MuiFormControlLabel:{
      root:{
        marginRight:0
      }
    },
    MuiPickersModal:{
      dialogRoot:{
        border: "1px solid #FFBA00",
        backgroundColor: "#393E44"
      }
    },
    MuiButton:{
      label:{
        color: "#FFF"
      }
    },
    MuiPickersClockNumber:{
      clockNumber:{
        color:"#FFF",
      },
      clockNumberSelected:{
        color: "#393E44"
      }
    },
    MuiPickersClock:{
      pin:{
        backgroundColor: "#FFBA00",
      }
    },
    MuiPickersClockPointer:{
      pointer:{
        backgroundColor: "#FFBA00"
      },
      noPoint:{
        backgroundColor: "#FFBA00"
      },
      thumb:{
        border: "14px solid #FFBA00"
      }
    },
    MuiSelect:{
      icon:{
        color:"#FFBA00"
      }
    },
    MuiMenuItem:{
      root:{
        minHeight: 30
      }
    },
    MuiPaper:{
      root:{
        backgroundColor: "transparent"
      },
      elevation1:{
        boxShadow: "none"
      }
    },
    MuiExpansionPanelSummary:{
      content:{
        color: "#fff"
      }
    },
    MuiExpansionPanel:{
      root:{
        borderTop: "1px solid #999999",
        borderBottom: "1px solid #999999",
        "&.Mui-expanded": {
          margin: "0px 0px"
        },
      }
    },
    MuiExpansionPanelSummary:{
      root:{
        paddingLeft:"0px",
      },
      content:{
        color: "#fff",
      }
    },
    MuiExpansionPanelDetails:{
      root:{
        padding: "0px"
      }
    }, 
    MuiSelect:{
      icon:{
        color: "#5D5333"
      }
    } 
  },
});

export const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 2,
    position: 'relative',
    backgroundColor: '#393E44',
    border: '1px solid #FFBA00',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);