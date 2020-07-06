import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaCheck, FaCamera } from "react-icons/fa";
import PhotoUploader from "./PhotoUploader";
import history from "../../history";
import store from "../../store/store";
import date from "date-and-time";
import * as firebase from "../../database/firebase";
import { uid } from "react-uid";
import { connect } from "react-redux";

const Profile = ({ user, projects, users }) => {
  const hiddenUploader = useRef(null);
  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "" });
  }, []);

  const userDataShema = [
    "name",
    "surname",
    "phone number",
    "location",
    "website",
    "linkedin",
  ];

  const [userData, setUserData] = useState({
    username: users[user.id]
      ? users[user.id].username
        ? users[user.id].username
        : ""
      : "",
    surname: users[user.id]
      ? users[user.id].surname
        ? users[user.id].surname
        : ""
      : "",
    phone: users[user.id]
      ? users[user.id].phone
        ? users[user.id].phone
        : ""
      : "",
    location: users[user.id]
      ? users[user.id].location
        ? users[user.id].location
        : ""
      : "",
    website: users[user.id]
      ? users[user.id].website
        ? users[user.id].website
        : ""
      : "",
    linkedin: users[user.id]
      ? users[user.id].linkedin
        ? users[user.id].linkedin
        : ""
      : "",
  });

  const [edit, setEdit] = useState(false);

  return (
    <div className="row no-gutters justify-content-center">
      <div className="col-12 col-md-4 col-lg-3 p-3 position-relative">
        <div className="row no-gutters justify-content-center project-card p-4 bg-white">
          <div className="col-12">
            <div
              className="bg-image mx-auto"
              style={{
                width: "120px",
                height: "120px",
                background: "white",
                overflow: "hidden",
                position: "relative",
                backgroundImage: users[user.id]
                  ? users[user.id].photo !== ""
                    ? `url(${users[user.id].photo})`
                    : "unset"
                  : "unset",
              }}
            >
              <div
                className="w-100 d-flex justify-content-center img-uploader align-items-center pointer"
                onClick={() => hiddenUploader.current.click()}
              >
                <FaCamera fontSize="20px" color="white"></FaCamera>
                <PhotoUploader
                  domRef={hiddenUploader}
                  onUpload={(photo) => {
                    store.dispatch({
                      type: "SET_USER",
                      user: {
                        photo: photo,
                      },
                    });
                  }}
                ></PhotoUploader>
              </div>
            </div>
          </div>
          <div className="col-12 mx-2 ml-md-3 mr-md-3">
            <div className="text-center mt-3 h1 text-truncate">
              {users[user.id] ? users[user.id].username : ""}
            </div>
          </div>
          <div className="col-12">
            {Object.keys(userData)
              .filter((x) => x !== "password")
              .map((x) => (
                <div className="row no-gutters" key={uid(x)}>
                  <div className="col-12">
                    <label>{x === "username" ? "name" : x}</label>
                    {/* <div style={{ minHeight: "20px" }}>{userData[x]}</div> */}
                    <div className="w-100 text-center mb-2">
                      <input
                        disabled={!edit}
                        value={userData[x]}
                        onChange={(e) => {
                          e.persist();
                          setUserData((prev) =>
                            Object.assign({}, prev, { [x]: e.target.value })
                          );
                        }}
                        type="text"
                        className="w-100 profile-input"
                      ></input>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-12">
            <div className="row no-gutters justify-content-center">
              <div
                className="col-auto btn mx-1 mb-2"
                onClick={() => {
                  if (edit) {
                    let updates = {};
                    updates[`publicUsers/${user.id}`] = Object.assign(
                      {},
                      users[user.id],
                      userData
                    );
                    firebase.UpdateDatabase(updates);
                  }
                  setEdit(!edit);
                }}
              >
                {edit ? "Save" : "Edit profile"}
              </div>
              <div
                className="col-auto mx-1 btn-pro"
                onClick={() => {
                  store.dispatch({
                    type: "SET_USER",
                    user: { email: "", id: "", photo: "", name: "" },
                  });
                  localStorage["secret_token"] = "";
                  history.push("/");
                }}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
      {Object.values(projects).length ? (
        <div className="col-12 col-md-8 p-3">
          {Object.values(projects).map((x) => (
            <div className="row no-gutters project-card p-4 bg-white mb-3">
              <div className="col">
                <label>Title</label>
                <div className="mb-3 text-truncate">{x.title}</div>
                <label>Description</label>
                <div className="mb-3">{x.description}</div>
                <label>Creator</label>
                <div className="row no-gutters w-100 mb-3 align-items-center">
                  <div
                    className="col-auto bg-image mr-2"
                    style={{
                      height: "40px",
                      width: "40px",
                      backgroundImage: `url(${
                        users[x.user_id] ? users[x.user_id].photo : ""
                      })`,
                    }}
                  ></div>
                  <div className="col">
                    {users[x.user_id] ? users[x.user_id].username : ""}
                  </div>
                </div>
                <label>Date</label>
                <div className="mb-3">
                  {date.format(new Date(x.date), "DD MMM, YYYY")}
                </div>
              </div>
              <div className="col-auto">
                <div className="row no-gutters">
                  <div
                    className="col-auto btn-pro"
                    onClick={() => history.push(`/${user.id}/projects/${x.id}`)}
                  >
                    Go to project page
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-12 col-md-8 p-3">
          <div className="row no-gutters project-card p-4 bg-white">
            No projects so far
          </div>
        </div>
      )}
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    users: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(Profile);
