import React from "react";
import Card from './card.jsx';
import ControlBar from './controlBar.jsx';
export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData:[],
      days: ['禮拜日','禮拜一','禮拜二','禮拜三','禮拜四','禮拜五','禮拜六'],
      page: 1
    }
  }

  componentDidMount() {
    this.props.service.sortMonthData$.subscribe(
      monthData => {
        // console.log(monthData)
        this.setState({sortMonthData: monthData.sortMonthData, listData: monthData.listData, totalPage: monthData.totalPage, page: 1})
      }
    )
    this.props.service.page$.subscribe(
      page => {
        this.setState({page: page})
        // console.log(page)
      }
    )
  }


  render() {
    let cards = [];
    let controlBar = this.state.totalPage > 1 ? <ControlBar page = {this.state.page} totalPage = {this.state.totalPage} service = {this.props.service}/> : '';
    let pageData = this.state.listData[this.state.page-1];
    for(var i =0; i< (this.state.listData.length > 0 ? pageData.length : 0); i++) {
      let day = new Date(parseInt(pageData[i].date.split('/')[0]),parseInt(pageData[i].date.split('/')[1]-1),parseInt(pageData[i].date.split('/')[2]))
      cards.push(
        <Card
          key = {i}
          data = {pageData[i]}
          date = {day.getDate()}
          day = {this.state.days[day.getDay()]}
        />
      )
    }
    
    return (
      <div className="list">
        {cards}
        {controlBar}
      </div>
    );
  }
}
