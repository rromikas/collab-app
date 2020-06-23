import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { BsChevronDown } from "react-icons/bs";
import Popover from "../../utility/Popover";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { uid } from "react-uid";

const localizer = momentLocalizer(moment); // or globalizeLocalizer

const calendarsList = ["Calendar 1", "Calendar 2", "Calendar 3"];

const Calendars = () => {
  const [newEvent, setNewEvent] = useState({
    start: new Date(Date.now()),
    end: new Date(Date.now()),
    position: { left: 0, top: 0 },
    title: "",
    id: uid(Date.now()),
    open: false,
  });
  const container = useRef(null);
  const newEventContainer = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [myEventsList, setMyEventsList] = useState([
    {
      id: 1,
      title: "Meeting",
      start: "Thu Jun 11 2020",
      end: "Thu Jun 11 2020",
    },
    {
      id: 2,
      title: "Football game",
      start: "Thu Jun 3 2020",
      end: "Thu Jun 3 2020",
    },
    {
      id: 3,
      title: "Football game",
      start: "Thu Jun 15 2020",
      end: "Thu Jun 15 2020",
    },
  ]);
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
              <div className="mb-1">
                <input
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
                <textarea className="note-textarea"></textarea>
              </div>
              <div className="d-flex">
                <div
                  className="btn-pro col-6 mr-1"
                  onClick={() => {
                    if (newEvent.title) {
                      let ev = { ...newEvent };
                      setMyEventsList((prev) => prev.concat(ev));
                      setNewEvent((prev) =>
                        Object.assign({}, prev, {
                          id: uid(Date.now()),
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

      <div className="col-12 h2">Calendar</div>
      <div className="col-12">
        <div className="p-4 row no-gutters w-100 bg-white calendar-container collab-calendar">
          <Popover
            content={
              <div className="popover-inner">
                {calendarsList.map((x) => (
                  <div className="popover-content-item">{x}</div>
                ))}
              </div>
            }
          >
            <div className="col-auto btn d-flex align-items-center mb-2">
              <div>Calendars</div>
              <BsChevronDown fontSize="14px" className="ml-2"></BsChevronDown>
            </div>
          </Popover>

          <div style={{ height: "570px" }} className="col-12">
            <Calendar
              views={["month", "day"]}
              localizer={localizer}
              events={
                newEvent.open ? myEventsList.concat(newEvent) : myEventsList
              }
              startAccessor="start"
              endAccessor="end"
              selectable={true}
              onSelectEvent={(ev) => {
                console.log("event selected", ev);
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
                    open: true,
                  });
                });
                newEventContainer.current.click();
                console.log("slot selected", obj);
                let date = obj.start.toTimeString();
                console.log("DATA: ", date);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendars;
