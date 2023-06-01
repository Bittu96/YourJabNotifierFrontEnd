// import React from "react";
import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default class MyAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: "",
      open: false,
    };
  }

  HandleClick = (props) => {
    this.setState({ alert: props, open: true });
  };

  HandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    const { alert, open } = this.state;

    return (
      <div id="snackbar">
        {/* <Button variant="outlined" onClick={this.HandleClick}>
          Open success snackbar
        </Button> */}
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={this.HandleClose}
        >
          <Alert onClose={this.HandleClose} severity={alert.type}>
            {alert.msg}
          </Alert>
        </Snackbar>
        {/* <Alert severity="error">This is an error message!</Alert>
        <Alert severity="warning">This is a warning message!</Alert>
        <Alert severity="info">This is an information message!</Alert>
        <Alert severity="success">This is a success message!</Alert> */}
      </div>
    );
  }
}
