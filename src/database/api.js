import * as firebase from "./firebase";
import randomColor from "randomcolor";
import uniqid from "uniqid";
import date from "date-and-time";

export const MarkNotificationsAsChecked = (user) => {
  let updates = {};
  let notifications = user.notifications ? user.notifications : {};
  Object.values(notifications)
    .filter((x) => !x.seen)
    .forEach((x) => {
      updates[`users/${user.id}/notifications/${x.id}/seen`] = true;
    });
  firebase.UpdateDatabase(updates);
};

export const AnswerToInvitation = (
  answer,
  invitation,
  user,
  notificationId
) => {
  let updates = {};

  if (answer === "rejected") {
    updates[`projects/${invitation.project.id}/people/${user.id}`] = [];
  } else {
    updates[`projects/${invitation.project.id}/people/${user.id}`] = {
      status: answer,
      permissions: invitation.permissions,
      photo: user.photo,
      username: user.username,
      id: user.id,
      color: randomColor(),
      email: user.email,
    };
    updates[`users/${user.id}/projects/${invitation.project.id}`] =
      invitation.project;
    updates[`users/${user.id}/notifications/${notificationId}/status`] = answer;
  }

  firebase.UpdateDatabase(updates);
};

export const SendMessage = (message, projectId, chatId) => {
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

export const MarkMessageAsSeen = (chat, user) => {
  let updates = {};
  updates[
    `projects/${chat.projectId}/messages/${chat.chatId}/lastMessage/seenBy/${user.id}`
  ] = { id: user.id };
  firebase.UpdateDatabase(updates);
};

export const AddOrEditCalendarEvent = (projectId, newEvent) => {
  let updates = {};

  updates[
    `projects/${projectId}/events/${date.format(newEvent.start, "MM-YYYY")}/${
      newEvent.id
    }`
  ] = newEvent;
  firebase.UpdateDatabase(updates);
};

export const CreateFolder = (projectId, path, paths) => {
  let updates = {};
  updates[`projects/${projectId}/files/${path}`] = {
    path: path,
    type: "folder",
  };
  firebase.UpdateDatabase(updates);
};

export const AddFile = (projectId, path, paths) => {};

export const AddNote = (note, projectId) => {
  let updates = {};
  note.date = new Date();
  updates[`projects/${projectId}/notes/${note.id}`] = note;
  firebase.UpdateDatabase(updates);
};
