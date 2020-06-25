const firebase = require("./firebase");

export const readFiles = (folder) => {
  return new Promise((resolve, reject) => {
    let ref = firebase.storage().ref(folder);
    ref
      .listAll()
      .then((list) => {
        resolve(list.items);
      })
      .catch((er) => {
        reject(er);
      });
  });
};

export const getImageUrl = (path) => {
  return new Promise((resolve, reject) => {
    let ref = firebase.storage().ref(path);
    ref.getDownloadURL().then((url) => {
      resolve(url);
    });
  });
};
