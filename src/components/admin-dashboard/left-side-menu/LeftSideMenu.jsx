import React, { useEffect } from "react";
import {
  BsGrid,
  BsCalendar,
  BsChatDots,
  BsPeople,
  BsGraphUp,
  BsReply,
} from "react-icons/bs";
import { uid } from "react-uid";
import history from "../../../history";

const LeftSideMenu = ({ userId }) => {
  const items = [
    { name: "Projects", icon: <BsGrid fontSize="24px"></BsGrid> },
    { name: "Calendar", icon: <BsCalendar fontSize="24px"></BsCalendar> },
    { name: "Messages", icon: <BsChatDots fontSize="24px"></BsChatDots> },
    { name: "People", icon: <BsPeople fontSize="24px"></BsPeople> },
    { name: "Requests", icon: <BsReply fontSize="24px"></BsReply> },
  ];

  useEffect(() => {}, []);

  return (
    <div className="row no-gutters px-2 px-md-3 px-lg-4 d-none d-md-flex">
      <div className="col-12">
        {items.map((x) => (
          <div className="row no-gutters w-100" key={uid(x)}>
            <div
              className="d-flex menu-item"
              onClick={() => {
                if (userId) {
                  history.push(`/${userId}/${x.name.toLowerCase()}`);
                }
              }}
            >
              <div
                className="text-center mr-0 mr-md-3"
                style={{ width: "40px" }}
              >
                {x.icon}
              </div>
              <div className="pr-4 d-none d-md-block">{x.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSideMenu;
