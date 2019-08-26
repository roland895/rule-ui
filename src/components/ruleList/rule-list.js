import React, {Component} from "react";
import RuleCard from "./rule-card";
import SearchIcon from "../../assets/search-icon.svg";
import Select from "react-dropdown-select";
import moment from "moment";
import "../../styles/list.scss";
import { breakStatement } from "@babel/types";

export default class RuleList extends Component {
  constructor(props){

    super(props);
    this.state = {
      searchQuery: '',
      sortBy: [{
        value: "name",
        label: "Rule Name"
      }],
      dropdownOpen: false,
      displayCount: 4,
      filteredRules: [],
    }
    this.searchChangeHandler= this.searchChangeHandler.bind(this);
    this.sortByChange  = this.sortByChange.bind(this);
  }
  componentDidMount(){
    this.setState({
      rules: this.props.deleteRules
    });
  }

  getListofCardsJSX(){
    let cards = [];
    if(this.props.deleteRules.length > 0){
      let rules = this.filterAndSortRules();

      for(let i = 0; i<rules.length; i++ ){
      //for(let i = 0; i<this.state.displayCount; i++ ){
        if(rules[i]){
          cards.push(<RuleCard key={i} rule={rules[i]} selectRule={this.props.selectRule}></RuleCard>);
        }
        // cards.push(<div>
        //   {this.state.filteredRules[i].ruleName}
        // </div>);
      //}
      }
    }

    return cards;
  }
  searchChangeHandler(e){
    this.setState({
      searchQuery: e.currentTarget.value
    });
  }

  sortByChange(options){
    if(options.length > 0){
      this.setState({
        sortBy: options
      });
    }
  }
  filterAndSortRules(){
    let filteredRules = this.props.deleteRules.filter((rule)=>{
      return rule.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    });
    
    switch (this.state.sortBy[0].value) {
      case "establishDate": 
        filteredRules.sort(this.compareEstablishDate);
        break;
      case "name":
        filteredRules.sort(this.compareName)
        break;
    }
    return filteredRules

  }
  compareEstablishDate(a,b){
    if (moment(a.ruleDate).isBefore(moment(b.ruleDate))){return -1;}
    if (moment(a.ruleDate).isAfter(moment(b.ruleDate))){return 1;}
    return 0;
  }
  compareName(a,b){
    if (a.name < b.name){return -1;}
    if (a.name > b.name){return 1;}
    return 0;
  }
  render(){
    let dropdownOptions = [
      {
        value: "name",
        label: "Rule Name"
      },
      {
        value: "establishDate",
        label: "Rule Estabilish Date"
      },
      {
        value: "lastRan",
        label: "Last Ran Date"
      },
      {
        value: "createdBy",
        label: "Created By"
      },
      {
        value: "upcoming",
        label: "Upcoming"
      }
    ];
    let ruleCards = this.getListofCardsJSX();
    return(<div className="rule-list-wrapper">
      <div className="list-header">
        <div className="left">
          <h2>
            Delete Rule List
          </h2>
          <div className="search-wrapper">
            <img className="search-icon" src={SearchIcon}></img>
            <input className="search-input" value={this.state.searchQuery} onChange={this.searchChangeHandler} type="text">
            </input>
          </div>
        </div>
        <div className="right">
          <span>
            Sort By:
          </span>
          <Select values={this.state.sortBy} options={dropdownOptions} onChange={this.sortByChange} className="list-dropdown"></Select>
        </div>
      </div>
      
      <div className="card-wrapper">
        {ruleCards}
      </div>
    </div>);
  }
}
