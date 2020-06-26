import React from "react";
import { uid } from "react-uid";
import history from "../../../history";

const ownerItems = ["Files", "Messages", "Calendar", "Time", "Activity"];
const clientItems = ["Files", "Messages", "Calendar"];
const Navbar = ({ projectId, page, userId, people }) => {
  const permissions = people[userId] ? people[userId].permissions : "client";
  return (
    <div className="row no-gutters border-bottom">
      {(permissions === "owner" ? ownerItems : clientItems).map((x) => (
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
