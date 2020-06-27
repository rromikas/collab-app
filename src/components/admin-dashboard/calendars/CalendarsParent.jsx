import React, { useState, useRef, useEffect } from "react";
import Popover from "../../utility/Popover";
import { BsChevronDown } from "react-icons/bs";
import { uid } from "react-uid";
import Calendars from "./Calendars";
import store from "../../../store/store";

const CalendarsParent = ({ user }) => {
  const projectChooser = useRef(null);
  const [projectId, setProjectId] = useState(
    user.projects ? Object.keys(user.projects)[0] : 1
  );
  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Calendars" });
  }, []);
  return (
    <div className="row no-gutters px-2 px-md-3 px-lg-4">
      <div className="col-12 alt-chat overflow-hidden">
        <div className="row no-gutters">
          <div className="col-12 p-3">
            <div className="row no-gutters">
              <Popover
                content={
                  <div className="popover-inner">
                    {Object.values(user.projects)
                      .filter((x) => x.status !== "Deleted")
                      .map((x) => (
                        <div
                          key={uid(x)}
                          className="popover-content-item"
                          onClick={() => {
                            setProjectId(x.id);
                            projectChooser.current.click();
                          }}
                        >
                          {x.title}
                        </div>
                      ))}
                  </div>
                }
              >
                <div
                  className="col-auto btn d-flex align-items-center"
                  ref={projectChooser}
                >
                  <div className="mr-2">
                    {user.projects[projectId]
                      ? user.projects[projectId].title
                      : "Select project"}
                  </div>
                  <BsChevronDown fontSize="14px"></BsChevronDown>
                </div>
              </Popover>
            </div>
          </div>
          <div className="col-12">
            <Calendars projectId={projectId} user={user}></Calendars>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarsParent;
