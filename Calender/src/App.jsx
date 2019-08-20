import React from "react";
import DateService from './service/date.service'
import MonthSelector from "./monthSelecter.jsx";
import List from "./list/List.jsx";
import Calendar from './calendar/Calendar.jsx';
import Button from './Button.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    let $date = new DateService();
    $date.date.next(this.props.dataSource);
    $date.display.next( {y:parseInt(this.props.initYearMonth.slice(0,4)),m:parseInt(this.props.initYearMonth.split(this.props.initYearMonth.slice(0,4))[1])});
    this.state = {
      $date: $date,
      mode: 'calendar',
      currentYM: {y:parseInt(this.props.initYearMonth.slice(0,4)),m:parseInt(this.props.initYearMonth.split(this.props.initYearMonth.slice(0,4))[1])},
      monthData: []
    }
  }

  componentDidMount() {
    this.state.$date.display$.subscribe(
      _ => {
        this.setState({currentYM: _})
        console.log('success',_)
      }
    );
    this.state.$date.monthData$.subscribe(
      monthData => {
       this.setState({monthData: monthData})
      }
    )
  }

  changeMode(calendar) {
    let mode = !calendar ? 'calendar' : 'list'
    this.setState({mode: mode});
  }

  render() {
    let container = this.state.mode == 'calendar' ? <Calendar monthData = {this.state.monthData} currentYM = {this.state.currentYM} service = {this.state.$date}/> : <List currentYM = {this.state.currentYM} service = {this.state.$date}/>;
    return (
      <div className="calendar">
        <MonthSelector currentYM = {this.state.currentYM} service = {this.state.$date}/>
        {container}
        <Button callback = {this.changeMode.bind(this,this.state.mode == 'calendar' ? true:false)} mode = {this.state.mode == 'calendar' ? '列表' : '月曆'}/>
      </div>
    );
  }
}
