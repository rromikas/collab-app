import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CustomCalendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Popover from "../../utility/Popover";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { uid } from "react-uid";
import uniqid from "uniqid";
import * as firebase from "../../../database/firebase";
import Checkbox from "../../utility/Checkbox";
import date from "date-and-time";
import TimePicker from "react-time-picker";
import { BsTrash } from "react-icons/bs";
import CustomToolbar from "./CustomToolbar";
import randomColor from "randomcolor";
import { AddOrEditCalendarEvent } from "../../../database/api";
import { connect } from "react-redux";
const localizer = momentLocalizer(moment); // or globalizeLocalizer

const deleteEvent = (projectId, event) => {
  let updates = {};
  updates[
    `projects/${projectId}/events/${date.format(event.start, "MM-YYYY")}${
      event.id
    }`
  ] = [];
  firebase.UpdateDatabase(updates);
};

const Calendar = ({ projectId, people, users }) => {
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({
    start: new Date(Date.now()),
    end: new Date(Date.now()),
    position: { left: 0, top: 0 },
    title: "",
    associatedWith: "",
    id: uniqid("event-"),
    open: false,
    purpose: "",
    note: "",
    projectId: projectId,
  });

  const container = useRef(null);
  const newEventContainer = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const [calendarTime, setCalendarTime] = useState(new Date());
  useEffect(() => {
    firebase.on(
      `projects/${projectId}/events/${date.format(calendarTime, "MM-YYYY")}`,
      (data) => {
        if (data) {
          setEvents((prev) => Object.assign({}, prev, data));
        }
      }
    );
    return function cleanUp() {
      firebase.off(`projects/${projectId}/events/${calendarTime}`);
    };
  }, [calendarTime]);
  return (
    <div
      className="row no-gutters position-relative pb-4"
      style={{ overflowY: "auto" }}
      ref={container}
    >
      <div
        className="position-absolute"
        style={{
          width: "1px",
          height: "1px",
          opacity: 0,
          background: "black",
          left: `${newEvent.position.left}px`,
          top: `${newEvent.position.top}px`,
          zIndex: 5,
        }}
      >
        <Popover
          position={"right"}
          open={newEvent.open}
          content={
            <div className="popover-inner position-relative">
              {newEvent.purpose === "Edit event" && (
                <div
                  className="position-absolute"
                  style={{ top: "4px", right: "4px" }}
                >
                  <BsTrash
                    fontSize="18px"
                    className="clickable-item"
                    onClick={() => {
                      deleteEvent(projectId, newEvent);
                      setNewEvent((prev) =>
                        Object.assign({}, prev, {
                          id: uniqid("event-"),
                          title: "",
                          open: false,
                        })
                      );
                    }}
                  ></BsTrash>
                </div>
              )}

              <div>{newEvent.purpose}</div>
              <div className="popover-label text-left">Title</div>
              <div className="mb-1 text-left">
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => {
                    e.persist();
                    setNewEvent((prev) =>
                      Object.assign({}, prev, { title: e.target.value })
                    );
                  }}
                ></input>
                <div className="text-left popover-label">required</div>
              </div>
              <div className="popover-label text-left">Start</div>
              <div className="mb-1">
                <Popover
                  content={
                    <DayPicker
                      selectedDays={newEvent.start}
                      onDayClick={(day) => {
                        setNewEvent((prev) =>
                          Object.assign({}, prev, {
                            start: day,
                          })
                        );
                        startDateRef.current.click();
                      }}
                    ></DayPicker>
                  }
                >
                  {
                    <div className="btn mr-1" ref={startDateRef}>
                      Date: {newEvent.start.toDateString()}
                    </div>
                  }
                </Popover>
                <Popover
                  content={
                    <TimePicker
                      onChange={(a) => {
                        if (a) {
                          let [h, m] = a.split(":");
                          let newTime = new Date(newEvent.start.getTime());
                          newTime.setHours(h);
                          newTime.setMinutes(m);
                          setNewEvent((ev) =>
                            Object.assign({}, ev, { start: newTime })
                          );
                        }
                      }}
                      value={date.format(newEvent.start, "hh:mm")}
                    ></TimePicker>
                  }
                >
                  {
                    <div className="btn" ref={startTimeRef}>
                      Time: {date.format(newEvent.start, "hh:mm A")}
                    </div>
                  }
                </Popover>
              </div>
              <div className="popover-label text-left">End</div>
              <div className="mb-1">
                <Popover
                  content={
                    <DayPicker
                      selectedDays={newEvent.end}
                      onDayClick={(day) => {
                        setNewEvent((prev) =>
                          Object.assign({}, prev, {
                            end: day,
                          })
                        );
                        endDateRef.current.click();
                      }}
                    ></DayPicker>
                  }
                >
                  {
                    <div className="btn mr-1" ref={endDateRef}>
                      Date: {newEvent.end.toDateString()}
                    </div>
                  }
                </Popover>
                <Popover
                  content={
                    <TimePicker
                      onChange={(a) => {
                        if (a) {
                          let [h, m] = a.split(":");
                          let newTime = new Date(newEvent.end.getTime());
                          newTime.setHours(h);
                          newTime.setMinutes(m);
                          setNewEvent((ev) =>
                            Object.assign({}, ev, { end: newTime })
                          );
                        }
                      }}
                      value={date.format(newEvent.end, "hh:mm")}
                    ></TimePicker>
                  }
                >
                  {
                    <div className="btn" ref={endTimeRef}>
                      Time: {date.format(newEvent.end, "hh:mm A")}
                    </div>
                  }
                </Popover>
              </div>
              <div className="popover-label text-left">Associate with...</div>
              <div>
                {Object.values(people).map((x) => (
                  <div className="d-flex mb-1" key={uid(x)}>
                    <Checkbox
                      size={25}
                      setChecked={(checked) => {
                        setNewEvent((ev) =>
                          Object.assign({}, ev, {
                            associatedWith: checked ? x.id : "",
                          })
                        );
                      }}
                      checked={newEvent.associatedWith === x.id}
                    ></Checkbox>
                    <div className="ml-2">
                      {users[x.id] ? users[x.id].username : ""}
                    </div>
                  </div>
                ))}
              </div>
              <div className="popover-label text-left">Add a note...</div>
              <div>
                <textarea
                  value={newEvent.note}
                  onChange={(e) => {
                    e.persist();
                    setNewEvent((ev) =>
                      Object.assign({}, ev, { note: e.target.value })
                    );
                  }}
                  className="note-textarea"
                  style={{ height: "70px" }}
                ></textarea>
              </div>

              <div className="d-flex mx-auto" style={{ maxWidth: "210px" }}>
                <div
                  className="btn-pro col-6 mr-1"
                  onClick={() => {
                    if (newEvent.title) {
                      AddOrEditCalendarEvent(projectId, newEvent);
                      setNewEvent((prev) =>
                        Object.assign({}, prev, {
                          id: uniqid("event-"),
                          title: "",
                          open: false,
                        })
                      );
                    }
                  }}
                >
                  Save
                </div>
                <div
                  className="btn col-6"
                  onClick={() =>
                    setNewEvent((prev) =>
                      Object.assign({}, prev, { open: false })
                    )
                  }
                >
                  Cancel
                </div>
              </div>
            </div>
          }
        >
          <div
            ref={newEventContainer}
            style={{
              width: "1px",
              height: "1px",
            }}
          ></div>
        </Popover>
      </div>
      <div className="col-12 d-none">
        <div className="row no-gutters">
          <div className="col-12 text-center">
            <DayPicker
              selectedDays={Object.values(events).map((x) => {
                let after = new Date(new Date(x.start).getTime());
                after.setDate(after.getDate() - 1);
                let before = new Date(new Date(x.end).getTime());
                before.setDate(before.getDate() + 1);
                return { after: after, before: before };
              })}
              onDayClick={(day) => {
                setNewEvent((prev) =>
                  Object.assign({}, prev, {
                    start: day,
                  })
                );
                startDateRef.current.click();
              }}
            ></DayPicker>
          </div>
          <div className="col-12">
            {Object.values(events).map((x) => (
              <div
                key={uid(x)}
                className="row no-gutters calendar-event-card p-3 mb-2"
              >
                <div className="col-12">{x.title}</div>
                <div className="col-12">
                  {new Date(x.start).toDateString()}-
                  {new Date(x.end).toDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="row no-gutters justify-content-between">
          <div id="my-toolbar" className="col-auto calendar-toolbar m-3"></div>
          <div
            id="my-datebox"
            className="col-auto m-3 d-none d-sm-block"
            style={{ width: "145px", textAlign: "right" }}
          ></div>
        </div>
        <div className="row no-gutters">
          {Object.values(people).map((x) => (
            <div className="col-auto px-3 py-2" key={uid(x)}>
              <div className="row no-gutters align-items-center">
                <div className="col-auto mr-2">
                  {users[x.id] ? users[x.id].username : ""}
                </div>
                <div
                  className="col-auto"
                  style={{
                    height: "10px",
                    width: "20px",
                    background: x.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-12">
        <div className="p-0 row no-gutters w-100">
          <div style={{ height: "520px" }} className="col-12">
            <CustomCalendar
              components={{
                toolbar: (toolbar) => (
                  <CustomToolbar
                    toolbar={toolbar}
                    setCalendarTime={(x) => setCalendarTime(x)}
                  ></CustomToolbar>
                ),
              }}
              views={["month"]}
              localizer={localizer}
              events={
                newEvent.open && newEvent.purpose === "Add new event"
                  ? Object.values(events).concat(newEvent)
                  : Object.values(events)
              }
              startAccessor="start"
              endAccessor="end"
              selectable={true}
              eventPropGetter={(event, start, end, isSelected) => {
                var style = {
                  backgroundColor: people[event.associatedWith]
                    ? people[event.associatedWith].color
                    : event.color,
                  borderRadius: "0px",
                  opacity: 0.8,
                  color: "white",
                  border: "0px",
                  display: "block",
                };
                return {
                  style: style,
                };
              }}
              onSelectEvent={(obj) => {
                console.log("lkpg", obj);
                setNewEvent((prev) => {
                  console.log("previous AA", prev);
                  return Object.assign({}, prev, {
                    position: {
                      left: obj?.position?.left,
                      top: obj?.position?.top,
                    },
                    start: new Date(obj.start),
                    end: new Date(obj.end),
                    open: true,
                    id: obj.id,
                    title: obj.title,
                    note: obj.note ? obj.note : "",
                    purpose: "Edit event",
                    color: obj.color,
                    associatedWith: obj.associatedWith,
                  });
                });
              }}
              onSelectSlot={(obj) => {
                console.log("slot seelected", obj);
                let startDate = obj.start;
                startDate.setHours(12, 0, 0);
                let endDate = obj.end;
                endDate.setHours(12, 0, 0);
                setNewEvent((prev) => {
                  let offset = container.current.getBoundingClientRect();

                  return Object.assign({}, prev, {
                    position: {
                      left:
                        (obj.bounds ? obj.bounds.left : obj?.box?.clientX) -
                        offset.left,
                      top:
                        (obj.bounds ? obj.bounds.top : obj?.box?.clientY) -
                        offset.top,
                    },
                    start: startDate,
                    color: randomColor(),
                    end: endDate,
                    title: "",
                    note: "",
                    id: uniqid("event-"),
                    open: true,
                    purpose: "Add new event",
                  });
                });
                let date = obj.start.toTimeString();
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="row no-gutters pt-3 px-3" style={{ fontWeight: "600" }}>
          Upcoming events in {date.format(calendarTime, "MMMM")}
        </div>
        <div className="row no-gutters px-2 py-2">
          {Object.values(events).filter(
            (x) => new Date(x.start).getTime() >= new Date().getTime()
          ).length ? (
            Object.values(events)
              .filter(
                (x) => new Date(x.start).getTime() >= new Date().getTime()
              )
              .map((x) => (
                <div
                  className="col-sm-12 col-md-6 col-lg-4 col-xlg-3"
                  key={uid(x)}
                >
                  <div
                    className="row no-gutters p-3 m-2 basic-card"
                    style={{
                      borderLeft: `10px solid ${
                        people[x.associatedWith]
                          ? people[x.associatedWith].color
                          : x.color
                      }`,
                    }}
                  >
                    <div className="col-12 mb-2" style={{ fontWeight: "600" }}>
                      {x.title}
                    </div>
                    <div className="col-12 calendar-event-date">
                      starts:{" "}
                      {date.format(new Date(x.start), "hh:mm MMM DD, YYYY")}
                    </div>
                    <div className="col-12 calendar-event-date mb-2">
                      ends: {date.format(new Date(x.end), "hh:mm MMM DD, YYYY")}
                    </div>
                    <Popover
                      content={
                        <div className="popover-inner">
                          {x.note ? x.note : "No note"}
                        </div>
                      }
                    >
                      <div
                        className="col-12 text-left px-0"
                        style={{ fontSize: "12px" }}
                      >
                        view note
                      </div>
                    </Popover>
                  </div>
                </div>
              ))
          ) : (
            <div className="row no-gutters p-3 m-2 basic-card justify-content-center align-items-center">
              No upcoming events this month
            </div>
          )}
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

export default connect(mapp)(Calendar);
