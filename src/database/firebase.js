const firebase = require("firebase");
const config = require("../FirebaseConfig");

firebase.initializeApp(config);

firebase
  .auth()
  .signInAnonymously()
  .catch(function (error) {
    console.log(error);
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("authenitcated firebase");
  } else {
    console.log("firebase authentication failed");
  }
});

export const UpdateDatabase = (updates) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref()
      .update(updates)
      .then((res) => {
        if (res) {
          reject(res);
        } else {
          resolve(true);
        }
      });
  });
};

export const GetFromDatabase = (path) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(path)
      .once("value")
      .then((snapshot) => {
        resolve(snapshot.val());
      })
      .catch((er) => {
        console.log(er);
      });
  });
};

export const on = (path, fn) => {
  firebase
    .database()
    .ref(path)
    .on("value", (snapshot) => {
      fn(snapshot.val());
    });
};

export const off = (path) => {
  firebase.database().ref(path).off("value");
};

export const UploadFile = (
  path,
  file,
  metadata,
  tracker,
  onError,
  onSuccess
) => {
  let uploadTask = firebase.storage().ref(path).put(file, metadata);
  uploadTask.on(
    "state_changed",
    function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      let state;
      if (snapshot.state === firebase.storage.TaskState.PAUSED) {
        state = "paused";
      } else if (snapshot.state === firebase.storage.TaskState.RUNNING) {
        state = firebase.storage.TaskState.RUNNING;
      }
      tracker({ progress, state });
    },
    onError,
    function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      console.log("REF", uploadTask.snapshot.ref);
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        onSuccess({
          fullPath: uploadTask.snapshot.ref.fullPath,
          downloadUrl: downloadURL,
        });
      });
    }
  );
};

export const GetFiles = (path) => {
  return new Promise((resolve, reject) => {
    firebase
      .storage()
      .ref(path)
      .listAll()
      .then((res) => {
        resolve(
          res.prefixes.length > res.items.length ? res.prefixes : res.items
        );
      });
  });
};

firebase
  .storage()
  .ref("project-kbv08wpd/folder_for_8_teorija.pdf")
  .listAll()
  .then((res) => {
    console.log("Asdasfinqe", res);
    console.log(
      res.items[0].getMetadata().then((asd) => console.log("Asdads", asd))
    );
  });

export const instance = firebase;
