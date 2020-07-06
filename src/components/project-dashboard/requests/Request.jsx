import React, { useEffect, useState } from "react";
import * as firebase from "../../../database/firebase";
import { BsFillReplyFill, BsCheck, BsX, BsChevronLeft } from "react-icons/bs";
import Agreement from "../../../pictures/Agreement";
import date from "date-and-time";
import history from "../../../history";
import uniqid from "uniqid";
import { connect } from "react-redux";

const Request = ({ projectId, requestId, user, users }) => {
  const [request, setRequest] = useState({
    title: "",
    description: "",
    status: "",
    date: new Date(),
    user_id: "",
    discussion: {},
  });

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    firebase.on(`projects/${projectId}/requests/${requestId}`, (data) => {
      if (data) {
        data.discussion = data.discussion ? data.discussion : {};
        setRequest(data);
      }
    });
    return function cleanUp() {
      firebase.off(`projects/${projectId}/requests/${requestId}`);
    };
  }, [requestId]);

  return (
    <div className="row no-gutters pb-5">
      <div classNames="col-12">
        <div
          className="row no-gutters align-items-center mb-3 py-2 px-3"
          style={{ fontSize: "21px" }}
        >
          <div
            className="col-auto mr-1 cursor-pointer"
            onClick={() => history.goBack()}
          >
            <BsChevronLeft fontSize="12px"></BsChevronLeft>
          </div>
          <div
            className="col-auto mr-2 cursor-pointer"
            onClick={() => history.goBack()}
            style={{ fontSize: "14px" }}
          >
            Requests /
          </div>
          <div className="col-auto mr-2">{request.title}</div>
        </div>
      </div>
      <div className="col-12">
        <div className="row no-gutters">
          <div className="col-xl-3 col-4 d-none d-md-block">
            <div
              className="row no-gutters justify-content-end"
              style={{
                marginTop: "-25px",
                transform: "translateY(25px)",
              }}
            >
              <div
                className={`text-white col-5 col-sm-4 col-md-3 p-2${
                  request.status === "pending"
                    ? " bg-primary"
                    : request.status === "reached"
                    ? " bg-success"
                    : " bg-danger"
                }`}
                style={{
                  borderRadius: "50%",
                }}
              >
                <div className="d-flex"></div>
                {request.status === "pending" ? (
                  <BsFillReplyFill size={"100%"}></BsFillReplyFill>
                ) : request.status === "reached" ? (
                  <BsCheck size={"100%"}></BsCheck>
                ) : (
                  <BsX size={"100%"}></BsX>
                )}
              </div>
            </div>

            <div className="row no-gutters">
              <Agreement></Agreement>
            </div>
          </div>
          <div className="col px-3 text-break">
            <div className="d-flex">
              <h4 className="mr-2">
                <span
                  className={`badge badge-${
                    request.status === "pending"
                      ? "primary"
                      : request.status === "reached"
                      ? "success"
                      : "danger"
                  }`}
                >
                  Agreement is {request.status}
                </span>
              </h4>
              {user.accountType === "client" && (
                <React.Fragment>
                  <div
                    className="mr-2 btn-pro"
                    onClick={() => {
                      let updates = {};
                      updates[
                        `projects/${projectId}/requests/${requestId}/status`
                      ] = "reached";
                      firebase.UpdateDatabase(updates);
                    }}
                  >
                    Accept
                  </div>
                  <div
                    className="btn"
                    onClick={() => {
                      let updates = {};
                      updates[
                        `projects/${projectId}/requests/${requestId}/status`
                      ] = "not reached";
                      firebase.UpdateDatabase(updates);
                    }}
                  >
                    Reject
                  </div>
                </React.Fragment>
              )}
            </div>

            <div className="row no-gutters border-bottom my-3">
              <div className="mr-4 col-auto">
                <label className="mr-2">Author</label>
                <div className="text-primary">
                  {users[request.user_id]
                    ? users[request.user_id].username
                    : ""}
                </div>
              </div>
              <div className="mr-2 col-auto">
                <label>Date</label>
                <div>{date.format(new Date(request.date), "MMM DD, YYYY")}</div>
              </div>
            </div>

            <div className="row no-gutters request-title mb-2">
              <div className="col-12">{request.title}</div>
            </div>
            <div className="row no-gutters">
              <div style={{ minHeight: "200px" }} className="col-12">
                {request.description}
              </div>
            </div>
          </div>
        </div>
        <div
          className="row no-gutters mx-auto px-3"
          style={{ maxWidth: "800px" }}
        >
          <div className="col-12 mb-3" style={{ fontSize: "20px" }}>
            Discussion
          </div>
          <div className="col-12 mb-3">
            {Object.values(request.discussion).length ? (
              Object.values(request.discussion).map((x) => (
                <div className="row no-gutters p-3 border">
                  <div
                    className="col-auto mr-3 bg-image square-50"
                    style={{
                      backgroundImage: `url(${
                        users[x.user_id] ? users[x.user_id].photo : ""
                      })`,
                    }}
                  ></div>
                  <div className="col">
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto mr-2 alt-chat-author">
                        {users[x.user_id] ? users[x.user_id].username : ""}
                      </div>
                      <div className="col-auto alt-chat-date">
                        {x.date
                          ? date.format(new Date(x.date), "DD MMM, YYYY")
                          : ""}
                      </div>
                    </div>
                    <div className="row no-gutters">{x.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="row no-gutters p-3 border">
                No messages in discussion
              </div>
            )}
          </div>
          <div className="col-lg-7 col-12">
            <div className="row no-gutters align-items-center">
              <div className="col">
                <div className="row no-gutters">
                  <input
                    onKeyUp={(e) => {
                      if (e.keyCode === 13) {
                        let updates = {};
                        updates[
                          `projects/${projectId}/requests/${requestId}/discussion/${uniqid(
                            "message-"
                          )}`
                        ] = {
                          message: newMessage,
                          date: new Date(),
                          user_id: user.id,
                        };
                        firebase.UpdateDatabase(updates);
                        setNewMessage("");
                      }
                    }}
                    className="col mr-2"
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      e.persist();
                      setNewMessage(e.target.value);
                    }}
                  ></input>
                  <div
                    className="btn-pro col-auto"
                    onClick={() => {
                      let updates = {};
                      updates[
                        `projects/${projectId}/requests/${requestId}/discussion/${uniqid(
                          "message-"
                        )}`
                      ] = {
                        message: newMessage,
                        date: new Date(),
                        user_id: user.id,
                      };
                      firebase.UpdateDatabase(updates);
                      setNewMessage("");
                    }}
                  >
                    Send
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    users: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(Request);
