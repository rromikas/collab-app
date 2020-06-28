import React from "react";
import date from "date-and-time";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const CustomToolbar = ({ toolbar, setCalendarTime }) => {
  console.log("toolbar", toolbar);
  return (
    <div
      className="d-flex user-select-none "
      style={{ position: "absolute", top: "-40px", right: "27px" }}
    >
      <div
        onClick={() => {
          let mDate = toolbar.date;
          let newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
          toolbar.onNavigate("prev", newDate);
          setCalendarTime(newDate);
        }}
      >
        <BsChevronLeft
          fontSize="20px"
          className="clickable-item"
        ></BsChevronLeft>
      </div>
      <div className="px-3">{date.format(toolbar.date, "MM-YYYY")}</div>
      <div
        onClick={() => {
          let mDate = toolbar.date;
          let newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
          toolbar.onNavigate("next", newDate);
          setCalendarTime(newDate);
        }}
      >
        <BsChevronRight
          fontSize="20px"
          className="clickable-item"
        ></BsChevronRight>
      </div>
    </div>
  );
};

export default CustomToolbar;
