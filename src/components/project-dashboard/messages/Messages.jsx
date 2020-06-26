import React, { useState, useRef, useEffect } from "react";
import date from "date-and-time";
import { BsJustify } from "react-icons/bs";
import Popover from "../../utility/Popover";
import { uid } from "react-uid";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";

const sliceObject = (obj, property) => {
  let newObj = { ...obj };
  delete newObj[property];
  return newObj;
};

const isToday = (someDate) => {
  const today = new Date();
  someDate = new Date(someDate);
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const sendMessage = (message, projectId, chatId) => {
  let updates = {};
  let id = uniqid("message-");
  updates[
    `projects/${projectId}/messages/${chatId}/messages/${id}`
  ] = Object.assign({}, message, { date: new Date(), id: id });
  firebase.UpdateDatabase(updates);
};

const Messages = ({ projectId, user }) => {
  const [chatId, setChatId] = useState(1);
  const [chatPerson, setChatPerson] = useState(0);
  const chatPopover = useRef(null);
  const messagesEnd = useRef(null);

  const [people, setPeople] = useState({});
  const [chats, setChats] = useState({});
  const [newMessage, setNewMessage] = useState({
    text: "",
    seenBy: { [user.id]: { id: user.id } },
    userId: user.id,
  });
  useEffect(() => {
    firebase.GetFromDatabase(`projects/${projectId}/people`).then((data) => {
      if (data) {
        setPeople(data);
      }
    });
  }, []);

  useEffect(() => {
    firebase.on(`projects/${projectId}/messages`, (data) => {
      if (data) {
        setChats(data);
      }
    });
    return function cleanUp() {
      firebase.off(`projects/${projectId}/messages`);
    };
  }, []);

  useEffect(() => {
    let arr = Object.keys(sliceObject(chats, "AAAPlaceholder")).filter(
      (c) => chatPerson in chats[c].persons && user.id in chats[c].persons
    );
    if (chatPerson) {
      if (!arr.length) {
        let newChatId = uniqid("chat-");
        let updates = {};
        updates[`projects/${projectId}/messages/${newChatId}`] = {
          persons: {
            [user.id]: {
              id: user.id,
              photo: user.photo,
              username: user.username,
            },
            [chatPerson]: {
              id: chatPerson,
              photo: people[chatPerson].photo,
              username: people[chatPerson].username,
            },
          },
          messages: { AAAPlaceholder: { id: "AAAPlaceholder" } },
        };
        firebase.UpdateDatabase(updates);
        setChatId(newChatId);
      } else {
        setChatId(arr[0]);
      }
    }

    messagesEnd.current.scrollIntoView();
  }, [chatPerson]);

  return (
    <div className="row no-gutters">
      <div className="col-lg-4 d-lg-block d-none bg-light">
        {Object.values(sliceObject(people, user.id)).map((x) => {
          let chat = Object.values(sliceObject(chats, "AAAPlaceholder")).filter(
            (y) => user.id in y.persons && x.id in y.persons
          );
          let lastMessage =
            chat.length && Object.keys(chat[0].messages).length > 0
              ? chat[0].messages[
                  Object.keys(chat[0].messages)[
                    Object.keys(chat[0].messages).length - 1
                  ]
                ]
              : {
                  date: 0,
                  text: "start a chat",
                  userId: x.id,
                  seenBy: {
                    [user.id]: {
                      id: user.id,
                    },
                  },
                };

          lastMessage.date = new Date(lastMessage.date);
          return (
            <div
              key={uid(x)}
              className="row no-gutters border-bottom p-3 chat-preview"
              onClick={() => setChatPerson(x.id)}
            >
              <div
                className="col-auto mr-2"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${x.photo})`,
                }}
              ></div>
              <div className="col">
                <div className="row no-gutters">{x.username}</div>
                <div
                  className={`row no-gutters chat-preview-message${
                    user.id in lastMessage.seenBy ? "" : "-unread"
                  }`}
                >
                  {lastMessage.userId === user.id ? "you: " : ""}
                  {lastMessage.text}
                </div>
              </div>
              <div className="chat-time">
                {lastMessage.date !== 0
                  ? isToday(lastMessage.date)
                    ? date.format(lastMessage.date, "hh:mm A")
                    : date.format(lastMessage.date, "hh:mm A MMM DD YYYY")
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div className="col-lg-8 col-12 bg-white border-left">
        <div className="row no-gutters">
          <div className="col-12 border-bottom mb-2 px-4 py-3">
            <div className="row no-gutters align-items-center">
              <div className="col-auto d-block d-lg-none mr-3 hoverable-gray">
                <Popover
                  content={
                    <div className="container p-2">
                      {Object.values(people).map((x) => {
                        let chat = Object.values(
                          sliceObject(chats, "AAAPlaceholder")
                        ).filter(
                          (y) => user.id in y.persons && x.id in y.persons
                        );
                        let lastMessage =
                          chat.length &&
                          Object.keys(chat[0].messages).length > 0
                            ? chat[0].messages[
                                Object.keys(chat[0].messages)[
                                  Object.keys(chat[0].messages).length - 1
                                ]
                              ]
                            : {
                                date: 0,
                                text: "start a chat",
                                userId: x.id,
                                seenBy: {
                                  [user.id]: {
                                    id: user.id,
                                  },
                                },
                              };
                        return (
                          <div
                            key={uid(x)}
                            className="row no-gutters border-bottom p-3 chat-preview"
                            onClick={() => {
                              setChatPerson(x.id);
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
                                backgroundImage: `url(${x.photo})`,
                              }}
                            ></div>
                            <div className="col">
                              <div className="row no-gutters">{x.username}</div>
                              <div
                                className={`row no-gutters chat-preview-message${
                                  user.id in lastMessage.seenBy ? "" : "-unread"
                                }`}
                              >
                                {lastMessage.userId === user.id ? "you: " : ""}
                                {lastMessage.text}
                              </div>
                            </div>
                            <div className="chat-time">
                              {lastMessage.date !== 0
                                ? isToday(lastMessage.date)
                                  ? date.format(lastMessage.date, "hh:mm A")
                                  : date.format(
                                      lastMessage.date,
                                      "hh:mm A MMM DD YYYY"
                                    )
                                : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  }
                >
                  <div ref={chatPopover}>
                    <BsJustify fontSize="24px"></BsJustify>
                  </div>
                </Popover>
              </div>
              {people[chatPerson] && (
                <React.Fragment>
                  <div
                    className="col-auto mr-2"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundImage: `url(${people[chatPerson].photo})`,
                    }}
                  ></div>
                  <div className="col-auto">{people[chatPerson].username}</div>
                </React.Fragment>
              )}
            </div>
          </div>
          <div
            className="col-12 p-4"
            style={{ height: "430px", overflow: "auto" }}
          >
            {chats[chatId] &&
              Object.values(
                sliceObject(chats[chatId].messages, "AAAPlaceholder")
              ).map((x) => {
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
                          x.userId === chatPerson ? "start" : "end"
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
                            backgroundImage: `url(${people[x.userId].photo})`,
                          }}
                        ></div>
                        <div className="col-auto">
                          <div className="row no-gutters">
                            {people[x.userId].username}
                          </div>
                          <div className="row no-gutters chat-time">
                            {isToday(new Date(x.date))
                              ? date.format(new Date(x.date), "hh:mm A")
                              : date.format(
                                  new Date(x.date),
                                  "ddd MMM DD YYYY"
                                )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`row no-gutters justify-content-${
                          x.userId === chatPerson ? "start" : "end"
                        }`}
                      >
                        <div
                          className={`px-3 col-auto message${
                            x.userId === chatPerson
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
              <div
                className="col-auto photo-circle-sm mr-2"
                style={{ backgroundImage: `url(${user.photo})` }}
              ></div>
              <input
                value={newMessage.text}
                onChange={(e) => {
                  e.persist();
                  setNewMessage((m) =>
                    Object.assign({}, m, { text: e.target.value })
                  );
                }}
                type="text"
                className="col mr-2"
                placeholder="write a message"
              ></input>
              <div
                className="btn-pro col-auto"
                onClick={() => sendMessage(newMessage, projectId, chatId)}
              >
                Send
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
