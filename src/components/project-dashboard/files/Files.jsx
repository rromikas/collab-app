import React, { useRef, useEffect, useState } from "react";
import {
  BsFolderPlus,
  BsFolder,
  BsFileEarmarkPlus,
  BsChevronDown,
} from "react-icons/bs";
import * as firebase from "../../../database/firebase";
import date from "date-and-time";
import { BsThreeDots } from "react-icons/bs";
import Loader from "../../utility/Loader";
import NoFiles from "../../../pictures/NoFiles";
import Popover from "../../utility/Popover";
import { CreateFolder } from "../../../database/api";
import Dropbox from "./Dropbox";
import GoogleDrive from "./GoogleDrive";
import { FaLaptop } from "react-icons/fa";
import md5 from "md5";
import prettyFileIcons from "pretty-file-icons";
import { Icons } from "../../../pictures/file-icons/index";
import mime from "mime-types";
import { uid } from "react-uid";

const getMetadata = (metadata, path, filename) => {
  let myMetadata = { ...metadata };
  path.forEach((x) => {
    myMetadata = myMetadata[x];
  });
  myMetadata = myMetadata[filename]
    ? myMetadata[filename].metadata
    : { uploadedBy: "", previewLink: "", date: new Date() };
  return myMetadata;
};

const handleFileUpload = (e, path, user, projectId, onFinish = () => {}) => {
  let file = e.target.files[0];
  console.log("file simple upload", file);
  if (file) {
    if (file.size < 10000000) {
      if (file.name.length < 400) {
        firebase.UploadFile(path, file, user.username, onFinish, projectId);
      } else {
        alert("file name is too long");
      }
    } else {
      alert("file is too large");
    }
  }
};

