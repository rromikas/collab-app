import React from "react";
import { uid } from "react-uid";
import history from "../../../history";
import {
  BsFolder,
  BsClock,
  BsReply,
  BsGrid,
  BsCalendar,
  BsChatDots,
  BsPeople,
  BsGraphUp,
  BsPencil,
} from "react-icons/bs";

const ownerItems = [
  { icon: BsFolder, link: "files" },
  { icon: BsPencil, link: "notes" },
  { icon: BsChatDots, link: "messages" },
  { icon: BsCalendar, link: "calendar" },
  { icon: BsClock, link: "time" },
  { icon: BsReply, link: "requests" },
];

const clientItems = [
  { icon: BsFolder, link: "files" },
  { icon: BsChatDots, link: "messages" },
  { icon: BsCalendar, link: "calendar" },
  { icon: BsReply, link: "requests" },
];

const generalItems = [
  { name: "Projects", icon: <BsGrid fontSize="24px"></BsGrid> },
  { name: "Calendar", icon: <BsCalendar fontSize="24px"></BsCalendar> },
  { name: "Messages", icon: <BsChatDots fontSize="24px"></BsChatDots> },
  { name: "People", icon: <BsPeople fontSize="24px"></BsPeople> },
];

const MobileNavbar = ({ projectId, section, page, userId, people }) => {
  const permissions = people[userId] ? people[userId].permissions : "client";
  return (
    <div
      className="row no-gutters border-bottom mobile-project-navbar"
      style={{ position: "fixed", bottom: 0, left: 0, zIndex: 10 }}
    >
      {projectId
        ? (permissions === "owner" ? ownerItems : clientItems).map((x) => (
            <div
              onClick={() =>
                history.push(
                  `/${userId}/projects/${projectId}/${x.link.toLowerCase()}`
                )
              }
              key={uid(x)}
              className={`col text-center project-menu-item${
                section === x.link.toLowerCase()
                  ? " project-menu-item-chosen"
                  : ""
              } px-3`}
            >
              <x.icon fontSize="20px"></x.icon>
            </div>
          ))
        : generalItems.map((x) => (
            <div
              onClick={() => history.push(`/${userId}/${x.name.toLowerCase()}`)}
              key={uid(x)}
              className={`col text-center project-menu-item${
                page === x.name.toLowerCase() ? " project-menu-item-chosen" : ""
              } px-3`}
            >
              {x.icon}
            </div>
          ))}
    </div>
  );
};

export default MobileNavbar;
