import * as firebase from "./database/firebase";
import md5 from "md5";

export const AuthenticateUser = (user) => {
  return new Promise((resolve, reject) => {
    firebase.GetFromDatabase(`users/${md5(user.email)}`).then((data) => {
      if (data) {
        if (data.password === user.password) {
          resolve(data);
        } else {
          resolve({ error: "wrong credentials" });
        }
      } else {
        resolve({ error: "wrong credentials" });
      }
    });
  });
};