const Files = ({ projectId, user, setProject, size, metadata }) => {
  const listHeight =
    size.width > 768
      ? size.height - 64 - 24 - 76 - 56 - 24
      : size.height - 64 - 24 - 76 - 56;
  const uploader = useRef(null);
  const folderMaker = useRef(null);
  const fileUploadMaker = useRef(null);
  const sortMaker = useRef(null);
  const [fileSystem, setFileSystem] = useState({ prefixes: [], items: [] });
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState([projectId]);
  const [newFolder, setNewFolder] = useState("");
  const [tick, setTick] = useState(false);
  const [filter, setFilter] = useState("date");
  useEffect(() => {
    let pathString = path.join("/");

    firebase.GetFiles(pathString).then((res) => {
      let items = [];
      if (Object.values(metadata).length) {
        res.items.forEach((x) => {
          let hashedName = md5(x.name);
          let fileMetadata = getMetadata(metadata, path, hashedName);
          let item = Object.assign({}, fileMetadata, { name: x.name });
          items.push(item);
        });
      }

      setFileSystem({ prefixes: res.prefixes, items: items });
    });
  }, [path, tick, metadata]);

  return (
    <div className="row no-gutters position-relative px-2">
      {loading ? (
        <div className="col-12 p-5">
          <Loader loading={loading} size={30}></Loader>
        </div>
      ) : (
        <div className="col-12">
          <div
            className="row no-gutters align-items-center p-3 justify-content-between flex-nowrap"
            style={{ fontSize: "21px" }}
          >
            <div className="col-auto">
              <div className="row no-gutters">
                <Popover
                  content={
                    <div className="popover-inner">
                      <div className="popover-label">name</div>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="w-100"
                          value={newFolder}
                          onChange={(e) => {
                            e.persist();
                            setNewFolder(e.target.value);
                          }}
                        ></input>
                      </div>
                      <div
                        className="d-flex mx-auto justify-content-center"
                        style={{ maxWidth: "250px" }}
                      >
                        <div
                          className="col-auto btn-pro mr-1"
                          onClick={() => {
                            firebase.CreateFolder(
                              path.join("/") + "/" + newFolder.toString(),
                              user,
                              projectId,
                              () => setTick(!tick)
                            );
                            folderMaker.current.click();
                            setNewFolder("");
                          }}
                        >
                          Create
                        </div>
                        <div
                          className="col-auto btn"
                          onClick={() => folderMaker.current.click()}
                        >
                          Cancel
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div
                    className="col-auto mr-2 btn-pro d-flex align-items-center"
                    ref={folderMaker}
                  >
                    <BsFolderPlus
                      fontSize="20px"
                      color="white"
                      className="mr-md-2"
                    ></BsFolderPlus>
                    <div className="d-none d-md-block">Add Folder</div>
                  </div>
                </Popover>
                <Popover
                  content={
                    <div className="popover-inner">
                      <div
                        className="popover-content-item"
                        onClick={() => uploader.current.click()}
                      >
                        <FaLaptop className="mr-2"></FaLaptop>Local files
                        <input
                          className="d-none"
                          type="file"
                          ref={uploader}
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              path.join("/"),
                              user,
                              projectId,
                              () => {
                                setTick(!tick);
                                fileUploadMaker.current.click();
                              }
                            )
                          }
                        ></input>
                      </div>
                      <div className="popover-content-item">
                        <Dropbox
                          path={path.join("/")}
                          user={user}
                          projectId={projectId}
                          onFinish={() => {
                            setTick(!tick);
                            fileUploadMaker.current.click();
                          }}
                        ></Dropbox>
                      </div>
                      <div className="popover-content-item">
                        <GoogleDrive
                          path={path.join("/")}
                          user={user}
                          projectId={projectId}
                          onFinish={() => {
                            setTick(!tick);
                            fileUploadMaker.current.click();
                          }}
                        ></GoogleDrive>
                      </div>
                    </div>
                  }
                >
                  <div
                    className="col-auto mr-2 btn-pro d-flex align-items-center"
                    ref={fileUploadMaker}
                  >
                    <BsFileEarmarkPlus
                      color="white"
                      fontSize="20px"
                      className="mr-md-2"
                    ></BsFileEarmarkPlus>
                    <div className="d-none d-md-block">Add file</div>
                  </div>
                </Popover>
              </div>
            </div>
            <Popover
              content={
                <div className="popover-inner">
                  <div
                    className="popover-content-item"
                    onClick={() => {
                      setFilter("date");
                      sortMaker.current.click();
                    }}
                  >
                    Date modified
                  </div>
                  <div
                    className="popover-content-item"
                    onClick={() => {
                      setFilter("name");
                      sortMaker.current.click();
                    }}
                  >
                    Name
                  </div>
                  <div
                    className="popover-content-item"
                    onClick={() => {
                      setFilter("uploadedBy");
                      sortMaker.current.click();
                    }}
                  >
                    Author
                  </div>
                </div>
              }
            >
              <div
                className="col-auto btn d-flex align-items-center"
                ref={sortMaker}
              >
                <div className="mr-2 d-flex">
                  <div className="mr-md-2">Sort by</div>
                  <div className="d-none d-md-block">
                    {filter === "uploadedBy" ? "author" : filter}
                  </div>
                </div>
                <BsChevronDown fontSize="14px"></BsChevronDown>
              </div>
            </Popover>
          </div>
          <div className="row no-gutters px-3">
            {path.map((x, i) => (
              <div className="col-auto" key={uid(x)}>
                <div className="row no-gutters">
                  <div
                    className="col-auto mr-1 btn-link cursor-pointer"
                    onClick={() =>
                      setPath((p) => {
                        let arr = [...p];
                        arr = arr.slice(0, i + 1);
                        return arr;
                      })
                    }
                  >
                    {x !== projectId ? x : "home"}
                  </div>
                  <div className="col-auto mr-1">/</div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="row no-gutters p-3"
            style={{ minHeight: `${listHeight}px` }}
          >
            <div className="col-12">
              <div className="row no-gutters">
                {fileSystem.prefixes.map((x) => {
                  return (
                    <div
                      className="col-12 col-sm-4 col-lg-3 col-xl-2 file-card p-3 clickable-item"
                      key={uid(x)}
                    >
                      <div
                        className="row no-gutters justify-content-end"
                        style={{ position: "relative", zIndex: 5 }}
                      >
                        <Popover
                          content={
                            <div className="popover-inner">
                              <div
                                className="popover-content-item"
                                onClick={() => {
                                  let firebasePath = `projects/${projectId}/files/${path.join(
                                    "/"
                                  )}/${x.name}`;
                                  let storagePath =
                                    path.join("/") +
                                    "/" +
                                    x.name +
                                    "/placeholder-rare-name";
                                  console.log(
                                    "Firebase path, sotrag path",
                                    firebasePath,
                                    storagePath
                                  );
                                  firebase
                                    .DeleteFile(firebasePath, storagePath)
                                    .then(() => setTick(!tick));
                                }}
                              >
                                Delete
                              </div>
                            </div>
                          }
                        >
                          <BsThreeDots fontSize="20px"></BsThreeDots>
                        </Popover>
                      </div>
                      <div
                        className="row no-gutters align-items-center"
                        style={{ marginTop: "-17px" }}
                      >
                        <div className="col-auto col-sm-12">
                          <div className="text-sm-center mr-2">
                            <BsFolder
                              onClick={() => setPath((p) => p.concat([x.name]))}
                              className="clickable-item"
                              fontSize="50px"
                            ></BsFolder>
                          </div>
                        </div>
                        <div className="col col-sm-12">
                          <div className="row no-gutters">
                            <div
                              className="text-sm-center file-name-fixed mr-2 col-12 text-truncate"
                              style={{ fontSize: "14px" }}
                            >
                              {x.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {fileSystem.items
                  .filter((x) => x.name !== "placeholder-rare-name")
                  .sort((a, b) =>
                    a[filter] > b[filter]
                      ? filter === "date"
                        ? -1
                        : 1
                      : a[filter] < b[filter]
                      ? filter === "date"
                        ? 1
                        : -1
                      : 0
                  )
                  .map((x) => {
                    let icon;
                    let extension =
                      x.fileProvider === "google drive"
                        ? mime.extension(x.mimeType)
                        : mime.extension(mime.lookup(x.name));
                    if (!Icons[extension]) {
                      icon =
                        Icons[prettyFileIcons.getIcon("fakeFile." + extension)];
                    } else {
                      icon = Icons[extension];
                    }
                    return (
                      <div
                        className="col-12 col-sm-4 col-lg-3 col-xl-2 file-card p-3 clickable-item"
                        key={uid(x)}
                      >
                        <div
                          className="row no-gutters justify-content-end"
                          style={{ position: "relative", zIndex: 5 }}
                        >
                          <Popover
                            content={
                              <div className="popover-inner">
                                <div
                                  className="popover-content-item"
                                  onClick={() => {
                                    let firebasePath = `projects/${projectId}/files/${x.path}`;
                                    let storagePath =
                                      path.join("/") + "/" + x.name;
                                    console.log(
                                      "Firebase path, sotrag path",
                                      firebasePath,
                                      storagePath
                                    );
                                    firebase
                                      .DeleteFile(firebasePath, storagePath)
                                      .then(() => setTick(!tick));
                                  }}
                                >
                                  Delete
                                </div>
                              </div>
                            }
                          >
                            <BsThreeDots fontSize="20px"></BsThreeDots>
                          </Popover>
                        </div>
                        <div
                          className="row no-gutters align-items-center"
                          style={{ marginTop: "-17px" }}
                        >
                          <div className="col-auto col-sm-12">
                            <div className="text-sm-center mr-2">
                              <img
                                onClick={async () => {
                                  if (x.fileProvider === "local files") {
                                    let url = await firebase.GetDownloadUrl(
                                      path.reduce(
                                        (a, b) =>
                                          a.toString() + "/" + b.toString(),
                                        ""
                                      ) +
                                        "/" +
                                        x.name
                                    );
                                    window.open(url);
                                  } else {
                                    window.open(x.previewLink);
                                  }
                                }}
                                style={{ width: "50px" }}
                                className="image-fluid"
                                src={icon}
                              ></img>
                            </div>
                          </div>
                          <div className="col col-sm-12">
                            <div className="row no-gutters">
                              <div
                                className="text-sm-center file-name-fixed mr-2 col-12 text-truncate"
                                style={{ fontSize: "14px" }}
                              >
                                {x.name}
                              </div>
                            </div>
                            <div className="row no-gutters">
                              <div
                                className="text-sm-center file-name-fixed mr-2 col-12"
                                style={{ fontSize: "14px" }}
                              >
                                by {x.uploadedBy}
                              </div>
                            </div>
                            <div className="row no-gutters">
                              <div
                                className="text-sm-center file-name-fixed mr-2 col-12"
                                style={{ fontSize: "14px" }}
                              >
                                {date.format(new Date(x.date), "DD MMM, YYYY")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="row no-gutters h-100 justify-content-center align-items-center">
                <div className="col-lg-4 col-5">
                  <div
                    className="row no-gutters"
                    style={{ transform: `translate(-20px, -79px)` }}
                  >
                    {!fileSystem.items.filter(
                      (x) => x.name !== "placeholder-rare-name"
                    ).length &&
                      !fileSystem.prefixes.length && <NoFiles></NoFiles>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
