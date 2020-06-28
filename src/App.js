import React, { useEffect, useState } from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import UserDashobard from "./components/user-dashboard/UserDashboard";
import { connect } from "react-redux";
import store from "./store/store";
import { AuthenticateUser } from "./Authentication";
import * as firebase from "./database/firebase";
import { uid } from "react-uid";
import md5 from "md5";
import date from "date-and-time";
import Loader from "./components/utility/Loader";

const accounts = {
  [md5("admin1@email.com")]: {
    photo:
      "https://images.pexels.com/photos/4354418/pexels-photo-4354418.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    email: "admin1@email.com",
    id: md5("admin1@email.com"),
    username: "admin 1",
    password: "admin 1",
    accountType: "admin",
  },
  [md5("admin2@email.com")]: {
    photo:
      "https://images.pexels.com/photos/4312101/pexels-photo-4312101.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    email: "admin2@email.com",
    id: md5("admin2@email.com"),
    username: "admin 2",
    password: "admin 2",
    accountType: "admin",
  },
  [md5("client1@email.com")]: {
    photo:
      "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    email: "client1@email.com",
    username: "client 1",
    password: "client 1",
    accountType: "client",
    id: md5("client1@email.com"),
  },
  [md5("client2@email.com")]: {
    photo:
      "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    email: "client2@email.com",
    username: "client 2",
    password: "client 2",
    accountType: "client",
    id: md5("client2@email.com"),
  },
};

function createDemoUser() {
  let updates = {};
  Object.keys(accounts).forEach((x) => {
    updates[`users/${x}`] = accounts[x];
  });

  firebase.UpdateDatabase(updates);
}
// createDemoUser();

const MainPage = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div
      className="row no-gutters px-2 px-sm-3 px-md-4 py-3 mx-auto vh-100 align-items-center justify-content-center"
      style={{ maxWidth: "500px" }}
    >
      {loading ? (
        <Loader loading={loading} size={100}></Loader>
      ) : (
        <div className="col-12">
          {Object.values(accounts).map((x) => (
            <div
              key={uid(x)}
              className="row no-gutters p-3 basic-card mb-3 justify-content-between"
            >
              <div className="col-auto">
                <div className="row no-gutters align-items-center">
                  <div
                    className="col-auto mr-2 photo-circle-sm"
                    style={{
                      backgroundImage: `url(${x.photo})`,
                    }}
                  ></div>
                  <div className="col-auto mr-2">{x.email}</div>
                </div>
              </div>

              <div
                className="col-auto btn"
                onClick={() => {
                  setLoading(true);
                  AuthenticateUser(x).then((data) => {
                    setLoading(false);
                    if (data.error) {
                    } else {
                      store.dispatch({
                        type: "SET_USER",
                        user: data,
                      });
                    }
                  });
                }}
              >
                Login
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const resizer = () => {
  store.dispatch({
    type: "SET_SIZE",
    size: { width: window.innerWidth, height: window.innerHeight },
  });
};

function App({ user }) {
  useEffect(() => {
    window.addEventListener("resize", resizer);
    return function cleanUp() {
      window.removeEventListener("resize", resizer);
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      history.push(
        user.accountType === "admin"
          ? `/${user.id}/projects`
          : `/${user.id}/profile`
      );
    } else {
      history.push("/");
      store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Select Account" });
    }
  }, [user.id]);
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={MainPage}></Route>
        <Route
          path="/:userId/:page/:projectId/:section"
          component={UserDashobard}
        ></Route>
        <Route
          path="/:userId/:page/:projectId"
          component={UserDashobard}
        ></Route>
        <Route path="/:userId/:page" component={UserDashobard}></Route>
        <Route path="/:userId" component={UserDashobard}></Route>
      </Switch>
    </Router>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(App);
