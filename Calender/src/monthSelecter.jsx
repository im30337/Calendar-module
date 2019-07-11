import React from "react";
export default class MonthSelecter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="tab-month">
        <a href="" className="left-arrow" />
        <ul className="month-list">
          <li />
          <li />
          <li />
        </ul>
        <a href="" className="right-arrow" />
      </div>
    );
  }
}
