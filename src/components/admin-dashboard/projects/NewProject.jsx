import React, { useEffect, useState } from "react";
import store from "../../../store/store";
import history from "../../../History";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";

const createProject = (project) => {
  if (project.title !== "" && project.description !== "") {
    let updates = {};
    updates[`users/${project.creator.id}/projects/${project.id}`] = project;
    updates[`projects/${project.id}`] = project;
    firebase.UpdateDatabase(updates);
    history.push(`/${project.creator.id}/projects`);
  }
};

const NewProject = ({ user }) => {
  console.log("rerender new roject");
  const [project, setProject] = useState({
    title: "",
    description: "",
    id: uniqid("project-"),
    starred: false,
    date: new Date(Date.now()).toString(),
    events: {
      AAAPlaceholder: {
        id: "AAAplaceholder",
      },
    },
    times: {
      AAAPlaceholder: {
        id: "AAAplaceholder",
      },
    },
    chats: {
      AAAPlaceholder: {
        id: "AAAplaceholder",
      },
    },
    files: {
      AAAPlaceholder: {
        id: "AAAplaceholder",
      },
    },
    creator: { username: user.username, photo: user.photo, id: user.id },
  });

  useEffect(() => {
    store.dispatch({
      type: "SET_BACKLINK",
      backlink: { title: "Projects", path: `/${user.id}/projects` },
    });
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "New Project" });
    return function cleanup() {
      store.dispatch({
        type: "SET_BACKLINK",
        backlink: { title: "", path: "" },
      });
    };
  }, []);
  return (
    <div className="row no-gutters px-2 px-md-3 px-lg-4">
      <div className="col-12 new-project p-4">
        <div className="row no-gutters">
          <label>Project name*</label>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-12 col-sm-9 col-md-7">
            <input
              spellCheck={false}
              value={project.title}
              onChange={(e) => {
                e.persist();
                setProject((pr) =>
                  Object.assign({}, pr, { title: e.target.value })
                );
              }}
              style={{ width: "100%" }}
              type="text"
              placeholder="Enter the name of the project"
            ></input>
          </div>
        </div>
        <div className="row no-gutters">
          <label>Description</label>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-12 col-sm-9 col-md-7">
            <textarea
              spellCheck={false}
              value={project.description}
              onChange={(e) => {
                e.persist();
                setProject((pr) =>
                  Object.assign({}, pr, { description: e.target.value })
                );
              }}
              placeholder="Describe the project"
              style={{ width: "100%", height: "170px" }}
            ></textarea>
          </div>
        </div>
        <div className="row no-gutters">
          <div
            className="col-auto btn-pro mr-2"
            onClick={() => createProject(project)}
          >
            Create project
          </div>
          <div
            className="col-auto btn"
            onClick={() => history.push(`/${user.id}/projects`)}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
