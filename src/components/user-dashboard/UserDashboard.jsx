import React, { useEffect } from "react";
import AdminDashboard from "../admin-dashboard/AdminDashboard";
import ClientDashboard from "../client-dashboard/ClientDashboard";
import { connect } from "react-redux";
import history from "../../history";
import * as firebase from "../../database/firebase";
import store from "../../store/store";

const UserDashboard = ({ user, ...rest }) => {
  useEffect(() => {
    if (!user.id) {
      history.push("/");
    }
  }, [user.id]);

  useEffect(() => {
    firebase.on(`users/${user.id}`, (data) => {
      store.dispatch({ type: "SET_USER", user: data });
    });

    return function cleanUp() {
      firebase.off(`users/${user.id}`);
    };
  }, [user.id]);

  return user.accountType === "client" && true === false ? (
    <ClientDashboard {...rest}></ClientDashboard>
  ) : (
    <AdminDashboard {...rest} user={user}></AdminDashboard>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(UserDashboard);
