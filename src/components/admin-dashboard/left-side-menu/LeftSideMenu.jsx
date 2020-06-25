import React, { useEffect } from "react";
import {
  BsGrid,
  BsCalendar,
  BsChatDots,
  BsPeople,
  BsGraphUp,
} from "react-icons/bs";
import { uid } from "react-uid";
import history from "../../../History";

const LeftSideMenu = ({ userId }) => {
  const items = [
    { name: "Projects", icon: <BsGrid fontSize="24px"></BsGrid> },
    { name: "Calendar", icon: <BsCalendar fontSize="24px"></BsCalendar> },
    { name: "Messages", icon: <BsChatDots fontSize="24px"></BsChatDots> },
    { name: "People", icon: <BsPeople fontSize="24px"></BsPeople> },
    { name: "Activity", icon: <BsGraphUp fontSize="24px"></BsGraphUp> },
  ];

  useEffect(() => {}, []);

  return (
    <div className="row no-gutters pr-2 pr-md-3 pr-lg-4">
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
