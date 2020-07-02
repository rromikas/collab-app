import React, { useState, useEffect, useRef } from "react";
import Messages from "./Messages";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import { BsChevronDown } from "react-icons/bs";
import { uid } from "react-uid";
import ChatPreviews from "./ChatPreviews";
import { object } from "firebase-functions/lib/providers/storage";

const MessagesParent = ({ user, size }) => {
  const [view, setView] = useState("all");

  const projectChooser = useRef(null);

  const [chat, setChat] = useState({ projectId: -1, chatId: -1 });
  const projects = user.projects ? user.projects : {};

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
                <div
                  className="popover-content-item"
                  onClick={() => {
                    setView("all");
                  }}
                >
                  All
                </div>
                {Object.values(projects)
                  .filter((x) => x.status !== "Deleted")
                  .map((x) => (
                    <div
                      key={uid(x)}
                      className="popover-content-item"
                      onClick={() => {
                        setView(x.id);
                        setChat((prev) =>
                          Object.assign({}, prev, { chatId: "" })
                        );
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
                {projects[view] ? projects[view].title : "All"}
              </div>
              <BsChevronDown fontSize="14px"></BsChevronDown>
            </div>
          </Popover>
        </div>
        <div className="row no-gutters border-top">
          <div
            className="col-lg-4 col-auto bg-white"
            onClick={() => {
              setChat((prev) =>
                Object.assign({}, prev, { projectId: "", chatId: "" })
              );
            }}
          >
            <ChatPreviews
              user={user}
              view={view}
              setChat={setChat}
              chat={chat}
            ></ChatPreviews>
          </div>
          <div className="col-lg-8 col bg-white border-left">
            <Messages chat={chat} user={user} size={size}></Messages>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesParent;
