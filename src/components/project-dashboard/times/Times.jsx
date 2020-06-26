import React, { useState, useRef } from "react";
import Popover from "../../utility/Popover";
import date from "date-and-time";
import uniqid from "uniqid";
import * as firebase from "../../../database/firebase";
import NoTimes from "../../../pictures/NoTimes";

const formatNumber = (number) => {
  var formattedNumber = ("0" + number).slice(-2);
  return formattedNumber;
};

const calculateTotalTime = (times) => {
  let minutes = 0;

  Object.values(times).forEach((x) => {
    Object.values(x).forEach((y) => {
      minutes += y.minutes;
    });
  });
  let h = Math.floor(minutes / 60);
  let m = minutes - h * 60;
  return `${formatNumber(h)}:${formatNumber(m)}`;
};

const addTimeRecord = (timeRecord, projectId, onError) => {
  let dateObj = new Date();
  let key = date.format(dateObj, "YYYY-MM-DD");
  let time = timeRecord.time;
  let a = /^([0-9]*)$/.test(time);
  let b = /[0-9]{1,}:[0-9]{1,}/.test(time);
  if (a) {
    time = parseInt(time) * 60;
  } else if (b) {
    let parts = time.split(":");
    time = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else {
    return onError("wrong format");
  }

  let updates = {};

  updates[`projects/${projectId}/times/${key}/${uniqid("time-record-")}`] = {
    minutes: time,
    ...timeRecord,
  };
  firebase.UpdateDatabase(updates);
};

const Times = ({ user, projectId, times }) => {
  times = times ? times : {};
  const addTimeButton = useRef(null);
  const [timeRecord, setTimeRecord] = useState({
    time: "",
    creator: user.username,
    task: "",
    description: "",
  });
  return (
    <div className="row no-gutters position-relative px-2 px-sm-3 px-md-4 py-3">
      <Popover
        content={
          <div className="popover-inner">
            <div>
              <label>Time</label>
              <input
                value={timeRecord.time}
                onChange={(e) => {
                  e.persist();
                  setTimeRecord((t) =>
                    Object.assign({}, t, { time: e.target.value })
                  );
                }}
                type="text"
                placeholder="00:00"
                className="d-block"
              ></input>
            </div>
            <div>
              <label>Task</label>
              <input
                value={timeRecord.task}
                onChange={(e) => {
                  e.persist();
                  setTimeRecord((t) =>
                    Object.assign({}, t, { task: e.target.value })
                  );
                }}
                type="text"
                placeholder="Enter task"
                className="d-block"
              ></input>
            </div>
            <div className="mb-2">
              <label>Description</label>
              <textarea
                value={timeRecord.description}
                onChange={(e) => {
                  e.persist();
                  setTimeRecord((t) =>
                    Object.assign({}, t, { description: e.target.value })
                  );
                }}
                style={{ height: "100px" }}
                placeholder="Write description"
                className="d-block"
              ></textarea>
            </div>
            <div className="d-flex">
              <div
                className="btn-pro col-6 mr-1"
                onClick={() => {
                  addTimeRecord(timeRecord, projectId, (error) => {});
                  addTimeButton.current.click();
                }}
              >
                Add
              </div>
              <div
                className="btn col-6"
                onClick={() => addTimeButton.current.click()}
              >
                Cancel
              </div>
            </div>
          </div>
        }
      >
        <div className="col-auto btn-pro mb-3" ref={addTimeButton}>
          Add time record
        </div>
      </Popover>
      <div className="col-12 mb-2">
        <div className="row no-gutters border-top border-bottom align-items-center py-1">
          <div className="col-auto mr-2">Total time:</div>
          <div className="col-auto">{calculateTotalTime(times)}</div>
          <div className="col">
            <div className="row no-gutters justify-content-end">
              <div className="col-auto btn">Show details</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        {Object.keys(times).length ? (
          Object.keys(times).map((x) => (
            <div className="row no-gutters mb-3">
              <div className="col-12 mb-1 time-record-date">{x}</div>
              <div className="col-12">
                {Object.values(times[x]).map((y) => (
                  <div className="row no-gutters times-table-row">
                    <div className="col-4 pr-2">{y.time}</div>
                    <div className="col-4 pr-2">{y.creator}</div>
                    <div className="col-4">{y.task}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div
            className="row no-gutters justify-content-center align-items-center"
            style={{ height: "440px" }}
          >
            <div className="col-lg-4 col-md-5 col-6">
              <NoTimes></NoTimes>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Times;
