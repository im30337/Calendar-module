import React from "react";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let status = this.props.data.status;
    let statusClassName = status === ("額滿" || "截止") ? "status-full" : status === ("報名" || "預定") ? "status-ready" : status === "後補" ? "status-alternate" : "";
    return (
      <div className="card">
        <div className = 'card-date'>
          <div>
            {this.props.date}
          </div>
          <div>
           {this.props.day}
          </div>
        </div>
        <div className = 'card-available'>
          <div className = "card-padding-bottom">可賣: {this.props.data.availableVancancy}</div>
          <div className = "card-guaranteed">{this.props.data.guaranteed ? '成團':''}</div>
        </div>
        <div className = 'card-total'>
          <div className = "card-padding-bottom">團位: {this.props.data.totalVacnacy}</div>
        </div>
        <div className = 'card-right'>
          <div className = {statusClassName}>{this.props.data.status}</div>
          <div className = "card-price">{"$" + this.props.data.price}</div>
        </div>
      </div>
    );
  }
}
