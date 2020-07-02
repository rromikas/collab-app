import React, { useState, useRef, useEffect } from "react";
import date from "date-and-time";
import { uid } from "react-uid";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";
import NoMessages from "../../../pictures/NoMessages";

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
  updates[
    `projects/${projectId}/messages/${chatId}/lastMessage`
  ] = Object.assign({}, message, { date: new Date(), id: id });
  firebase.UpdateDatabase(updates);
};

const AltChat = ({ projectId, user, size }) => {
  const chatHeight = size.width > 768 ? size.height - 222.4 : size.height - 192;
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
  }, [projectId]);

  useEffect(() => {
    firebase.on(`projects/${projectId}/messages`, (data) => {
      setChats(data ? data : {});
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    });
    return function cleanUp() {
      firebase.off(`projects/${projectId}/messages`);
    };
  }, [projectId]);

  useEffect(() => {
    messagesEnd.current.scrollIntoView();
    let lastMessage = chats[chatId] ? chats[chatId].lastMessage : "";
    if (lastMessage) {
      let updates = {};
      updates[
        `projects/${projectId}/messages/${chatId}/lastMessage/seenBy/${user.id}`
      ] = { id: user.id };
      firebase.UpdateDatabase(updates);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatPerson) {
      let newChatId =
        chatPerson < user.id
          ? `${chatPerson}${user.id}`
          : `${user.id}${chatPerson}`;
      setChatId(newChatId);
    }
  }, [chatPerson]);

  return (
    <div className="row no-gutters">
      <div
        className="col-lg-4 col-auto bg-white"
        onClick={() => {
          setChatId(1);
        }}
      >
        {Object.values(sliceObject(people, user.id)).map((x) => {
          let actualChatId =
            user.id < x.id ? `${user.id}${x.id}` : `${x.id}${user.id}`;
          console.log("ACTU ID", actualChatId);
          let lastMessage = chats[actualChatId]
            ? chats[actualChatId].lastMessage
            : null;
          if (!lastMessage) {
            lastMessage = {
              date: 0,
              text: "start a chat",
              seenBy: { [user.id]: { id: user.id } },
            };
          }
          console.log("LAST MESSAGE", lastMessage);
          return (
            <div
              key={uid(x)}
              className={`row no-gutters border-bottom p-lg-3 p-2 chat-preview${
                chatPerson === x.id ? " bg-white" : " bg-light"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setChatPerson(x.id);
              }}
            >
              <div
                className="col-auto mr-lg-2"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${x.photo})`,
                }}
              ></div>
              <div className="col d-lg-block d-none">
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto alt-chat-author">{x.username}</div>
                  <div className="col-auto chat-time d-lg-block d-none">
                    {lastMessage.date && lastMessage.date !== 0
                      ? isToday(lastMessage.date)
                        ? date.format(new Date(lastMessage.date), "hh:mm A")
                        : date.format(
                            new Date(lastMessage.date),
                            "hh:mm A MMM DD YYYY"
                          )
                      : ""}
                  </div>
                </div>
                <div
                  className={`text-truncate row no-gutters alt-chat-message${
                    user.id in lastMessage.seenBy ? "" : "-unread"
                  }`}
                >
                  {lastMessage.userId === user.id ? "you: " : ""}
                  {lastMessage.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="col-lg-8 col bg-white border-left">
        <div className="row no-gutters">
          <div
            className="col-12"
            style={{ height: `${chatHeight}px`, overflow: "auto" }}
          >
            {chats[chatId] &&
            Object.keys(people).length &&
            chats[chatId].messages ? (
              Object.values(chats[chatId].messages).map((x) => {
                console.log("TA NESAMONIGA DATA", x.date);
                return (
                  <div key={uid(x)} className={`row mb-2 no-gutters p-3`}>
                    <div
                      className="col-auto mr-2 bg-image square-50"
                      style={{
                        backgroundImage: `url(${people[x.userId].photo})`,
                      }}
                    ></div>
                    <div className="col">
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto mr-2 alt-chat-author">
                          {people[x.userId].username}
                        </div>
                        <div className="col-auto alt-chat-date">
                          {x.date
                            ? isToday(new Date(x.date))
                              ? date.format(new Date(x.date), "hh:mm A")
                              : date.format(new Date(x.date), "ddd MMM DD YYYY")
                            : ""}
                        </div>
                      </div>

                      <div className="row no-gutters alt-chat-message">
                        <div className="text-break"></div>
                        {x.text}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="row no-gutters justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <div className="col-6 col-lg-5">
                  <NoMessages></NoMessages>
                </div>
              </div>
            )}
            <div
              style={{ float: "left", clear: "both" }}
              ref={messagesEnd}
            ></div>
          </div>
          <div
            className="col-12 p-4 collab-chat-write-message-box border-top d-flex align-items-center"
            style={{ height: "80px" }}
          >
            {chatId === 1 ? (
              "Select chat"
            ) : (
              <div className="row no-gutters w-100 align-items-center">
                <div
                  className="col-auto bg-image mr-2 square-50"
                  style={{
                    backgroundImage: `url(${user.photo})`,
                  }}
                ></div>
                <input
                  disabled={chatId === 1}
                  value={newMessage.text}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      if (chatId !== 1) {
                        sendMessage(newMessage, projectId, chatId);
                        setNewMessage((m) =>
                          Object.assign({}, m, { text: "" })
                        );
                      }
                    }
                  }}
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
                  disabled={chatId === 1}
                  className="btn-pro col-auto"
                  onClick={() => {
                    if (chatId !== 1) {
                      sendMessage(newMessage, projectId, chatId);
                      setNewMessage((m) => Object.assign({}, m, { text: "" }));
                    }
                  }}
                >
                  Send
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltChat;
