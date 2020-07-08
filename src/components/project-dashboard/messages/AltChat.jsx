import React, { useState, useRef, useEffect } from "react";
import date from "date-and-time";
import uniqid from "uniqid";
import * as firebase from "../../../database/firebase";
import NoMessages from "../../../pictures/NoMessages";
import { connect } from "react-redux";
import { BsPeople } from "react-icons/bs";

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

const AltChat = ({ projectId, user, size, users }) => {
  const chatHeight =
    size.width > 768
      ? size.height - 76 - 56 - 80 - 24
      : size.height - 80 - 56 - 76;
  const [chatId, setChatId] = useState(1);
  const [chatPerson, setChatPerson] = useState(0);
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
        let ppl = {};
        Object.keys(data).forEach((x) => {
          if (data[x].status !== "invited") {
            ppl[x] = data[x];
          }
        });
        setPeople(ppl);
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
      if (chatPerson > 0) {
        let newChatId =
          chatPerson < user.id
            ? `${chatPerson}${user.id}`
            : `${user.id}${chatPerson}`;
        setChatId(newChatId);
      }
    } else {
      setChatId(1);
    }
  }, [chatPerson]);

  let clients = Object.values(people).filter((x) => x.permissions === "client");
  let clientsChatId;
  if (clients.length === 2) {
    clientsChatId =
      clients[0].id < clients[1].id
        ? `${clients[0].id}${clients[1].id}`
        : `${clients[1].id}${clients[0].id}`;
  }

  return (
    <div className="row no-gutters">
      <div
        className="col-lg-4 col-auto bg-white"
        onClick={() => {
          setChatPerson(0);
        }}
      >
        {Object.values(sliceObject(people, user.id)).map((x) => {
          let actualChatId =
            user.id < x.id ? `${user.id}${x.id}` : `${x.id}${user.id}`;
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
          return (
            <div
              key={uniqid("preview-")}
              className={`row no-gutters border-bottom p-lg-3 p-2 chat-preview${
                chatId === actualChatId ? " bg-white" : " bg-light"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setChatId(actualChatId);
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
                  backgroundImage: `url(${
                    users[x.id] ? users[x.id].photo : ""
                  })`,
                }}
              ></div>
              <div className="col d-lg-block d-none">
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto alt-chat-author">
                    {users[x.id] ? users[x.id].username : ""}
                  </div>
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
        {clients.length === 2 && user.accountType === "admin" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setChatId(clientsChatId);
            }}
            className={`row no-gutters border-bottom p-lg-3 p-2 chat-preview${
              chatId === clientsChatId ? " bg-white" : " bg-light"
            }`}
          >
            <div className="col-auto position-relative p-2 d-block d-lg-none">
              <div
                className="bg-image square-30 rounded-circle"
                style={{
                  transform: "translate(10px, 5px)",
                  backgroundImage: `url(${
                    users[clients[0].id] ? users[clients[0].id].photo : ""
                  })`,
                }}
              ></div>
              <div
                className="bg-image square-30 rounded-circle position-absolute"
                style={{
                  top: "-1px",
                  left: "-2px",
                  backgroundImage: `url(${
                    users[clients[1].id] ? users[clients[1].id].photo : ""
                  })`,
                }}
              ></div>
            </div>
            <div className="col-12 d-none d-lg-block">
              <div className="row no-gutters align-items-center mb-2">
                <div
                  className="col-auto mr-2 bg-image square-40 rounded-circle"
                  style={{
                    backgroundImage: `url(${
                      users[clients[0].id] ? users[clients[0].id].photo : ""
                    })`,
                  }}
                ></div>
                <div className="col mr-3 alt-chat-author">
                  {users[clients[0].id] ? users[clients[0].id].username : ""}
                </div>
                <div className="col mr-2 alt-chat-author text-right">
                  {users[clients[1].id] ? users[clients[1].id].username : ""}
                </div>
                <div
                  className="col-auto bg-image square-40 rounded-circle"
                  style={{
                    backgroundImage: `url(${
                      users[clients[1].id] ? users[clients[1].id].photo : ""
                    })`,
                  }}
                ></div>
              </div>
              <div className="row no-gutters align-items-center justify-content-between">
                {chats[clientsChatId] && chats[clientsChatId].lastMessage ? (
                  <React.Fragment>
                    <div className="col-auto">
                      <div className="row no-gutters">
                        <div className="col-auto mr-2 alt-chat-message">
                          {chats[clientsChatId].lastMessage.userId
                            ? users[chats[clientsChatId].lastMessage.userId]
                              ? users[chats[clientsChatId].lastMessage.userId]
                                  .username + ":"
                              : ""
                            : ""}
                        </div>
                        <div className="col-auto alt-chat-message">
                          {chats[clientsChatId].lastMessage
                            ? chats[clientsChatId].lastMessage.text
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="col-auto chat-time d-lg-block d-none">
                      {chats[clientsChatId].lastMessage.date &&
                      chats[clientsChatId].lastMessage.date !== 0
                        ? isToday(chats[clientsChatId].lastMessage.date)
                          ? date.format(
                              new Date(chats[clientsChatId].lastMessage.date),
                              "hh:mm A"
                            )
                          : date.format(
                              new Date(chats[clientsChatId].lastMessage.date),
                              "hh:mm A MMM DD YYYY"
                            )
                        : ""}
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="alt-chat-message">Haven't chated yet</div>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          onClick={() => setChatId("groupchat")}
          className={`row no-gutters justify-content-lg-between justify-content-center border-bottom p-lg-3 p-2 chat-preview${
            chatId === "groupchat" ? " bg-white" : " bg-light"
          }`}
        >
          <div
            className="d-block d-lg-none col-auto"
            style={{ lineHeight: "50px" }}
          >
            <div className="row no-gutters">
              <BsPeople fontSize="24px" className="col-auto m-auto"></BsPeople>
              <div className="col-auto">{Object.keys(people).length}</div>
            </div>
          </div>

          <div className="col-auto mb-2 d-none d-lg-block">
            <div className="row no-gutters">
              {Object.values(people).map((x, i) => (
                <div
                  className="col-auto mr-2 bg-image rounded-circle"
                  key={uniqid(`gr-chat-ppl-`)}
                  style={{
                    marginLeft: i !== 0 ? "-25px" : "0px",
                    width: "40px",
                    height: "40px",
                    backgroundImage: `url(${
                      users[x.id] ? users[x.id].photo : ""
                    })`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="col-auto d-lg-block d-none">Group chat</div>
          {chats["groupchat"] && chats["groupchat"].lastMessage && (
            <div className="col-12 d-lg-block d-none">
              <div className="row no-gutters align-items-center justify-content-between">
                <React.Fragment>
                  <div className="col-auto">
                    <div className="row no-gutters">
                      <div className="col-auto mr-2 alt-chat-message">
                        {chats["groupchat"].lastMessage.userId
                          ? users[chats["groupchat"].lastMessage.userId]
                            ? users[chats["groupchat"].lastMessage.userId]
                                .username + ":"
                            : ""
                          : ""}
                      </div>
                      <div className="col-auto alt-chat-message">
                        {chats["groupchat"].lastMessage
                          ? chats["groupchat"].lastMessage.text
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-auto chat-time d-lg-block d-none">
                    {chats["groupchat"].lastMessage.date &&
                    chats["groupchat"].lastMessage.date !== 0
                      ? isToday(chats["groupchat"].lastMessage.date)
                        ? date.format(
                            new Date(chats["groupchat"].lastMessage.date),
                            "hh:mm A"
                          )
                        : date.format(
                            new Date(chats["groupchat"].lastMessage.date),
                            "hh:mm A MMM DD YYYY"
                          )
                      : ""}
                  </div>
                </React.Fragment>
              </div>
            </div>
          )}
        </div>
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
                return (
                  <div
                    key={uniqid("chat-message-")}
                    className={`row mb-2 no-gutters p-3`}
                  >
                    <div
                      className="col-auto mr-2 bg-image square-50"
                      style={{
                        backgroundImage: `url(${
                          users[x.userId] ? users[x.userId].photo : ""
                        })`,
                      }}
                    ></div>
                    <div className="col">
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto mr-2 alt-chat-author">
                          {users[x.userId] ? users[x.userId].username : ""}
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
            ) : chatId === clientsChatId && user.accountType === "admin" ? (
              ""
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

function mapp(state, ownProps) {
  return {
    users: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(AltChat);
