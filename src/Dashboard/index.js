import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import Select from "@material-ui/core/Select";
import { Alert, AlertTitle } from "@material-ui/lab";
// import { Link } from "react-router-dom";
import LoadingCircle from "../LoadingCircle";
import MyTable from "../MyTable";
import "./index.css";
import MyAlert from "../MyAlert";
import { useAuth0 } from "@auth0/auth0-react";
import NotifierBox from "../NotifierBox";

const styles = () => ({
  cssLabel: {
    "&$cssFocused": {
      color: `#ff8e53 !important`,
    },
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `#ff8e53 !important`,
    },
  },

  cssFocused: {},

  notchedOutline: {
    // borderWidth: "1px",
    // borderColor: "green !important",
  },
});

function withMyHook(Component) {
  return function WrappedComponent(props) {
    return <Component {...props} userAuth0={useAuth0()} />;
  };
}

class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      state: "",
      stateList: "",
      district: "",
      districtList: "",
      setDate: new Date(),
      results: "",
      loadingResults: false,
      userData: {
        username: "",
        email: "",
        notifier_status: "",
        notifier_state: "",
        notifier_district: "",
        notifier_cooldown: "",
      },
    };

    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/states`)
      .then((res) => res.json())
      .then((json) =>
        this.setState(async (prevState) => {
          prevState.stateList = json.states;
          return prevState;
        })
      );
    this.child = React.createRef();
  }

  HandleDateChange = (newDate) => {
    this.setState((prevState) => {
      prevState.setDate = newDate;
      return prevState;
    });
  };

  HandleStateChange = async (event) => {
    let prevState = this.state;
    prevState.state = event.target.value;

    await fetch(
      `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${event.target.value}`
    )
      .then((res) => res.json())
      .then((json) => {
        prevState.districtList = json.districts;
        prevState.district = "";
        this.setState(prevState);
      });
  };

  HandleDistrictChange = (event) => {
    this.setState((prevState) => {
      prevState.district = event.target.value;
      return prevState;
    });
  };

  HandleDistrictFocus = () => {
    this.ShowMessage("warning", "Please select state first");
  };

  // async componentWillMount() {}

  ShowResults = async () => {
    const { state, district, setDate } = this.state;
    if (state === "") {
      this.ShowMessage("warning", "Please select state");
    } else if (district === "") {
      this.ShowMessage("warning", "Please select district");
    } else {
      this.setState((prevState) => {
        prevState.results = "";
        prevState.loadingResults = true;
        return prevState;
      });
      const parsedDate = format(setDate, "dd-MM-yyyy");
      try {
        await fetch(
          `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${parsedDate}`
        )
          .then((res) => res.json())
          .then((json) => {
            this.setState((prevState) => {
              prevState.results = json.sessions;
              prevState.loadingResults = false;
              return prevState;
            });
          })
          .catch((error) => {
            this.setState((prevState) => {
              prevState.loadingResults = false;
              return prevState;
            });
            this.ShowMessage(
              "error",
              `Server not responding, please try after some time`
            );
          });
      } catch (error) {
        this.ShowMessage("error", `There is an error fetching results`);
      }
    }
  };

  ShowMessage = (type, msg) => {
    this.child.current.HandleClick({ type, msg });
  };

  GetUserNotificationData = async (username) => {
    const url = `https://mktiqcxv1i.execute-api.ap-south-1.amazonaws.com/live/get-user`;
    const userData = { username };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      mode: "cors",
    };
    let response = await fetch(url, options);
    let json = await response.json();
    return json;
  };

  CreateNotifier = async (stateData, user) => {
    const userData = {
      update_type: "create-notifier",
      username: user.name,
      email: user.email,
      notifier_state: stateData.stateList.find(
        (each) => each.state_id === stateData.state
      ).state_name,
      notifier_district: stateData.districtList.find(
        (each) => each.district_id === stateData.district
      ).district_name,
    };

    if (stateData.state && stateData.district) {
      const url = `https://mktiqcxv1i.execute-api.ap-south-1.amazonaws.com/live/add-user`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        mode: "cors",
      };

      try {
        let response = await fetch(url, options);
        let json = await response.json();

        const updatedData = json.body.Attributes
          ? json.body.Attributes
          : json.body;

        this.setState((prevState) => {
          prevState.userNotificationData = updatedData;
          return prevState;
        });
      } catch (error) {
        console.log("small error :", error);
      }
    }
    return userData;
  };

  GetStateData = () => {
    const stateData = this.state;
    if (stateData.state && stateData.district) {
      const userData = {
        notifier_state: stateData.stateList.find(
          (each) => each.state_id === stateData.state
        ).state_name,
        notifier_district: stateData.districtList.find(
          (each) => each.district_id === stateData.district
        ).district_name,
      };
      return userData;
    } else {
      this.ShowMessage("warning", "Select state and district");
    }
  };

  DeleteNotifier = async (user) => {
    const userData = {
      update_type: "delete-notifier",
      username: user.name,
      email: user.email,
      notifier_state: "",
      notifier_district: "",
    };

    const url = `https://mktiqcxv1i.execute-api.ap-south-1.amazonaws.com/live/add-user`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      mode: "cors",
    };

    try {
      let response = await fetch(url, options);
      await response.json();
      const emptyNotifier = {
        username: user.name,
        email: user.email,
        notifier_status: "",
        notifier_state: "",
        notifier_district: "",
        notifier_cooldown: "",
      };
      this.setState((prevState) => {
        prevState.userData = emptyNotifier;
        return prevState;
      });
    } catch (error) {
      console.log("small error :", error);
    }
  };

  // async componentDidMount() {
  //   const userAuth0 = await this.props.userAuth0;
  //   const { user, isAuthenticated } = await userAuth0;
  //   console.log("auth in did mount:", isAuthenticated, user);
  //   if (isAuthenticated) {
  //     let json = await this.GetUserNotificationData(user.name);
  //     console.log("log:", json);
  //     this.setState((prevState) => {
  //       prevState.userData = json.body.Item;
  //       return prevState;
  //     });
  //   }
  // }

  render() {
    const {
      state,
      district,
      stateList,
      districtList,
      setDate,
      results,
      loadingResults,
    } = this.state;
    const userAuth0 = this.props.userAuth0;
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
      userAuth0;
    const { userData } = this.state;
    console.log("iter state", isAuthenticated, userData);
    return (
      <>
        <div className="loading">{isLoading && <LoadingCircle />}</div>
        {isAuthenticated && (
          <div>
            <h1 className="greeting">
              Hello {user.name}! <br />
              <br />
              {
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  id="logout-button"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              }
            </h1>
            {!user.email_verified && (
              <Alert severity="warning" className="instruction">
                <AlertTitle>Email verification not done</AlertTitle>
                Please verify your email ({user.email}) using the verification
                link sent to you
                {/* <strong>Easy isn't it!</strong> */}
              </Alert>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className="bigBox"
          >
            <div className="formControl">
              <FormControl variant="outlined" className="formControl">
                <InputLabel id="state-select-outlined-label">
                  Select State
                </InputLabel>
                <Select
                  labelId="state-select-outlined-label"
                  id="state-select-outlined"
                  value={state}
                  onChange={this.HandleStateChange}
                  label="Select State"
                >
                  {stateList !== "" &&
                    stateList.map((eachState) => (
                      <MenuItem
                        value={eachState.state_id}
                        key={eachState.state_id}
                      >
                        {eachState.state_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>

            <div className="formControl">
              <FormControl variant="outlined" className="formControl">
                <InputLabel id="district-select-outlined-label">
                  Select District
                </InputLabel>
                <Select
                  labelId="district-select-outlined-label"
                  id="district-select-outlined"
                  value={district}
                  onChange={this.HandleDistrictChange}
                  onClick={state ? null : this.HandleDistrictFocus}
                  disabled={state ? false : true}
                  label="Select District"
                >
                  {districtList !== "" &&
                    districtList.map((eachDistrict) => (
                      <MenuItem
                        value={eachDistrict.district_id}
                        key={eachDistrict.district_id}
                      >
                        {eachDistrict.district_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>

            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              className="dateControl"
            >
              <div className="formControl">
                <KeyboardDatePicker
                  className="formControl"
                  // margin="normal"
                  id="date-picker-dialog"
                  label="Select the date"
                  format="dd/MM/yyyy"
                  value={setDate}
                  margin="dense"
                  onChange={this.HandleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </div>
            </MuiPickersUtilsProvider>

            <div className="buttons-container">
              <Button
                variant="contained"
                color="primary"
                id="getResults"
                onClick={this.ShowResults}
              >
                Show availability
              </Button>

              <div className="or">{"  "}</div>

              {isAuthenticated ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="getResults"
                  onClick={() => {
                    const { state, district } = this.state;
                    if (state && district) {
                      //srhsh
                      this.CreateNotifier(this.state, user);
                    } else {
                      this.ShowMessage(
                        "warning",
                        "Please select state and district"
                      );
                    }
                  }}
                >
                  Create Notifier!
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  id="getResults"
                  onClick={() => loginWithRedirect()}
                >
                  Login to create Notifier
                </Button>
              )}
            </div>
          </Grid>
        )}

        {isAuthenticated && (
          <div className="dashboard-responsive">
            <div className="dashboard-select">
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className="bigBox"
              >
                <div className="formControl">
                  <FormControl variant="outlined" className="formControl">
                    <InputLabel id="state-select-outlined-label">
                      Select State
                    </InputLabel>
                    <Select
                      labelId="state-select-outlined-label"
                      id="state-select-outlined"
                      value={state}
                      onChange={this.HandleStateChange}
                      label="Select State"
                    >
                      {stateList !== "" &&
                        stateList.map((eachState) => (
                          <MenuItem
                            value={eachState.state_id}
                            key={eachState.state_id}
                          >
                            {eachState.state_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="formControl">
                  <FormControl variant="outlined" className="formControl">
                    <InputLabel id="district-select-outlined-label">
                      Select District
                    </InputLabel>
                    <Select
                      labelId="district-select-outlined-label"
                      id="district-select-outlined"
                      value={district}
                      onChange={this.HandleDistrictChange}
                      onClick={state ? null : this.HandleDistrictFocus}
                      disabled={state ? false : true}
                      label="Select District"
                    >
                      {districtList !== "" &&
                        districtList.map((eachDistrict) => (
                          <MenuItem
                            value={eachDistrict.district_id}
                            key={eachDistrict.district_id}
                          >
                            {eachDistrict.district_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>

                <MuiPickersUtilsProvider
                  utils={DateFnsUtils}
                  className="dateControl"
                >
                  <div className="formControl">
                    <KeyboardDatePicker
                      className="formControl"
                      // margin="normal"
                      id="date-picker-dialog"
                      label="Select the date"
                      format="dd/MM/yyyy"
                      value={setDate}
                      margin="dense"
                      onChange={this.HandleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </div>
                </MuiPickersUtilsProvider>

                <div className="buttons-container">
                  <Button
                    variant="contained"
                    color="primary"
                    id="getResults"
                    onClick={this.ShowResults}
                    // href="#center-data"
                  >
                    Show availability
                  </Button>

                  <div className="or">{"  "}</div>

                  {!isAuthenticated && (
                    // ? (
                    //   <Button
                    //     variant="contained"
                    //     color="primary"
                    //     id="getResults"
                    //     onClick={() => {
                    //       const userData = user;
                    //       const { state, district } = this.state;
                    //       if (state && district) {
                    //         this.CreateNotifier(this.state, userData);
                    //       } else {
                    //         this.ShowMessage(
                    //           "warning",
                    //           "Please select state and district"
                    //         );
                    //       }
                    //     }}
                    //   >
                    //     Create Notifier!
                    //   </Button>
                    // ) :
                    <Button
                      variant="contained"
                      color="primary"
                      id="getResults"
                      onClick={() => loginWithRedirect()}
                    >
                      Login to create Notifier
                    </Button>
                  )}
                </div>
              </Grid>
            </div>

            <div className="dashboard-separator">
              <br />
            </div>
            <div className="dashboard-user">
              {isAuthenticated && (
                <NotifierBox
                  userInfo={user}
                  stateData={this.state}
                  createNotifier={this.CreateNotifier}
                  deleteNotifier={this.DeleteNotifier}
                  getStateData={this.GetStateData}
                />
              )}
            </div>
          </div>
        )}

        <MyAlert ref={this.child} />

        <div id="center-data">
          <div className="loading">{isLoading && <LoadingCircle />}</div>
          <div className="loading">{loadingResults && <LoadingCircle />}</div>
          {results.length > 0 && <MyTable results={results} />}
          {results !== "" && results.length === 0 && (
            <div className="no-results">
              Uh oh.. No centers found.. {} {} <SentimentDissatisfiedIcon />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default withMyHook(withStyles(styles)(Dashboard));
