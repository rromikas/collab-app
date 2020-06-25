import React, { useEffect, useState } from "react";
import store from "../../../store/store";
import history from "../../../history";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";

const editProject = (project, user) => {
  if (project.title !== "" && project.description !== "") {
    let updates = {};
    updates[`users/${user.id}/projects/${project.id}/title`] = project.title;
    updates[`users/${user.id}/projects/${project.id}/description`] =
      project.description;
    updates[`projects/${project.id}/title`] = project.title;
    updates[`projects/${project.id}/description`] = project.description;
    firebase.UpdateDatabase(updates);
  }
};

const EditProject = ({ user, projectId }) => {
  console.log("rerender new roject");
  const [project, setProject] = useState({
    title: user.id !== "" ? user.projects[projectId].title : "",
    description: user.id !== "" ? user.projects[projectId].description : "",
    id: user.id !== "" ? user.projects[projectId].id : "",
  });

  useEffect(() => {
    store.dispatch({
      type: "SET_BACKLINK",
      backlink: { title: "Projects", path: `/${user.id}/projects` },
    });
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Edit Project" });
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
            onClick={() => editProject(project, user)}
          >
            Save changes
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

export default EditProject;
