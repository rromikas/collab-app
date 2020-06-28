import React, { useRef, useEffect, useState } from "react";
import {
  BsFolderPlus,
  BsFolder,
  BsFileEarmark,
  BsFileEarmarkPlus,
} from "react-icons/bs";
import * as firebase from "../../../database/firebase";
import date from "date-and-time";
import { BsChevronLeft } from "react-icons/bs";
import Loader from "../../utility/Loader";
import * as sizes from "../../../size";

const handleFileUpload = (e, projectId, user, setFiles, setLoading, folder) => {
  let file = e.target.files[0];
  var metadata = {
    customMetadata: {
      uploadedBy: user.username,
    },
  };
  if (file) {
    if (file.size < 10000000) {
      if (file.name.length < 40) {
        firebase.UploadFile(
          `${projectId}/${folder ? folder : file.name}/${file.name}`,
          file,
          metadata,
          (res) => console.log(res),
          (err) => console.log("error uploading file", err),
          (final) => {
            let fileNames = final.fullPath.split("/");
            let newFile = {
              name: fileNames[folder ? fileNames.length - 1 : 1],
              uploadedBy: user.username,
              timeCreated: date.format(new Date(), "MMM DD, YYYY"),
            };
            setFiles((f) => f.concat(newFile));
            setLoading(false);
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

const Files = ({ projectId, user, setProject, size }) => {
  const listHeight =
    size.width > 768
      ? size.height - 24 - 62.4 - 56 - 79.2
      : size.height - 79.2 - 62.4 - 56;
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
        firebase.GetFiles(path).then(async (res) => {
          let newFiles = [];
          for (let i = 0; i < res.length; i++) {
            let newFile = {
              name: res[i].name,
              uploadedBy: "",
              downloadUrl: "",
              timeCreated: "",
            };
            let metadata = await res[i].getMetadata();
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
    <div className="row no-gutters position-relative px-2">
      {loading ? (
        <div className="col-12 p-5">
          <Loader loading={loading} size={30}></Loader>
        </div>
      ) : (
        <div className="col-12">
          <div
            className="row no-gutters align-items-center p-3"
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
            <div className="col-auto p-2">
              {!folder ? (
                <BsFolderPlus
                  fontSize="25px"
                  className="clickable-item"
                  onClick={() => {
                    uploader.current.click();
                  }}
                ></BsFolderPlus>
              ) : (
                <BsFileEarmarkPlus
                  fontSize="25px"
                  className="clickable-item"
                  onClick={() => {
                    uploader.current.click();
                  }}
                ></BsFileEarmarkPlus>
              )}

              <input
                type="file"
                style={{ display: "none" }}
                ref={uploader}
                onChange={(e) => {
                  setLoading(true);
                  handleFileUpload(
                    e,
                    projectId,
                    user,
                    setFiles,
                    setLoading,
                    folder
                  );
                }}
              ></input>
            </div>
          </div>
          <div className="row no-gutters">
            <div
              className="col-12 overflow-auto"
              style={{ height: `${listHeight}px` }}
            >
              <div className="row no-gutters">
                {files.map((x) => {
                  return (
                    <div
                      className="col-12 col-sm-4 col-lg-3 col-xl-2 file-card p-4 clickable-item"
                      onClick={() => {
                        if (folder) {
                          window.open(x.downloadUrl);
                        } else {
                          setFolder(x.name);
                        }
                      }}
                    >
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto col-sm-12">
                          <div className="text-sm-center mr-2">
                            {folder ? (
                              <BsFileEarmark
                                className="clickable-item"
                                fontSize="calc(2.5em + 3vw)"
                              ></BsFileEarmark>
                            ) : (
                              <BsFolder
                                className="clickable-item"
                                fontSize="calc(2.5em + 3vw)"
                              ></BsFolder>
                            )}
                          </div>
                        </div>
                        <div className="col col-sm-12">
                          <div className="row no-gutters">
                            <div
                              className="text-sm-center file-name-fixed mr-2 col-12"
                              style={{ fontSize: "14px" }}
                            >
                              {x.name.length > 13
                                ? x.name.substring(0, 13) + "..."
                                : x.name}
                            </div>
                            {folder ? (
                              <div
                                className="justify-content-sm-center col-12 d-flex"
                                style={{ fontSize: "14px" }}
                              >
                                <div className="mr-2">By:</div>
                                <div className="text-primary">
                                  {x.uploadedBy}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {x.timeCreated && (
                              <div
                                className="text-sm-center col-12"
                                style={{ fontSize: "14px" }}
                              >
                                {x.timeCreated}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
