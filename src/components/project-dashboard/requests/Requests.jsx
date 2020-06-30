import React, { useRef, useEffect, useState } from "react";
import history from "../../../history";
import Agreement from "../../../pictures/Agreement";
import * as firebase from "../../../database/firebase";
import date from "date-and-time";
import { BsX, BsCheck, BsReply, BsFillReplyFill } from "react-icons/bs";

const Requests = ({ projectId, user, size }) => {
  const containerMinHeight =
    size.width > 768 ? size.height - 62.4 - 24 - 56 : size.height - 56 - 56;
  const [requests, setRequests] = useState({});
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
      className="row no-gutters"
      style={{ minHeight: `${containerMinHeight}px` }}
    >
      <div className="col-12">
        <div className="row no-gutters">
          <div
            className="col-auto btn-pro m-3"
            onClick={() =>
              history.push(`/${user.id}/projects/${projectId}/requests/new`)
            }
          >
            Create request
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col-12">
            {Object.values(requests).map((x) => (
              <div className="row no-gutters mb-5 mb-md-3">
                <div className="col-xl-3 col-4 d-none d-sm-block">
                  <div
                    className="row no-gutters justify-content-end"
                    style={{
                      marginTop: "-25px",
                      transform: "translateY(25px)",
                    }}
                  >
                    <div
                      className={`text-white col-5 col-sm-4 col-md-3 p-2${
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
                      <div>{date.format(new Date(x.date), "MMM DD, YYYY")}</div>
                    </div>
                  </div>

                  <div className="row no-gutters request-title mb-2">
                    <div className="col-12">{x.title}</div>
                  </div>
                  <div className="row no-gutters">
                    <div style={{ minHeight: "200px" }} className="col-12">
                      {x.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
