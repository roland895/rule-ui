import React, {Component} from "react";
import moment from "moment";
import RuleForm from "./editForms";
import { runInContext } from "vm";
import AddRuleIcon from "../assets/addRuleIcon.svg";
import AddScheduleIcon from "../assets/addSchedule.svg";
import Modal from '@material-ui/core/Modal';

export default class CreateModal extends Component {
  constructor(props){

    super(props);
    this.state = {
      animationModal:false,
      errorMessage: false
    };
    this.preventClose =this.preventClose.bind(this);
    this.openAnimationModal = this.openAnimationModal.bind(this);
    this.closeAnimationModal = this.closeAnimationModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  preventClose(e){
    e.stopPropagation();
  }
  closeAnimationModal(){
    this.setState({
      animationModal:false,
      errorMessage: false,
    })
    this.props.closeModal();
  }
  openAnimationModal(){
    if(this.props.name !== "" && this.props.description !== "" && this.props.data.targetDirectory !== "" && this.props.data.wildcardString !== "" ){
      this.setState({
        animationModal:true,
        errorMessage: false,
      });
      this.props.closeModal();
    }else{
      this.setState({
        errorMessage: true
      });
    }
  }
  closeModal(){
    this.props.closeModal();
    this.setState({
      errorMessage: false,
    });
  }
  render(){
    let required = [];
    if(this.props.name == ""){
      required.push("Rule Name");
    }
    if(this.props.description == ""){
      required.push("Rule Description");
    }
    if(this.props.data.targetDirectory == ""){
      required.push("Target Directory");
    }
    if(this.props.data.wildcardString == ""){
      required.push("Wildcard String");
    }
    let message= required.join(", ") + ' is Required';
    return(
      <div className="modal-content" onClick={this.preventClose}>
        <div className="modal-header">
          <img className="modal-header-icon" src={AddScheduleIcon}/>
          <span>Create New Rule</span>
          <div className="modal-close" onClick={this.closeModal}>
          x</div>
        </div>
        <RuleForm {...this.props}
                      handleChange={this.props.handleChange}
                      handleDataChange={this.props.handleDataChange}
                      handleDateChange={this.props.handleDateChange}
                      repeatChange={this.props.repeatChange}
                      addRepeat={this.props.addRepeat}
                      removeRepeat={this.props.removeRepeat}
                      handleChangeCheckBox={this.props.handleChangeCheckBox}
                      addSchedule={this.props.addSchedule}
                      removeSchedule={this.props.removeSchedule}
                      openAnimationModal={this.openAnimationModal}
                      getRules={this.props.getRules}
        ></RuleForm>
        {(this.state.errorMessage) &&
          <div className="message">
            {message}
          </div>   
        }
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.animationModal}
          onClose={this.closeAnimationModal}
        >
          <div style={{
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
          }} className="deleteModal">
            <div className="close" onClick={this.closeAnimationModal}>
              X
            </div>
            <div className="ui-success">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>            </div>
            <p id="simple-modal-description">
              Congrats! The ‘{this.props.name}’ rule is successfully created.
            </p>
          </div>
        </Modal>
      </div>  
    );
  }
}
