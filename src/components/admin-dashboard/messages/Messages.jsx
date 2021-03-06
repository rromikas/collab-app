import React, { useState, useRef, useEffect } from "react";
import date from "date-and-time";
import { uid } from "react-uid";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";
import NoMessages from "../../../pictures/NoMessages";
import ChatsPreview from "./ChatPreviews";
import { SendMessage, MarkMessageAsSeen } from "../../../database/api";
import { connect } from "react-redux";

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

const Messages = ({ user, size, chat, users }) => {
  const chatHeight =
    size.width > 768 ? size.height - 250.4 : size.height - 64 - 76 - 80 - 57;
  const messagesEnd = useRef(null);

  const [newMessage, setNewMessage] = useState({
    text: "",
    seenBy: { [user.id]: { id: user.id } },
    userId: user.id,
  });

  const [people, setPeople] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    firebase
      .GetFromDatabase(`projects/${chat.projectId}/people`)
      .then((data) => {
        if (data) {
          setPeople(data);
        }
      });
  }, [chat]);

  useEffect(() => {
    if (chat.projectId && chat.chatId) {
      firebase.on(
        `projects/${chat.projectId}/messages/${chat.chatId}`,
        (data) => {
          setMessages(data ? data : {});
        }
      );
    } else {
      setMessages({});
    }
    return function cleanUp() {
      if (chat.projectId && chat.chatId) {
        firebase.off(`projects/${chat.projectId}/messages`);
      }
    };
  }, [chat]);

  useEffect(() => {
    let lastMessage = messages.lastMessage;
    if (lastMessage) {
      MarkMessageAsSeen(chat, user);
    }
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <React.Fragment>
      <div
        className="row no-gutters"
        style={{ overflow: "auto", height: chatHeight }}
      >
        <div className="col-12">
          {Object.keys(people).length && messages.messages ? (
            Object.values(messages.messages).map((x) => {
              return (
                <div key={uid(x)} className={`col-12 mb-2 p-3`}>
                  <div className="row no-gutters">
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
                        {x.text}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="row w-100 h-100 no-gutters justify-content-center align-items-center">
              <div className="col-6 col-lg-5">
                <NoMessages></NoMessages>
              </div>
            </div>
          )}

          <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
        </div>
      </div>
      <div
        style={{ height: "80px" }}
        className="row no-gutters collab-chat-write-message-box border-top align-items-center justify-content-center px-3"
      >
        {!chat.chatId ? (
          "Select chat"
        ) : (
          <React.Fragment>
            <div
              className="col-auto bg-image mr-2 square-50"
              style={{
                backgroundImage: `url(${user.photo})`,
              }}
            ></div>
            <input
              disabled={chat.chatId === -1}
              value={newMessage.text}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  if (chat.chatId !== -1) {
                    SendMessage(newMessage, chat.projectId, chat.chatId);
                    setNewMessage((prev) =>
                      Object.assign({}, prev, { text: "" })
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
              disabled={chat.chatId === -1}
              className="btn-pro col-auto"
              onClick={() => {
                if (chat.chatId !== -1) {
                  SendMessage(newMessage, chat.projectId, chat.chatId);
                  setNewMessage((prev) =>
                    Object.assign({}, prev, { text: "" })
                  );
                }
              }}
            >
              Send
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

function mapp(state, ownProps) {
  return {
    users: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(Messages);
