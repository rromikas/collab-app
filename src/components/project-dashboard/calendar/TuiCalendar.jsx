import React, { useEffect } from "react";
import Calendar from "tui-calendar"; /* ES6 */
import "tui-calendar/dist/tui-calendar.css";

// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";

const TuiCalendar = ({ events }) => {
  console.log(Object.values(events).map((x) => x));
  let good = Object.values(events).map((x) =>
    Object.assign({}, x, { calendarId: 1, category: "time" })
  );
  useEffect(() => {
    var calendar = new Calendar("#tui-calendar-container", {
      defaultView: "month",
      taskView: true,
      useCreationPopup: false,
      useDetailPopup: false,
      week: {
        startDayOfWeek: 1, // monday
      },
      template: {
        task: function (schedule) {
          return "#" + schedule.title;
        },
      },
    });
    calendar.createSchedules(good);
    calendar.on({
      beforeCreateSchedule: (ev) => {
        console.log("BEFORE CREATE CEHCDUE Ev", ev);
        console.log(ev.guide._getMouseIndicate());
      },
    });
  });

  return <div id="tui-calendar-container"></div>;
};

export default TuiCalendar;
