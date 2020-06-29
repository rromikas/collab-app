import React, { useEffect, useState } from "react";
import store from "../../../store/store";
import history from "../../../history";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";
import randomColor from "randomcolor";
import { BsChevronLeft } from "react-icons/bs";
import date from "date-and-time";

const NewRequest = ({ user, projectId }) => {
  const [request, setRequest] = useState({
    title: "",
    description: "",
    projectId: projectId,
    id: uniqid("request-"),
    date: new Date(Date.now()).toString(),
    creator: { username: user.username, photo: user.photo, id: user.id },
    status: "pending",
  });

  const [problem, setProblem] = useState("");

  return (
    <div className="row no-gutters">
      <div className="col-12 new-project p-4">
        <div
          className="row no-gutters align-items-center mb-3"
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
          <div className="col-auto mr-2">New</div>
        </div>
        <div className="row no-gutters border-bottom mb-4">
          <div className="col-12 col-sm-9 col-md-7">
            <div className="row no-gutter">
              <div className="col-auto mr-2">
                <label className="mr-2">Author</label>
                <div className="text-primary">{user.username}</div>
              </div>
              <div className="col-auto">
                <label className="mr-2">Date</label>
                <div>{date.format(new Date(), "MMM DD, YYYY")}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters">
          <label>Title*</label>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-12 col-sm-9 col-md-7">
            <input
              spellCheck={false}
              value={request.title}
              onChange={(e) => {
                e.persist();
                setRequest((pr) =>
                  Object.assign({}, pr, { title: e.target.value })
                );
              }}
              style={{ width: "100%" }}
              type="text"
              placeholder="Enter the title of the request"
            ></input>
          </div>
        </div>
        <div className="row no-gutters">
          <label>Description</label>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-12 col-sm-9 col-md-7">
            <textarea
              spellCheck={false}
              value={request.description}
              onChange={(e) => {
                e.persist();
                setRequest((pr) =>
                  Object.assign({}, pr, { description: e.target.value })
                );
              }}
              placeholder="Describe the request"
              style={{ width: "100%", height: "170px" }}
            ></textarea>
          </div>
        </div>

        <div className="row no-gutters" style={{ opacity: problem ? 1 : 0 }}>
          <label className="text-danger">{problem}</label>
        </div>
        <div className="row no-gutters">
          <div
            className="col-auto btn-pro mr-2"
            onClick={() => {
              if (request.title) {
                if (request.description) {
                  let updates = {};
                  updates[
                    `projects/${projectId}/requests/${request.id}`
                  ] = request;
                  firebase.UpdateDatabase(updates);
                  history.goBack();
                } else {
                  setProblem("description is required");
                }
              } else {
                setProblem("title is required");
              }
            }}
          >
            Create request
          </div>
          <div className="col-auto btn" onClick={() => history.goBack()}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
