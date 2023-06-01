import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { CircularProgress } from "@material-ui/core";
import MyAlert from "../../MyAlert";
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

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      isUsernameValid: true,
      password: "",
      isPasswordValid: true,
      isLoading: false,
    };
    this.child = React.createRef();
  }

  OnFormChange = (event) => {
    event.target.error = true;

    this.setState((prevState) => {
      prevState[event.target.id] = event.target.value;
      prevState.isUsernameValid = prevState.username !== "";
      prevState.isPasswordValid = prevState.password !== "";
      return prevState;
    });
  };

  LoginSubmitHandler = (event) => {
    event.preventDefault();
    this.props.changeSignInOption(this.state);
  };

  Validate = () => {
    const { username, password } = this.state;
    let isValid = false;
    if (!username) {
      this.ShowMessage("error", `Enter Username`);
    } else if (!password) {
      this.ShowMessage("error", `Enter Password`);
    } else {
      isValid = true;
    }
    this.setState((prevState) => {
      prevState.isUsernameValid = username !== "";
      prevState.isPasswordValid = password !== "";
      return prevState;
    });
    return isValid;
  };

  Login = async (event) => {
    event.preventDefault();

    const isValid = this.Validate();
    if (!isValid) {
      return 0;
    }

    this.setState((prevState) => {
      prevState.isLoading = true;
      return prevState;
    });

    const userData = this.state;

    const url = `https://mktiqcxv1i.execute-api.ap-south-1.amazonaws.com/live/login-test`;
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
      if (json.code === "99" || json.code === "9") {
        this.ShowMessage("error", json.message);
      } else if (json.code === "1") {
        this.props.loginStatus("Y", json.body);
      } else {
        this.ShowMessage("error", `There is an error fetching results`);
      }
    } catch (error) {
      this.ShowMessage("error", `There is an error fetching results ${error}`);
    }
    this.setState((prevState) => {
      prevState.isLoading = false;
      return prevState;
    });
  };

  ShowMessage = (type, msg) => {
    this.child.current.HandleClick({ type, msg });
  };

  render() {
    const { classes } = this.props;
    const { isUsernameValid, isPasswordValid, isLoading } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <div className="paper">
          <h1 className="signUpTitle">Sign In</h1>

          <form className="form">
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  error={!isUsernameValid}
                  // autoFocus
                  onChange={this.OnFormChange}
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  className="text-field"
                  error={!isPasswordValid}
                  onChange={this.OnFormChange}
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
                  control={<Checkbox value="remember" color="default" />}
                  label="Remember me"
                  className="labelText"
                />
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="submit"
                id="signInBtn"
                onClick={this.Login}
              >
                {!isLoading && "Sign In"}
                {isLoading && <CircularProgress color="inherit" />}
              </Button>
              {/* <div className="loading">{isLoading && <LoadingCircle />}</div> */}
              <Grid item xs={12}>
                <br />
                <Grid container justify="flex-end">
                  <Grid item xs>
                    <Link
                      to="/forgot"
                      href="#"
                      variant="body2"
                      className="link"
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/register" className="link">
                      <span
                        variant="body2"
                        className="link"
                        // onClick={() => this.props.changeAuthOption("register")}
                      >
                        {"Don't have an account? Sign Up"}
                      </span>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </div>
        {/* <Messages ref={this.child} /> */}
        <MyAlert ref={this.child} />
      </Container>
    );
  }
}

export default withStyles(styles)(SignIn);
