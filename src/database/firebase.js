const firebase = require("firebase");
const config = require("../FirebaseConfig");
const md5 = require("md5");

firebase.initializeApp(config);

firebase
  .auth()
  .signInAnonymously()
  .catch(function (error) {
    console.log(error);
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("errro authenticating firebase: ", errorMessage);
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

export const GetDownloadUrl = (path) => {
  console.log("PAth get ownalod url", path);
  return new Promise((resolve, reject) => {
    firebase
      .storage()
      .ref(path)
      .getDownloadURL()
      .then((url) => {
        resolve(url);
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

export const UploadFile = (path, file, uploadedBy, onSuccess, projectId) => {
  let hashedName = md5(file.name);
  let pathForFirebase = `${path}/${hashedName}`;
  let pathForStorage = `${path}/${file.name}`;
  let metadata = {
    customMetadata: {
      path: pathForFirebase,
      uploadedBy: uploadedBy,
      date: new Date(),
      type: "file",
      fileProvider: "local files",
      mimeType: file.type,
    },
  };
  let updates = {};
  updates[`projects/${projectId}/files/${pathForFirebase}`] = {
    metadata: metadata.customMetadata,
  };
  UpdateDatabase(updates);

  let uploadTask = firebase.storage().ref(pathForStorage).put(file, metadata);
  uploadTask.on(
    "state_changed",
    function (snapshot) {
      //progress tracking
    },
    () => {
      //error handler
    },
    function () {
      onSuccess();
    }
  );
};

export const DeleteFile = (firebasePath, storagePath) => {
  return new Promise((resolve, reject) => {
    let updates = {};
    updates[firebasePath] = [];

    firebase
      .storage()
      .ref()
      .child(storagePath)
      .delete()
      .then(() => {
        UpdateDatabase(updates);
        resolve(true);
      });
  });
};

export const UploadDropboxFile = (path, file, author, projectId) => {
  return new Promise((resolve, reject) => {
    let hashedName = md5(file.name);
    let pathForFirebase = `${path}/${hashedName}`;
    let pathForStorage = `${path}/${file.name}`;
    let metadata = {
      customMetadata: {
        date: new Date(),
        type: "file",
        path: pathForFirebase,
        fileProvider: "dropbox",
        previewLink: file.link,
        uploadedBy: author,
      },
    };

    let updates = {};
    updates[`projects/${projectId}/files/${pathForFirebase}`] = {
      metadata: metadata.customMetadata,
    };

    var f = new File([""], "nesvarbu");
    let uploadTask = firebase.storage().ref(pathForStorage).put(f, metadata);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        //Progress shit
      },
      function () {
        //error handling
      },
      function () {
        UpdateDatabase(updates);
        resolve(true);
      }
    );
  });
};

export const UploadGoogleDriveFile = (path, file, author, projectId) => {
  return new Promise((resolve, reject) => {
    let hashedName = md5(file.name);
    let pathForFirebase = `${path}/${hashedName}`;
    let pathForStorage = `${path}/${file.name}`;
    let metadata = {
      customMetadata: {
        type: "file",
        date: new Date(),
        path: pathForFirebase,
        uploadedBy: author,
        fileProvider: "google drive",
        previewLink: file.url,
        mimeType: file.mimeType,
      },
    };
    let updates = {};
    updates[`projects/${projectId}/files/${pathForFirebase}`] = {
      metadata: metadata.customMetadata,
    };

    var f = new File([""], "nesvarbu");
    let uploadTask = firebase.storage().ref(pathForStorage).put(f, metadata);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        //Progress shit
      },
      function () {
        //error handling
      },
      function () {
        UpdateDatabase(updates);
        resolve(true);
      }
    );
  });
};

export const GetFiles = (path) => {
  return new Promise((resolve, reject) => {
    firebase
      .storage()
      .ref(path)
      .listAll()
      .then((res) => {
        resolve(res);
      });
  });
};

export const CreateFolder = (path, user, projectId, onSuccess) => {
  let updates = {};
  updates[`projects/${projectId}/files/${path}/metadata`] = {
    date: new Date(),
    createdBy: user.username,
    type: "folder",
  };

  var f = new File([""], "placeholder");
  let uploadTask = firebase
    .storage()
    .ref(`${path}/placeholder-rare-name`)
    .put(f);
  uploadTask.on(
    "state_changed",
    function (snapshot) {
      //progress tracking
    },
    () => {
      //error handler
    },
    function () {
      UpdateDatabase(updates);
      onSuccess();
    }
  );
};

export const instance = firebase;
