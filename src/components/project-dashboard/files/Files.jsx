import React, { useRef, useEffect, useState } from "react";
import { BsFolderPlus, BsFolder, BsFileEarmark } from "react-icons/bs";
import * as firebase from "../../../database/firebase";
import date from "date-and-time";
import { BsChevronLeft } from "react-icons/bs";
import Loader from "../../utility/Loader";

const handleFileUpload = (e, projectId, user, setFiles) => {
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
            let newFile = { name: fileNames[1] };
            setFiles((f) => f.concat(newFile));
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (folder === "") {
      setLoading(true);
      firebase.GetFiles(projectId).then((res) => {
        setFiles(res);
        setLoading(false);
      });
    } else {
      setLoading(true);
      async function fetchMyAPI() {
        let path = `${projectId}/${folder}`;
        console.log("PATH", path);
        firebase.GetFiles(path).then(async (res) => {
          console.log("ALL FILES", res);
          let newFiles = [];
          for (let i = 0; i < res.length; i++) {
            let newFile = {
              name: res[i].name,
              uploadedBy: "",
              downloadUrl: "",
              timeCreated: "",
            };
            let metadata = await res[i].getMetadata();
            console.log("metadata", metadata);
            newFile.uploadedBy = metadata.customMetadata.uploadedBy;
            newFile.timeCreated = date.format(
              new Date(metadata.timeCreated),
              "MMM DD, YYYY"
            );
            let url = await res[i].getDownloadURL();
            newFile.downloadUrl = url;
            newFiles.push(newFile);
          }
          setFiles(newFiles);
          setLoading(false);
        });
      }

      fetchMyAPI();
    }
  }, [projectId, folder]);

  return (
    <div className="row no-gutters position-relative px-2 px-sm-3 px-md-4 py-3">
      {loading ? (
        <div className="col-auto">
          <Loader loading={loading} size={30}></Loader>
        </div>
      ) : (
        <div className="col-12">
          <div
            className="row no-gutters align-items-center mb-3"
            style={{ fontSize: "21px" }}
          >
            {folder ? (
              <React.Fragment>
                <div
                  className="col-auto mr-1 cursor-pointer"
                  onClick={() => setFolder("")}
                >
                  <BsChevronLeft fontSize="12px"></BsChevronLeft>
                </div>
                <div
                  className="col-auto mr-2 cursor-pointer"
                  onClick={() => setFolder("")}
                  style={{ fontSize: "14px" }}
                >
                  Folders /
                </div>
                <div className="col-auto mr-2">
                  {folder.length > 13
                    ? folder.substring(0, 13) + "..."
                    : folder}
                </div>
              </React.Fragment>
            ) : (
              <div className="col-auto mr-2">All folders</div>
            )}
          </div>
          <div className="row no-gutters">
            {!folder && (
              <div className="col-auto p-4 file-card">
                <BsFolderPlus
                  fontSize="80px"
                  className="clickable-item"
                  onClick={() => {
                    uploader.current.click();
                  }}
                ></BsFolderPlus>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={uploader}
                  onChange={(e) =>
                    handleFileUpload(e, projectId, user, setFiles)
                  }
                ></input>
              </div>
            )}

            {files.map((x) => {
              return (
                <div className="col-auto p-4 file-card">
                  <div className="row no-gutters">{x.timeCreated}</div>
                  <div className="row no-gutters clickable-item justify-content-center">
                    {folder ? (
                      <BsFileEarmark
                        fontSize="80px"
                        onClick={() => {
                          window.open(x.downloadUrl);
                        }}
                      ></BsFileEarmark>
                    ) : (
                      <BsFolder
                        onClick={() => setFolder(x.name)}
                        fontSize="80px"
                      ></BsFolder>
                    )}
                  </div>
                  <div className="row no-gutters" style={{ fontSize: "14px" }}>
                    {x.name.length > 13
                      ? x.name.substring(0, 13) + "..."
                      : x.name}
                  </div>
                  {folder ? (
                    <div
                      className="row no-gutters w-100"
                      style={{ fontSize: "14px" }}
                    >
                      <div className="mr-2">By:</div>
                      <div className="text-primary">{x.uploadedBy}</div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
