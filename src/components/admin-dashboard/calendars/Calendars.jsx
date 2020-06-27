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

const localizer = momentLocalizer(moment); // or globalizeLocalizer

const Calendar = ({ projectId }) => {
  const [newEvent, setNewEvent] = useState({
    start: new Date(Date.now()),
    end: new Date(Date.now()),
    position: { left: 0, top: 0 },
    title: "",
    id: uniqid("event-"),
    open: false,
    purpose: "",
  });

  const [events, setEvents] = useState({});

  const container = useRef(null);
  const newEventContainer = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    firebase.on(`projects/${projectId}/events`, (data) => {
      if (data) {
        console.log("DATE ATEJO", data);
        setEvents(data);
      } else {
        setEvents({});
      }
    });
    return function cleanUp() {
      firebase.off(`projects/${projectId}/events`);
    };
  }, [projectId]);

  return (
    <div
      className="row no-gutters position-relative px-2 px-sm-3 px-md-4"
      ref={container}
    >
      <div
        className="position-absolute"
        style={{
          width: "1px",
          height: "1px",
          background: "black",
          left: `${newEvent.position.left}px`,
          top: `${newEvent.position.top}px`,
          zIndex: 5,
        }}
      >
        <Popover
          open={newEvent.open}
          content={
            <div>
              <div>{newEvent.purpose}</div>
              <div className="mb-1">
                <input
                  type="text"
                  placeholder="Event name"
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
                    <div className="btn" ref={startDateRef}>
                      Start: {newEvent.start.toDateString()}
                    </div>
                  }
                </Popover>
              </div>
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
                    <div className="btn" ref={endDateRef}>
                      End: {newEvent.end.toDateString()}
                    </div>
                  }
                </Popover>
              </div>
              <div className="popover-label text-left">Add a note...</div>
              <div>
                <textarea
                  className="note-textarea"
                  style={{ height: "70px" }}
                ></textarea>
              </div>
              <div className="d-flex">
                <div
                  className="btn-pro col-6 mr-1"
                  onClick={() => {
                    if (newEvent.title) {
                      let updates = {};
                      updates[
                        `projects/${projectId}/events/${newEvent.id}`
                      ] = newEvent;
                      firebase.UpdateDatabase(updates);
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
      <div className="col-12 d-md-none d-block">
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
      <div className="col-12 d-none d-md-block">
        <div className="p-4 row no-gutters w-100">
          <div style={{ height: "520px" }} className="col-12">
            <CustomCalendar
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
              onSelectEvent={(obj) => {
                setNewEvent((prev) => {
                  let offset = container.current.getBoundingClientRect();
                  let startDate = new Date(obj.start);
                  startDate.setHours(12, 0, 0);
                  let endDate = new Date(obj.end);
                  endDate.setHours(12, 0, 0);
                  return Object.assign({}, prev, {
                    position: {
                      left: obj?.position?.left,
                      top: obj?.position?.top,
                    },
                    start: startDate,
                    end: endDate,
                    open: true,
                    id: obj.id,
                    title: obj.title,
                    note: obj.note,
                    purpose: "Edit event",
                  });
                });
              }}
              onSelectSlot={(obj) => {
                let startDate = obj.start;
                startDate.setHours(12, 0, 0);
                let endDate = obj.end;
                endDate.setHours(12, 0, 0);
                setNewEvent((prev) => {
                  let offset = container.current.getBoundingClientRect();

                  return Object.assign({}, prev, {
                    position: {
                      left: obj?.box?.clientX - offset.left,
                      top: obj?.box?.clientY - offset.top,
                    },
                    start: startDate,
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
    </div>
  );
};

export default Calendar;
