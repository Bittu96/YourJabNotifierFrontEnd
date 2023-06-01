import React from "react";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

const ViewMore = (props) => {
  const { details } = props;
  const rowData = details;

  return (
    <TableContainer className="details-table">
      <Table size="small" aria-label="a dense table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" className="tableSideHeadings">
              Center Id
            </TableCell>
            <TableCell align="left">{rowData.center_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="tableSideHeadings">
              Full Address
            </TableCell>
            <TableCell align="left">
              {rowData.name} ({rowData.center_id}), {}
              {rowData.address}, {rowData.block_name}, {rowData.district_name},
              {rowData.state_name}, {rowData.pincode}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="tableSideHeadings">
              First Dose Availability
            </TableCell>
            <TableCell align="left">
              {rowData.available_capacity_dose1} Doses
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="tableSideHeadings">
              Second Dose Availability
            </TableCell>
            <TableCell align="left">
              {rowData.available_capacity_dose2} Doses
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="tableSideHeadings">
              Fee
            </TableCell>
            <TableCell align="left">&#x20B9;{rowData.fee}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="tableSideHeadings">
              Time Slots
            </TableCell>
            <TableCell align="left">
              {rowData.slots.map((slot) => (
                <p className="center-name" key={slot}>
                  {slot}
                </p>
              ))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

class MyTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  DropDownHandler = () => [
    this.setState((prevState) => {
      prevState.open = !prevState.open;
      return prevState;
    }),
  ];

  // address: "Pauwara SHC";
  // available_capacity: 19;
  // available_capacity_dose1: 10;
  // available_capacity_dose2: 9;
  // block_name: "Durg";
  // center_id: 380773;
  // date: "24-06-2021";
  // district_name: "Durg";
  // fee: "0";
  // fee_type: "Free";
  // from: "09:00:00";
  // lat: 21;
  // long: 81;
  // min_age_limit: 45;
  // name: "Pauwara SHC";
  // pincode: 491107;
  // session_id: "edcdacbb-3a7a-46b8-aa67-6a03cd36045b";
  // slots: (4)[
  //   ("09:00AM-11:00AM",
  //   "11:00AM-01:00PM",
  //   "01:00PM-03:00PM",
  //   "03:00PM-05:00PM")
  // ];
  // state_name: "Chhattisgarh";
  // to: "17:00:00";
  // vaccine: "COVISHIELD";

  render() {
    const { open } = this.state;
    const { rowData } = this.props;

    let tableClass = "table-item-";
    tableClass += open ? "open" : "close";
    // tableClass += rowData.available_capacity ? " available" : " not-available";

    let dropDownClass = "table-item-base";
    dropDownClass += rowData.available_capacity
      ? " available"
      : " not-available";

    let dropIconClass = "drop-icon-";
    dropIconClass += !open ? "open" : "close";
    dropIconClass += rowData.available_capacity ? "" : " drop-icon-color";
    return (
      <>
        <div className={dropDownClass} onClick={this.DropDownHandler}>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            className="containerTable"
          >
            {/* only on md lg xl */}
            <Hidden only={["xs", "sm"]}>
              <Grid item xs={1}>
                {<AddCircleOutlineIcon className={dropIconClass} />}
              </Grid>
              <Grid item xs={2}>
                <p className="center-name">{rowData.name}</p>
              </Grid>
              <Grid item xs={3}>
                <p className="center-name">
                  {rowData.address}, {rowData.block_name}, {rowData.pincode}
                </p>
              </Grid>
              <Grid item xs={2}>
                <p className="center-name vaccine-name">{rowData.vaccine}</p>
              </Grid>
              <Grid item xs={2}>
                <p className="center-name">
                  Req. Age {}
                  <strong>{rowData.min_age_limit} +</strong>
                </p>
              </Grid>
              <Grid item xs={1}>
                <p className="center-name total-doses">
                  <strong>{rowData.available_capacity}</strong>
                  {} Doses
                </p>
              </Grid>
              <Grid item xs={1}>
                <p className="center-name fee-type">
                  <strong>{rowData.fee_type}</strong>
                </p>
              </Grid>
            </Hidden>

            {/* only on sm */}
            <Hidden only={["xs", "md", "lg", "xl"]}>
              <Grid item xs={1}>
                {<AddCircleOutlineIcon className={dropIconClass} />}
              </Grid>
              <Grid item xs={3}>
                <p className="center-name">{rowData.name}</p>
              </Grid>
              <Grid item xs={2}>
                <p className="center-name vaccine-name">{rowData.vaccine}</p>
              </Grid>
              <Grid item xs={2}>
                <p className="center-name">
                  Req. Age {}
                  <strong>{rowData.min_age_limit} +</strong>
                </p>
              </Grid>
              <Grid item xs={2}>
                <p className="center-name total-doses">
                  <strong>{rowData.available_capacity}</strong>
                  {} Doses
                </p>
              </Grid>
              <Grid item xs={1}>
                <p className="center-name fee-type">
                  <strong>{rowData.fee_type}</strong>
                </p>
              </Grid>
            </Hidden>

            {/* only on xs */}
            <Hidden only={["sm", "md", "lg", "xl"]}>
              <Grid item xs={1}>
                {<AddCircleOutlineIcon className={dropIconClass} />}
              </Grid>
              <Grid item xs={2}>
                <p className="center-name">{rowData.name}</p>
              </Grid>
              <Grid item xs={2}>
                <p className="center-name vaccine-name">{rowData.vaccine}</p>
              </Grid>
              <Grid item xs={3}>
                <p className="center-name ">
                  <strong>{rowData.available_capacity}</strong>
                  {} Doses
                </p>
                <p className="center-name">
                  Req. Age {}
                  <strong>{rowData.min_age_limit} +</strong>
                </p>
              </Grid>
            </Hidden>
          </Grid>
          <div className={tableClass}>{<ViewMore details={rowData} />}</div>
        </div>
      </>
    );
  }
}

export default MyTableRow;
