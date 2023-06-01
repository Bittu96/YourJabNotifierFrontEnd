import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUpForm from "./AuthForms/SignUpForm";
import SignInForm from "./AuthForms/SignInForm";
import Dashboard from "./Dashboard";
import MyForm from "./MyForm";
import "./App.css";

class App extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     userProfileData: {
  //       // userLoggedIn: false,
  //       username: "Champ",
  //       email: "champ@email.com",
  //       notifierStatus: false,
  //       notifierState: "",
  //       notifierDistrict: "",
  //       notifierCooldownLimit: 7,
  //       notifierCooldown: 0,
  //       // tier: "Free",
  //     },
  //     isAuthRequested: false,
  //     authOption: "login",
  //   };
  // }

  // ChangeAuthOption = (option) => {
  //   this.setState((prevState) => {
  //     if (option === "request") {
  //       prevState.isAuthRequested = true;
  //     } else if (option === "Home") {
  //       prevState.isAuthRequested = false;
  //     } else {
  //       prevState.authOption = option;
  //     }
  //     return prevState;
  //   });
  // };

  // Logout = () => {
  //   this.setState({
  //     userProfileData: {
  //       userLoggedIn: false,
  //       username: "Champ",
  //       email: "",
  //       isEmailVerified: false,
  //       notifierStatus: false,
  //       notifierState: "",
  //       notifierDistrict: "",
  //       notifierCooldownLimit: 30,
  //       notifierCooldownIn: 0,
  //       // tier: "Free",
  //     },
  //     isAuthRequested: false,
  //     authOption: "login",
  //   });
  // };

  // LoginStatus = (flag, userData) => {
  //   if (flag === "Y") {
  //     this.setState((prevState) => {
  //       prevState.userProfileData.userLoggedIn = true;
  //       prevState.userProfileData.username = userData.username;
  //       prevState.userProfileData.email = userData.email;
  //       prevState.userProfileData.isEmailVerified = userData.is_email_verified;
  //       prevState.userProfileData.notifierStatus = userData.notifier_status;
  //       prevState.userProfileData.notifierState = userData.notifier_state;
  //       prevState.userProfileData.notifierDistrict = userData.notifier_district;
  //       prevState.userProfileData.notifierCooldown = userData.notifier_cooldown;
  //       prevState.userProfileData.notifierCooldownLimit =
  //         userData.notifier_cooldown_limit;
  //       prevState.isAuthRequested = false;
  //       return prevState;
  //     });
  //   } else {
  //     this.Logout();
  //   }
  // };

  render() {
    // const { userProfileData } = this.state;

    return (
      <Router>
        <div className="mainBg">
          <div className="footer">
            Thanks for visiting... Please give your valuable feedback
            <Link to="/feedback">
              <span className="feedback-here">here</span>
            </Link>
          </div>
          <div className="bg">
            <Link to="/" className="link-style">
              <h1 className="title">YourJabNotifier!</h1>
            </Link>
            <Switch>
              <Route path="/login">
                <SignInForm
                // changeAuthOption={this.ChangeAuthOption}
                // loginStatus={this.LoginStatus}
                />
              </Route>
              <Route path="/register">
                <SignUpForm
                // changeAuthOption={this.ChangeAuthOption}
                // loginStatus={this.LoginStatus}
                />
              </Route>
              <Route path="/feedback">
                <MyForm />
              </Route>
              <Route path="/">
                <Dashboard
                // userProfileData={userProfileData}
                // loginStatus={this.LoginStatus}
                // changeAuthOption={this.ChangeAuthOption}
                // createNotifier={this.CreateNotifier}
                // deleteNotifier={this.DeleteNotifier}
                />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
