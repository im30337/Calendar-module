import React from "react";
import Col from './column.jsx';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month:[]
    }
    this.formatDate = this.formatDate.bind(this);
  }

  componentDidMount() {
    this.props.service.month$.subscribe(
      month => {
        this.setState({month:month})}
    );
  }

  formatDate(day) {
    let formatM = this.props.currentYM.m < 10 ? '0'+this.props.currentYM.m : this.props.currentYM.m;
    let formatDay = day < 10 ? '0'+day : day;
    return(this.props.currentYM.y+'/'+formatM+'/'+formatDay)
  }

  render() {
    let month = [];
    for(var i=0; i < 7; i++) {
      let date = [];
      !!this.state.month[i] ? this.state.month[i].forEach(e => {date.push(this.formatDate(e))}) : ''
      month.push(
        <Col
          month = {this.state.month[i]}
          service = {this.props.service}
          key = {i}
          index = {i}
          date = {date}
          data = {this.props.monthData}
        />
      )
    }
    return (
      <div style = {{display: 'flex',justifyContent: 'space-around'}} className="calendar">
        {month}
      </div>
    );
  }
}
