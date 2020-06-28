import React, { useState, useEffect, useRef } from "react";
import Messages from "./Messages";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import { BsChevronDown } from "react-icons/bs";
import { uid } from "react-uid";

const MessagesParent = ({ user, size }) => {
  const [projectId, setProjectId] = useState(
    user.projects ? Object.keys(user.projects)[0] : 1
  );

  const projectChooser = useRef(null);

  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Messages" });
  }, []);

  return (
    <div className="row no-gutters p-0 py-0 pb-md-4 px-md-4">
      <div className="col-12 alt-chat overflow-hidden project-card-corners">
        <div className="row no-gutters p-3">
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
        <Messages projectId={projectId} user={user} size={size}></Messages>
      </div>
    </div>
  );
};

export default MessagesParent;
