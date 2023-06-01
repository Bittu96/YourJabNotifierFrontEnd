import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import MyAlert from "../../MyAlert";
import "./index.css";
import { Link } from "react-router-dom";

const styles = (theme) => ({
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

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      isUsernameValid: true,
      // phone: "",
      // isPhoneValid: true,
      email: "",
      isEmailValid: true,
      password: "",
      isPasswordValid: true,
      confirmPassword: "",
      arePasswordsMatching: true,
    };
    this.child = React.createRef();
  }

  Validator = () => {
    let msg;
    let f = this.state;

    f.isUsernameValid = f.username === "" ? false : true;
    // f.isPhoneValid = f.phone === "" ? false : true;
    f.isEmailValid = f.email === "" ? false : true;
    f.isPasswordValid = f.password === "" ? false : true;
    f.arePasswordsMatching = f.password === f.confirmPassword;
    this.setState(f);

    const isDataPerfect =
      f.isUsernameValid *
      // f.isPhoneValid *
      f.isEmailValid *
      f.isPasswordValid *
      f.arePasswordsMatching;

    if (!f.isUsernameValid) {
      msg = "Please enter a valid username";
      // } else if (!f.isPhoneValid) {
      //   msg = "Please enter a valid mobile number";
    } else if (!f.isEmailValid) {
      msg = "Please enter a valid email id";
    } else if (!f.isPasswordValid) {
      msg = "Please enter a valid password";
    } else if (!f.arePasswordsMatching) {
      msg = "Passwords do not match";
    }

    if (!isDataPerfect) {
      this.ShowMessage("error", msg);
    }

    return isDataPerfect;
  };

  Validate = (event) => {
    let isValid = event.target.value === "" ? false : true;
    let target = "";

    switch (event.target.id) {
      case "username":
        target = "isUsernameValid";
        break;
      case "email":
        target = "isEmailValid";
        break;
      // case "phone":
      //   target = "isPhoneValid";
      //   break;
      case "password":
        target = "isPasswordValid";
        break;
      case "confirmPassword":
        target = "arePasswordsMatching";
        const { password } = this.state;
        isValid = password === event.target.value;
        break;
      default:
        break;
    }

    this.setState((prevState) => {
      prevState[target] = isValid;
      return prevState;
    });
  };

  OnFormChange = (event) => {
    event.target.error = true;

    this.setState((prevState) => {
      prevState[event.target.id] = event.target.value;
      return prevState;
    });

    this.Validate(event);
  };

  ShowMessage = (type, msg) => {
    this.child.current.HandleClick({ type, msg });
  };

  Register = async (event) => {
    event.preventDefault();

    const isValid = this.Validator();
    if (!isValid) {
      return 0;
    }

    this.setState((prevState) => {
      prevState.isLoading = true;
      return prevState;
    });

    const userData = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.password,
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
      const json = await response.json();
      if (json.code === "999") {
        this.ShowMessage("error", json.message);
      } else if (json.code === "10") {
        this.props.loginStatus("Y", json.body);
      } else {
        this.ShowMessage("error", `There is an error fetching results`);
      }
    } catch (error) {
      this.ShowMessage("error", `There is an error fetching results`);
    }
    this.setState((prevState) => {
      prevState.isLoading = false;
      return prevState;
    });
  };

  render() {
    const {
      isUsernameValid,
      // isPhoneValid,
      isEmailValid,
      isPasswordValid,
      arePasswordsMatching,
    } = this.state;

    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <div className="paper">
          <h1 className="signUpTitle">Register now</h1>

          <form className="form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  // autoFocus
                  onChange={this.OnFormChange}
                  error={!isUsernameValid}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.overrides,
                      focused: classes.overrides,
                      notchedOutline: classes.overrides,
                    },
                  }}
                />
              </Grid>

              {/* <Grid item xs={5}>
                <TextField
                  autoComplete="phone"
                  name="phone"
                  variant="outlined"
                  required
                  fullWidth
                  id="phone"
                  label="Phone"
                  onChange={this.OnFormChange}
                  error={!isPhoneValid}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
              </Grid> */}

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  name="email"
                  autoComplete="email"
                  onChange={this.OnFormChange}
                  error={!isEmailValid}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.OnFormChange}
                  error={!isPasswordValid}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-password"
                  onChange={this.OnFormChange}
                  error={!arePasswordsMatching}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      required
                      value="recieveNotifications"
                      color="default"
                      inputlabelprops={{
                        classes: {
                          root: classes.cssLabel,
                          focused: classes.cssFocused,
                        },
                      }}
                    />
                  }
                  label="I'll receive notifications to both email and phone"
                  className="labelText"
                />
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="submit"
                id="signUpBtn"
                onClick={this.Register}
              >
                Sign Up
              </Button>

              <Grid container justify="flex-end" className="link">
                <Grid item>
                  <Link
                    to="/login"
                    // href="#"
                    variant="body2"
                    // onClick={() => this.props.changeAuthOption("login")}
                    className="link"
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </div>
        <MyAlert ref={this.child} />
      </Container>
    );
  }
}

// SignUp.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(SignUp);
