import React, { useRef, useEffect, useState } from "react";
import { BsFolderPlus, BsFolder, BsFileEarmark } from "react-icons/bs";
import * as firebase from "../../../database/firebase";
import date from "date-and-time";

const handleFileUpload = (e, projectId, user, files, setProject) => {
  let file = e.target.files[0];
  console.log(file);
  var metadata = {
    customMetadata: {
      uploadedBy: user.username,
    },
  };
  if (file) {
    if (file.size < 10000000) {
      if (file.name.length < 40) {
        firebase.UploadFile(
          `${projectId}/${file.name}/${file.name}`,
          file,
          metadata,
          (res) => console.log(res),
          (err) => console.log("error uploading file", err),
          (final) => {
            let fileNames = final.fullPath.split("/");
            let folderName = fileNames[1];
            let fileName = fileNames[2];
            let file = { folderName, fileName, donwloadUrl: final.downloadUrl };
            let newFiles = { ...files };
            console.log("NEW FILES TEMp", newFiles);
            if (!newFiles[folderName]) {
              newFiles[folderName] = {};
            }
            newFiles[folderName][fileName] = file;
            setProject((p) => Object.assign({}, p, { files: newFiles }));
          }
        );
      } else {
        alert("file name is too long");
      }
    } else {
      alert("file is too large");
    }
  }
};

const Files = ({ projectId, user, setProject }) => {
  const uploader = useRef(null);
  const [folder, setFolder] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    firebase.GetFiles(projectId).then((res) => {
      console.log("ALL FILES", res);
      console.log(res[0].getMetadata());
      setFiles(res);
    });
  }, [projectId]);
  return (
    <div className="row no-gutters position-relative px-2 px-sm-3 px-md-4 py-3">
      <div className="col-12">
        <BsFolderPlus
          fontSize="80px"
          className="clickable-item"
          onClick={() => {
            uploader.current.click();
          }}
        ></BsFolderPlus>
        <BsFolder fontSize="80px"></BsFolder>
        <input
          type="file"
          style={{ display: "none" }}
          ref={uploader}
          onChange={(e) =>
            handleFileUpload(e, projectId, user, files, setProject)
          }
        ></input>
      </div>
      <div className="col-12">
        <div className="row no-gutters">
          {folder === "" ? (
            <div className="col-12">
              <div className="row no-gutters">All folders</div>
              <div className="row no-gutters">
                {files.map((x) => (
                  <div className="col-12">
                    <div className="row no-gutters">
                      <div className="col-auto mr-2">
                        <BsFolder fontSize="80px"></BsFolder>
                      </div>
                      <div
                        className="col"
                        style={{ fontSize: "12px" }}
                        onClick={() => setFolder(x.name)}
                      >
                        <div className="row no-gutters">{x.name}</div>
                        <div className="row no-gutters">
                          {Object.keys(x.getMetadata()).map((y) => y)}
                        </div>
                        <div className="row no-gutters"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="col-12">
              <div className="row no-gutters">
                {Object.keys(files[folder]).map((x) => (
                  <div className="col-auto">
                    <div className="row no-gutters">
                      <BsFileEarmark fontSize="80px"></BsFileEarmark>
                    </div>
                    <div className="row no-gutters">{x.fileName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
