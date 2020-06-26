import React, { useState, useEffect, useRef } from "react";
import Messages from "./Messages";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import { BsChevronDown } from "react-icons/bs";
import { uid } from "react-uid";

const MessagesParent = ({ user }) => {
  const [projectId, setProjectId] = useState(
    user.projects ? Object.keys(user.projects)[0] : 1
  );

  const projectChooser = useRef(null);

  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Messages" });
  }, []);

  return (
    <div className="row no-gutters px-2 px-md-3 px-lg-4 ">
      <div className="col-12 alt-chat overflow-hidden">
        <div className="row no-gutters">
          <div className="col-12">
            <div className="row no-gutters p-3">
              <Popover
                content={
                  <div className="popover-inner" style={{ maxWidth: "100px" }}>
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
            <Messages projectId={projectId} user={user}></Messages>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesParent;
