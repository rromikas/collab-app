import React, { useState, useRef, useEffect } from "react";
import date from "date-and-time";
import { BsJustify } from "react-icons/bs";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import { uid } from "react-uid";

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const chats = {
  1: {
    id: 1,
    allSeen: false,
    guest: {
      name: "Kasparas",
      userId: 1,
      photo:
        "https://images.pexels.com/photos/4354418/pexels-photo-4354418.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    owner: {
      userId: 2,
      name: "Laurynas",
      photo:
        "https://images.pexels.com/photos/4312101/pexels-photo-4312101.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },

    messages: [
      {
        status: "guest",
        date: new Date(Date.now() - 4000000000),
        text: "Hello, how are you?",
        seenBy: [],
      },
      {
        status: "owner",
        date: new Date(Date.now() - 30000),
        text: "Hello, I am fine, how are you?",
        seenBy: [],
      },
      {
        status: "guest",
        date: new Date(Date.now() - 20000),
        text: "I am fine. We are going to play footbal, will you join us?",
        seenBy: [],
      },
      {
        status: "owner",
        date: new Date(Date.now() - 10000),
        text: "Hello, how are you?",
        seenBy: [],
      },
    ],
  },

  2: {
    id: 2,
    allSeen: true,
    guest: {
      userId: 3,
      name: "Kreate",
      photo:
        "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    owner: {
      userId: 4,
      name: "Sioma",
      photo:
        "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },

    messages: [
      {
        status: "guest",
        date: new Date(Date.now() - 40000),
        text: "Hello, how are you?",
        seenBy: [],
      },
      {
        status: "owner",
        date: new Date(Date.now() - 30000),
        text: "Hello, I am fine, how are you?",
        seenBy: [],
      },
      {
        status: "guest",
        date: new Date(Date.now() - 20000),
        text: "I am fine. We are going to play footbal, will you join us?",
        seenBy: [],
      },
      {
        status: "owner",
        date: new Date(Date.now() - 10000),
        text: "Of course, when?",
        seenBy: [],
      },
      {
        status: "guest",
        date: new Date(Date.now() - 5000),
        text: "At 10 am in the camp now",
        seenBy: [],
      },
      {
        status: "owner",
        date: new Date(Date.now() - 3000),
        text: "xD",
        seenBy: [],
      },
    ],
  },
};

const Messages = () => {
  const [chatId, setChatId] = useState(1);
  const chatPopover = useRef(null);
  const messagesEnd = useRef(null);

  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Messages" });
  }, []);

  useEffect(() => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [chatId]);

  return (
    <div className="row no-gutters px-2 px-sm-3 px-md-4">
      <div className="row no-gutters collab-chat">
        <div className="col-lg-4 d-lg-block d-none bg-light">
          {Object.values(chats).map((x) => (
            <div
              key={uid(x)}
              className="row no-gutters border-bottom p-3 chat-preview"
              onClick={() => setChatId(x.id)}
            >
              <div
                className="col-auto mr-2"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${x.guest.photo})`,
                }}
              ></div>
              <div className="col">
                <div className="row no-gutters">{x.guest.name}</div>
                <div
                  className={`row no-gutters chat-preview-message${
                    x.allSeen ? "" : "-unread"
                  }`}
                >
                  {x.messages[x.messages.length - 1].status === "owner"
                    ? "you: "
                    : ""}
                  {x.messages[x.messages.length - 1].text}
                </div>
              </div>
              <div className="chat-time">
                {isToday(x.messages[x.messages.length - 1].date)
                  ? date.format(
                      x.messages[x.messages.length - 1].date,
                      "hh:mm A"
                    )
                  : date.format(
                      x.messages[x.messages.length - 1].date,
                      "hh:mm A MMM DD YYYY"
                    )}
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-8 col-12 bg-white border-left">
          <div className="row no-gutters">
            <div className="col-12 border-bottom mb-2 px-4 py-3">
              <div className="row no-gutters align-items-center">
                <div className="col-auto d-block d-lg-none mr-3 hoverable-gray">
                  <Popover
                    content={
                      <div className="container p-2">
                        {Object.values(chats).map((x) => (
                          <div
                            key={uid(x)}
                            className="row no-gutters border-bottom p-3 chat-preview"
                            onClick={() => {
                              setChatId(x.id);
                              chatPopover.current.click();
                            }}
                          >
                            <div
                              className="col-auto mr-2"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundImage: `url(${x.guest.photo})`,
                              }}
                            ></div>
                            <div className="col">
                              <div className="row no-gutters">
                                {x.guest.name}
                              </div>
                              <div
                                className={`row no-gutters chat-preview-message${
                                  x.allSeen ? "" : "-unread"
                                }`}
                              >
                                {x.messages[x.messages.length - 1].status ===
                                "owner"
                                  ? "you: "
                                  : ""}
                                {x.messages[x.messages.length - 1].text}
                              </div>
                            </div>
                            <div className="chat-time">
                              {isToday(x.messages[x.messages.length - 1].date)
                                ? date.format(
                                    x.messages[x.messages.length - 1].date,
                                    "hh:mm A"
                                  )
                                : date.format(
                                    x.messages[x.messages.length - 1].date,
                                    "hh:mm A MMM DD YYYY"
                                  )}
                            </div>
                          </div>
                        ))}
                      </div>
                    }
                  >
                    <div ref={chatPopover}>
                      <BsJustify fontSize="24px"></BsJustify>
                    </div>
                  </Popover>
                </div>
                <div
                  className="col-auto mr-2"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundImage: `url(${chats[chatId].guest.photo})`,
                  }}
                ></div>
                <div className="col-auto">{chats[chatId].guest.name}</div>
              </div>
            </div>
            <div
              className="col-12 p-4"
              style={{ height: "470px", overflow: "auto" }}
            >
              {chats[chatId].messages.map((x) => {
                return (
                  <div
                    key={uid(x)}
                    className={`row mb-2 no-gutters justify-content-${
                      x.status === "guest" ? "start" : "end"
                    }`}
                  >
                    <div className="col-auto" style={{ maxWidth: "75%" }}>
                      <div
                        className={`mb-2 row no-gutters justify-content-${
                          x.status === "guest" ? "start" : "end"
                        }`}
                      >
                        <div
                          className="col-auto mr-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundImage: `url(${
                              chats[chatId][x.status].photo
                            })`,
                          }}
                        ></div>
                        <div className="col-auto">
                          <div className="row no-gutters">
                            {chats[chatId][x.status].name}
                          </div>
                          <div className="row no-gutters chat-time">
                            {isToday(x.date)
                              ? date.format(x.date, "hh:mm A")
                              : date.format(x.date, "ddd MMM DD YYYY")}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`row no-gutters justify-content-${
                          x.status === "guest" ? "start" : "end"
                        }`}
                      >
                        <div
                          className={`px-3 col-auto message${
                            x.status === "guest"
                              ? " guest-message"
                              : " own-message"
                          }`}
                        >
                          {x.text}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                style={{ float: "left", clear: "both" }}
                ref={messagesEnd}
              ></div>
            </div>
            <div className="col-12 p-4 collab-chat-write-message-box border-top">
              <div className="row no-gutters">
                <input
                  type="text"
                  className="col mr-2"
                  placeholder="write a message"
                ></input>
                <div className="btn-pro col-auto">Send</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
