import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MyToolbar from "./MyToolbar";
import date from "date-and-time";

const DateBox = ({ toolbar }) => {
  return date.format(toolbar.date, "MMMM YYYY");
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
  }, []);
  return <div></div>;
};

export default CustomToolbar;
