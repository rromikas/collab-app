import React, { useState } from "react";
import date from "date-and-time";
import uniqid from "uniqid";
import * as firebase from "../../../database/firebase";

const addTimeRecord = (timeRecord, projectId) => {
  let dateObj = new Date();
  let key = date.format(dateObj, "YYYY-MM-DD");
  let updates = {};
  updates[
    `projects/${projectId}/times/${key}/${uniqid("time-record-")}`
  ] = timeRecord;
  firebase.UpdateDatabase(updates);
};
const NewTimeRecord = () => {
  const [timeRecord, setTimeRecord] = useState({
    time: 0,
    user_id: "",
    task: "",
  });
  return (
    <div className="row no-gutters px-2 px-md-3 px-lg-4">
      <div className="col-12 new-project p-4">
        <div className="row no-gutters">
          <label>Time</label>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-12 col-sm-9 col-md-7">
            <input
              spellCheck={false}
              value={timeRecord.time}
              onChange={(e) => {
                e.persist();
                setTimeRecord((tr) =>
                  Object.assign({}, tr, { timeRecord: e.target.value })
                );
              }}
              style={{ width: "100%" }}
              type="text"
              placeholder="00:00"
            ></input>
          </div>
        </div>
        <div className="row no-gutters">
          <label>Task</label>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-12 col-sm-9 col-md-7">
            <textarea
              spellCheck={false}
              value={project.description}
              onChange={(e) => {
                e.persist();
                setProject((pr) =>
                  Object.assign({}, pr, { description: e.target.value })
                );
              }}
              placeholder="Describe the project"
              style={{ width: "100%", height: "170px" }}
            ></textarea>
          </div>
        </div>
        <div className="row no-gutters">
          <div
            className="col-auto btn-pro mr-2"
            onClick={() => createProject(project)}
          >
            Create project
          </div>
          <div
            className="col-auto btn"
            onClick={() => history.push(`/${user.id}/projects`)}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTimeRecord;
