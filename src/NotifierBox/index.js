import "date-fns";
import React from "react";
import Button from "@material-ui/core/Button";
import NotificationsActiveTwoToneIcon from "@material-ui/icons/NotificationsActiveTwoTone";
import MyAlert from "../MyAlert";

class NotifierBox extends React.Component {
  constructor(props) {
    super();
    this.state = {
      username: "",
      email: "",
      notifier_status: "",
      notifier_state: "",
      notifier_district: "",
      notifier_cooldown: "",
    };
    this.child = React.createRef();
  }

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

  RenderDelete = (data) => {
    this.props.deleteNotifier(data);
    this.setState({
      username: data.username,
      email: data.email,
      notifier_status: "",
      notifier_state: "",
      notifier_district: "",
      notifier_cooldown: "",
    });
  };

  RenderUpdate = async () => {
    const userData = this.props.getStateData();
    if (userData) {
      if (userData.notifier_state && userData.notifier_district) {
        const { stateData, userInfo } = this.props;
        this.props.createNotifier(stateData, userInfo);
        this.setState({
          username: userInfo.username,
          email: userInfo.email,
          notifier_status: true,
          notifier_state: userData.notifier_state,
          notifier_district: userData.notifier_district,
          notifier_cooldown: 7,
        });
        this.ShowMessage("success", "Notifier Updated Successfully");
      }
    }
  };

  async componentDidMount() {
    let json = await this.GetUserNotificationData(this.props.userInfo.name);
    this.setState(json.body.Item);
  }

  render() {
    const userData = this.state;
    const user = this.props.userInfo;
    const dataLength =
      userData.notifier_state.length +
      userData.notifier_district.length +
      user.email.length;
    return (
      <>
        <div className="dashboard-user">
          <div className="notifier-section">
            {/* <img src={user.picture} alt="pic" className="profile-pic" /> */}

            {/* <div> userdata {JSON.stringify(user, null, 2)}</div> */}
            {userData.notifier_status ? (
              <h1 className="notifier-section-title">Your notifier is live</h1>
            ) : (
              <h1 className="notifier-section-title">
                Your notifier will appear here
              </h1>
            )}
            <br />
            {userData.notifier_status ? (
              <div className="notifier-item">
                {dataLength < 45 ? (
                  <p className="notifier-location">
                    {userData.notifier_state} {"-->"}{" "}
                    {userData.notifier_district} {"--> "}
                    <NotificationsActiveTwoToneIcon className="alarm-icon" />
                    {"   "}
                    {" --> "} {user.email}
                  </p>
                ) : (
                  <p className="notifier-location-vert">
                    {userData.notifier_state}
                    <br />
                    {"|"} <br />
                    {userData.notifier_district} <br /> {"|"}
                    <br />
                    <NotificationsActiveTwoToneIcon className="alarm-icon" />
                    {"|"}
                    <br />
                    {user.email}
                  </p>
                )}
                <p>Notification cool-down: {userData.notifier_cooldown} days</p>
                <Button
                  className="notifier-buttons"
                  onClick={() => {
                    this.RenderUpdate();
                  }}
                  variant="contained"
                >
                  Update Notifier
                </Button>
                <Button
                  className="notifier-buttons"
                  onClick={() => {
                    const userData = user;
                    this.RenderDelete(userData);
                  }}
                  variant="contained"
                >
                  Delete Notifier
                </Button>
              </div>
            ) : (
              <div className="notifier-item">
                <p className="no-active">No active notifiers!</p>
                <Button
                  className="notifier-buttons"
                  onClick={() => {
                    this.RenderUpdate();
                  }}
                  variant="contained"
                >
                  Create Notifier
                </Button>
              </div>
            )}
          </div>
        </div>
        <MyAlert ref={this.child} />
      </>
    );
  }
}

export default NotifierBox;
