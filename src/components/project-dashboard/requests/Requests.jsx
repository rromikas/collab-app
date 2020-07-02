import React, { useRef, useEffect, useState } from "react";
import history from "../../../history";
import Agreement from "../../../pictures/Agreement";
import * as firebase from "../../../database/firebase";
import date from "date-and-time";
import { BsX, BsCheck, BsReply, BsFillReplyFill } from "react-icons/bs";
import Popover from "../../utility/Popover";
import { uid } from "react-uid";

const filters = ["All", "Pending", "Agreed", "Disagreed"];

const Requests = ({ projectId, user, size }) => {
  const filterChooser = useRef(null);
  const containerMinHeight =
    size.width > 768 ? size.height - 76 - 24 - 56 : size.height - 76 - 56;
  const [requests, setRequests] = useState({});
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    firebase.on(`projects/${projectId}/requests`, (data) => {
      setRequests(data ? data : {});
    });
    return function cleanUp() {
      firebase.off(`projects/${projectId}/requests`);
    };
  }, []);
  return (
    <div
      className="row no-gutters bg-light"
      style={{ minHeight: `${containerMinHeight}px` }}
    >
      <div className="col-12">
        <div className="row no-gutters justify-content-between p-3">
          <div
            className="col-auto btn-pro"
            onClick={() =>
              history.push(`/${user.id}/projects/${projectId}/requests/new`)
            }
          >
            Create request
          </div>
          <div className="col-auto">
            <Popover
              content={
                <div className="popover-inner">
                  {filters.map((x) => (
                    <div
                      key={uid(x)}
                      className="popover-content-item"
                      onClick={() => {
                        setFilter(x);
                        filterChooser.current.click();
                      }}
                    >
                      {x}
                    </div>
                  ))}
                </div>
              }
            >
              <div className="col-auto btn" ref={filterChooser}>
                Show {filter}
              </div>
            </Popover>
          </div>
        </div>
        <div className="row no-gutters">
          {Object.values(requests)
            .filter((x) =>
              filter === "All"
                ? x
                : filter === "Pending"
                ? x.status === "pending"
                : filter === "Agreed"
                ? x.status === "reached"
                : filter === "Disagreed"
                ? x.status === "not reached"
                : x
            )
            .map((x) => (
              <div className="col-xl-6 col-12" key={uid(x)}>
                <div className="row no-gutters m-3 basic-card p-4">
                  <div
                    className="col-lg-3 col-4 d-none d-sm-block"
                    style={{ maxWidth: "220px" }}
                  >
                    <div
                      className="row no-gutters justify-content-end"
                      style={{
                        marginTop: "-25px",
                        transform: "translateY(25px)",
                      }}
                    >
                      <div
                        className={`text-white col-5 col-sm-4 col-md-5 p-2${
                          x.status === "pending"
                            ? " bg-primary"
                            : x.status === "reached"
                            ? " bg-success"
                            : " bg-danger"
                        }`}
                        style={{
                          borderRadius: "50%",
                        }}
                      >
                        <div className="d-flex"></div>
                        {x.status === "pending" ? (
                          <BsFillReplyFill size={"100%"}></BsFillReplyFill>
                        ) : x.status === "reached" ? (
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
                    <h4>
                      <span
                        className={`badge badge-${
                          x.status === "pending"
                            ? "primary"
                            : x.status === "reached"
                            ? "success"
                            : "danger"
                        }`}
                      >
                        Agreement is {x.status}
                      </span>
                    </h4>
                    <div className="row no-gutters border-bottom my-3">
                      <div className="mr-4 col-auto">
                        <label className="mr-2">Author</label>
                        <div className="text-primary">{x.creator.username}</div>
                      </div>
                      <div className="mr-2 col-auto">
                        <label>Date</label>
                        <div>
                          {date.format(new Date(x.date), "MMM DD, YYYY")}
                        </div>
                      </div>
                    </div>

                    <div className="row no-gutters request-title mb-2">
                      <div className="col-12">{x.title}</div>
                    </div>
                    <div className="row no-gutters">
                      {user.accountType === "client" && (
                        <React.Fragment>
                          <div
                            className="col-auto mr-2 mb-2 btn-pro"
                            onClick={() => {
                              let updates = {};
                              updates[
                                `projects/${projectId}/requests/${x.id}/status`
                              ] = "reached";
                              firebase.UpdateDatabase(updates);
                            }}
                          >
                            Accept
                          </div>
                          <div
                            className="col-auto mr-2 mb-2 btn"
                            onClick={() => {
                              let updates = {};
                              updates[
                                `projects/${projectId}/requests/${x.id}/status`
                              ] = "not reached";
                              firebase.UpdateDatabase(updates);
                            }}
                          >
                            Reject
                          </div>
                        </React.Fragment>
                      )}
                      <div
                        className="col-auto btn mb-2"
                        onClick={() =>
                          history.push(
                            `/${user.id}/projects/${projectId}/requests/${x.id}`
                          )
                        }
                      >
                        View more
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;
