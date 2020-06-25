import React from "react";
import { uid } from "react-uid";
import history from "../../../History";

const navItems = ["Files", "Messages", "Calendar", "Time", "Activity"];

const Navbar = ({ projectId, page, userId }) => {
  return (
    <div className="row no-gutters border-bottom">
      {navItems.map((x) => (
        <div
          onClick={() =>
            history.push(`/${userId}/projects/${projectId}/${x.toLowerCase()}`)
          }
          key={uid(x)}
          className={`col-auto project-menu-item${
            page === x.toLowerCase() ? " project-menu-item-chosen" : ""
          } px-3`}
        >
          {x}
        </div>
      ))}
    </div>
  );
};

export default Navbar;
