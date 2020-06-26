import React, { useRef } from "react";
import { connect } from "react-redux";
import history from "../../../history";
import { BsChevronLeft } from "react-icons/bs";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import { BsBell } from "react-icons/bs";
import * as firebase from "../../../database/firebase";
import { uid } from "react-uid";

const answerToInvitation = (answer, invitation, user) => {
  let updates = {};
  updates[
    `users/${user.id}/notifications/seen/${invitation.id}`
  ] = Object.assign({}, invitation, { answer: answer });
  updates[`users/${user.id}/notifications/unseen/${invitation.id}`] = [];

  if (answer === "rejected") {
    updates[`projects/${invitation.project.id}/people/${user.id}`] = [];
  } else {
    updates[`projects/${invitation.project.id}/people/${user.id}`] = {
      status: answer,
      permissions: invitation.permissions,
      photo: user.photo,
      username: user.username,
      id: user.id,
      email: user.email,
    };
    updates[`users/${user.id}/projects/${invitation.project.id}`] =
      invitation.project;
  }

  firebase.UpdateDatabase(updates);
};

const Navbar = ({ pageTitle, user, backlink }) => {
  const userPhoto = useRef(null);
  let notifications = { ...user.notifications };
  let unseen = notifications.unseen;
  let seen = notifications.seen;
  if (!unseen) {
    unseen = {};
  }
  if (!seen) {
    seen = {};
  }
  return (
    <div className="row no-gutters justify-content-between px-2 px-md-3 px-lg-4">
      <div className="col-auto mb-2">
        <div className="row no-gutters align-items-center">
          {backlink.title !== "" && (
            <div
              className="col-auto mr-2 clickable-item"
              onClick={() => history.push(`${backlink.path}`)}
            >
              <BsChevronLeft fontSize="16px"></BsChevronLeft>
              {backlink.title}
            </div>
          )}
          <div className="col-auto h2 mb-0">{pageTitle}</div>
        </div>
      </div>

      <div className="col-auto">
        <div
          className="row no-gutters"
          style={{ lineHeight: "38px", alignItems: "center" }}
        >
          <Popover
            content={
              <div className="popover-inner">
                <div className="popover-label border-bottom">Unseen</div>
                {Object.values(unseen).map((x) => (
                  <div
                    className="notification-item d-flex border-bottom"
                    key={uid(x)}
                  >
                    <div
                      className="col-auto photo-circle-sm mr-2"
                      style={{ backgroundImage: `url(${x.photo})` }}
                    ></div>
                    <div className="col px-0">
                      <div className="row no-gutters mb-2">{x.text}</div>
                      {x.type === "invitation" && (
                        <div className="row no-gutters w-100 mb-2">
                          <div
                            className="btn-pro mr-2"
                            onClick={() =>
                              answerToInvitation("Accepted", x, user)
                            }
                          >
                            Accept
                          </div>
                          <div
                            className="btn"
                            onClick={() =>
                              answerToInvitation("Rejected", x, user)
                            }
                          >
                            Reject
                          </div>
                        </div>
                      )}
                      <div
                        className="row no-gutters"
                        style={{ fontSize: "12px" }}
                      >
                        {new Date(x.date).toDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="popover-label border-bottom">Seen</div>
                {Object.values(seen).map((x) => (
                  <div className="notification-item d-flex" key={uid(x)}>
                    <div
                      className="col-auto photo-circle-sm mr-2"
                      style={{ backgroundImage: `url(${x.photo})` }}
                    ></div>
                    <div className="col">
                      <div className="row no-gutters">{x.text}</div>
                      {x.type === "invitation" && (
                        <div
                          className={`row no-gutters${
                            x.answer === "Accepted"
                              ? " text-success"
                              : " text-danger"
                          }`}
                        >
                          {x.answer}
                        </div>
                      )}
                      <div
                        className="row no-gutters"
                        style={{ fontSize: "12px" }}
                      >
                        {new Date(x.date).toDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <div className="position-relative mx-4 navbar-icon">
              <div
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  background: "#0a80ff",
                  top: "0px",
                  right: "0px",
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                {Object.keys(unseen).length}
              </div>
              <BsBell fontSize="18px" strokeWidth="0.5px"></BsBell>
            </div>
          </Popover>

          <Popover
            content={
              <div className="popover-inner">
                <div
                  className="popover-content-item"
                  onClick={() => {
                    store.dispatch({
                      type: "SET_USER",
                      user: {
                        photo: "",
                        username: "",
                        email: "",
                        id: "",
                        notifications: { unseen: {}, seen: {} },
                        messages: {},
                        events: {},
                        people: {},
                        projects: {},
                      },
                    });
                    userPhoto.current.click();
                  }}
                >
                  Logout
                </div>
              </div>
            }
          >
            <div className="mr-2 navbar-icon cursor-pointer" ref={userPhoto}>
              <div
                className="photo-circle-sm"
                style={{
                  backgroundImage: `url(${user.photo})`,
                }}
              ></div>
            </div>
          </Popover>

          <div className="col d-none d-md-block">{user.email}</div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    pageTitle: state.pageTitle,
    user: state.user,
    backlink: state.backlink,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(Navbar);
