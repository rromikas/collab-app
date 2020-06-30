import React from "react";
import { useEffect, useState } from "react";
import * as firebase from "../../../database/firebase";
import { uid } from "react-uid";
import date from "date-and-time";

const isToday = (someDate) => {
  const today = new Date();
  someDate = new Date(someDate);
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const ChatPreviews = ({ view, user, setChat, chat }) => {
  const [chats, setChats] = useState({});
  const [people, setPeople] = useState({});
  const [tick, setTick] = useState(false);
  useEffect(() => {
    async function fetchMyAPI() {
      let allChats = {};
      let allPeople = {};
      let projects = view === "all" ? user.projects : { [view]: { id: view } };
      await Promise.all(
        Object.values(projects).map(async (x) => {
          let data = await firebase.GetFromDatabase(`projects/${x.id}/people`);
          delete data[user.id];
          allChats[x.id] = {};
          allPeople[x.id] = data ? data : {};
          if (data) {
            await Promise.all(
              Object.values(data).map(async (y) => {
                let chatId =
                  user.id > y.id ? `${y.id}${user.id}` : `${user.id}${y.id}`;
                let lastMessage = await firebase.GetFromDatabase(
                  `projects/${x.id}/messages/${chatId}/lastMessage`
                );

                allChats[x.id][chatId] = lastMessage
                  ? lastMessage
                  : {
                      text: "start a chat",
                      date: 0,
                      seenBy: { [user.id]: { id: user.id } },
                    };
              })
            );
          }
        })
      );
      setPeople(allPeople);
      setChats(allChats);
    }
    fetchMyAPI();
  }, [view, tick]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setTick(!tick);
    }, 5000);
    return function cleanup() {
      clearTimeout(timeout);
    };
  }, [tick]);
  return (
    <React.Fragment>
      {Object.keys(chats).map((x) => {
        return Object.keys(chats[x]).map((y) => {
          return (
            <div
              key={uid(y)}
              className={`row no-gutters border-bottom p-lg-3 p-2 chat-preview${
                chat.projectId === x && chat.chatId === y
                  ? " bg-white"
                  : " bg-light"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setChat((prev) =>
                  Object.assign({}, prev, { projectId: x, chatId: y })
                );
              }}
            >
              <div
                className="col-auto mr-lg-2"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundImage: `url(${
                    people[x] ? people[x][y.replace(user.id, "")].photo : ""
                  })`,
                }}
              ></div>
              <div className="col d-lg-block d-none">
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto alt-chat-author">
                    {people[x]
                      ? people[x][y.replace(user.id, "")].username +
                        " / " +
                        user.projects[x].title
                      : ""}
                  </div>
                  <div className="col-auto chat-time d-lg-block d-none">
                    {chats[x][y].date && chats[x][y].date !== 0
                      ? isToday(chats[x][y].date)
                        ? date.format(new Date(chats[x][y].date), "hh:mm A")
                        : date.format(
                            new Date(chats[x][y].date),
                            "hh:mm A MMM DD YYYY"
                          )
                      : ""}
                  </div>
                </div>
                <div
                  className={`text-truncate row no-gutters alt-chat-message${
                    user.id in chats[x][y].seenBy ? "" : "-unread"
                  }`}
                >
                  {chats[x][y].userId === user.id ? "you: " : ""}
                  {chats[x][y].text}
                </div>
              </div>
            </div>
          );
        });
      })}
    </React.Fragment>
  );
};

export default ChatPreviews;
