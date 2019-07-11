import React from "react";
import MonthSelector from "./monthSelecter.jsx";
import DaysTable from "./daysTable.jsx";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="calendar">
        <MonthSelector />
        <DaysTable />
      </div>
    );
  }
}
