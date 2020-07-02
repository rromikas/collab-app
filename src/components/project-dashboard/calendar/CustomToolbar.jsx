import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import date from "date-and-time";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const DateBox = ({ toolbar }) => {
  return date.format(toolbar.date, "MMMM YYYY");
};

const MyToolbar = ({ toolbar, setCalendarTime }) => {
  return (
    <div className="row no-gutters">
      <div
        className="col-auto calendar-btn calendar-btn-left"
        onClick={() => {
          let mDate = toolbar.date;
          let newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
          toolbar.onNavigate("prev", newDate);
          setCalendarTime(newDate);
        }}
      >
        <BsChevronLeft fontSize="14px"></BsChevronLeft>
      </div>
      <div
        className="col-auto calendar-btn-center"
        style={{ width: "110px", textAlign: "center" }}
      >
        {date.format(toolbar.date, "MMM YYYY")}
      </div>
      <div
        className="col-auto calendar-btn calendar-btn-right"
        onClick={() => {
          let mDate = toolbar.date;
          let newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
          toolbar.onNavigate("next", newDate);
          setCalendarTime(newDate);
        }}
      >
        <BsChevronRight fontSize="14px"></BsChevronRight>
      </div>
    </div>
  );
};

const CustomToolbar = ({ toolbar, setCalendarTime }) => {
  useEffect(() => {
    ReactDOM.render(
      <MyToolbar
        toolbar={toolbar}
        setCalendarTime={setCalendarTime}
      ></MyToolbar>,
      document.getElementById("my-toolbar")
    );
    ReactDOM.render(
      <DateBox toolbar={toolbar}></DateBox>,
      document.getElementById("my-datebox")
    );
  });
  return <div></div>;
};

export default CustomToolbar;
