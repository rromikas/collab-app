import React, { useState, useRef, useEffect } from "react";
import Popover from "../../utility/Popover";
import { BsChevronDown } from "react-icons/bs";
import { uid } from "react-uid";
import Calendar from "./Calendar";
import store from "../../../store/store";
import MyToolbar from "./MyToolbar";

const CalendarsParent = ({ user, projects }) => {
  const projectChooser = useRef(null);
  const [projectId, setProjectId] = useState("all");
  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Calendars" });
  }, []);
  return (
    <div className="row no-gutters px-md-3 px-lg-4 pb-md-4">
      <div className="col-12 alt-chat overflow-hidden project-card-corners">
        <div className="row no-gutters">
          <div className="col-12">
            <div className="row no-gutters justify-content-between">
              <Popover
                content={
                  <div className="popover-inner">
                    <div
                      className="popover-content-item"
                      onClick={() => {
                        setProjectId("all");
                        projectChooser.current.click();
                      }}
                    >
                      All
                    </div>
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
                  className="col-auto btn d-flex align-items-center m-3"
                  ref={projectChooser}
                >
                  <div className="mr-2">
                    {projectId === "all" ? "All" : projects[projectId].title}
                  </div>
                  <BsChevronDown fontSize="14px"></BsChevronDown>
                </div>
              </Popover>
              <div
                id="my-toolbar"
                className="col-auto calendar-toolbar m-3"
              ></div>
              <div
                id="my-datebox"
                className="col-auto m-3 d-none d-sm-block"
                style={{ width: "145px", textAlign: "right" }}
              ></div>
            </div>
          </div>
          <div className="col-12">
            <Calendar
              projectId={projectId}
              user={user}
              projects={projects}
            ></Calendar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarsParent;
