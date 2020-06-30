import React, { useState, useRef, useEffect } from "react";
import date from "date-and-time";
import { uid } from "react-uid";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";
import NoMessages from "../../../pictures/NoMessages";
import ChatsPreview from "./ChatPreviews";

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

const Messages = ({ user, size, chat }) => {
  const chatHeight = size.width > 768 ? size.height - 230.4 : size.height - 256;
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
      return function cleanUp() {
        firebase.off(`projects/${chat.projectId}/messages`);
      };
    }
  }, [chat]);

  useEffect(() => {
    let lastMessage = messages.lastMessage;
    if (lastMessage) {
      let updates = {};
      updates[
        `projects/${chat.projectId}/messages/${chat.chatId}/lastMessage/seenBy/${user.id}`
      ] = { id: user.id };
      firebase.UpdateDatabase(updates);
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
                          people[x.userId] ? people[x.userId].photo : ""
                        })`,
                      }}
                    ></div>
                    <div className="col">
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto mr-2 alt-chat-author">
                          {people[x.userId] ? people[x.userId].username : ""}
                        </div>
                        <div className="col-auto alt-chat-date">
                          {x.date && isToday(new Date(x.date))
                            ? date.format(new Date(x.date), "hh:mm A")
                            : date.format(new Date(x.date), "ddd MMM DD YYYY")}
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
        {chat.chatId === -1 ? (
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
                  sendMessage(newMessage, chat.projectId, chat.chatId);
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

export default Messages;
