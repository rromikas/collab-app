import React, { useRef } from "react";
import { connect } from "react-redux";
import history from "../../../history";
import { BsChevronLeft } from "react-icons/bs";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import { BsBell } from "react-icons/bs";
import * as firebase from "../../../database/firebase";
import { uid } from "react-uid";
import randomColor from "randomcolor";
import {
  MarkNotificationsAsChecked,
  AnswerToInvitation,
} from "../../../database/api";

const Navbar = ({ pageTitle, user, backlink }) => {
  const userPhoto = useRef(null);
  const bell = useRef(null);
  let notifications = user.notifications ? user.notifications : {};

  return (
    <div className="row no-gutters justify-content-between align-items-center px-3 px-lg-4 py-2 flex-nowrap">
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
          <div className="col-auto h2 mb-0 d-md-block d-none">{pageTitle}</div>
        </div>
      </div>

      <div className="col-auto">
        <div
          className="row no-gutters"
          style={{ lineHeight: "38px", alignItems: "center" }}
        >
          <Popover
            onHide={() => MarkNotificationsAsChecked(user)}
            content={
              <div
                className="popover-inner"
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                <div className="popover-label border-bottom">Unseen</div>
                {Object.values(notifications)
                  .filter((x) => !x.seen)
                  .reverse()
                  .map((x) => (
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
                                AnswerToInvitation("Accepted", x, user, x.id)
                              }
                            >
                              Accept
                            </div>
                            <div
                              className="btn"
                              onClick={() =>
                                AnswerToInvitation("Rejected", x, user, x.id)
                              }
                            >
                              Reject
                            </div>
                          </div>
                        )}

                        {x.type === "request" && (
                          <div className="row no-gutters">
                            <div
                              className="col-auto btn-pro"
                              onClick={() => {
                                history.push(
                                  `/${user.id}/projects/${x.projectId}/requests/${x.requestId}`
                                );
                                bell.current.click();
                              }}
                            >
                              View more
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
                {Object.values(notifications)
                  .filter((x) => x.seen)
                  .reverse()
                  .map((x) => (
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
                        {x.status === "asked" ? (
                          x.type === "invitation" && (
                            <div className="row no-gutters w-100 mb-2">
                              <div
                                className="btn-pro mr-2"
                                onClick={() =>
                                  AnswerToInvitation("Accepted", x, user, x.id)
                                }
                              >
                                Accept
                              </div>
                              <div
                                className="btn"
                                onClick={() =>
                                  AnswerToInvitation("Rejected", x, user, x.id)
                                }
                              >
                                Reject
                              </div>
                            </div>
                          )
                        ) : (
                          <div
                            className="badge badge-primary"
                            style={{ fontSize: "14px" }}
                          >
                            {x.status}
                          </div>
                        )}

                        {x.type === "request" && (
                          <div className="row no-gutters">
                            <div
                              className="col-auto btn-pro"
                              onClick={() => {
                                history.push(
                                  `/${user.id}/projects/${x.projectId}/requests/${x.requestId}`
                                );
                              }}
                            >
                              View more
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
                {Object.values(notifications).filter((x) => !x.seen).length}
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
