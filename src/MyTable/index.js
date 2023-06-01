import React from "react";
import MyTableRow from "../MyTableItem";
import "./index.css";

class MyTable extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const results = this.props.results;
    return (
      <>
        <div className="table-container">
          {results &&
            results.map((rowData) => (
              <MyTableRow key={rowData.session_id} rowData={rowData} />
            ))}
        </div>
      </>
    );
  }
}

export default MyTable;
