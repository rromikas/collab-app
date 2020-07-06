import React, { useEffect, useState, useRef } from "react";
import store from "../../../store/store";
import history from "../../../history";
import * as firebase from "../../../database/firebase";
import uniqid from "uniqid";
import randomColor from "randomcolor";
import Popover from "../../utility/Popover";
import Checkbox from "../../utility/Checkbox";
import { BsX } from "react-icons/bs";
import md5 from "md5";

const createProject = async (project, user) => {
  if (project.title !== "" && project.description !== "") {
    let updates = {};
    await Promise.all(
      project.members.map(async (x) => {
        let userId = md5(x.email);
        let res = await firebase.GetFromDatabase(`users/${userId}`);
        console.log("respinse chekcing is user exists", res);
        if (res) {
          let id = uniqid("notification-");
          updates[`users/${userId}/notifications/${id}`] = {
            permissions: x.permissions,
            user_id: user.id,
            text: `${user.username} invited you to the project "${project.title}"`,
            type: "invitation",
            project: project,
            id: id,
            status: "asked",
            date: new Date(Date.now()),
            seen: false,
          };
        }
      })
    );

    updates[`users/${user.id}/projects/${project.id}`] = project;
    updates[`projects/${project.id}`] = project;
    console.log("Updates new project", updates);
    firebase.UpdateDatabase(updates);
    history.push(`/${user.id}/projects`);
  }
};

const NewProject = ({ user }) => {
  const [newMember, setNewMember] = useState({ permissions: "", email: "" });
  const [project, setProject] = useState({
    title: "",
    description: "",
    id: uniqid("project-"),
    starred: false,
    date: new Date(Date.now()).toString(),
    members: [],
    people: {
      [user.id]: {
        id: user.id,
        permissions: "owner",
        color: randomColor(),
      },
    },

    status: "Running",
    user_id: user.id,
  });

  const newMemberAdder = useRef(null);

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
    <div className="row no-gutters px-0 px-md-3 px-lg-4 h-100 pb-md-4 pb-0 ">
      <div className="col-12 new-project p-4 project-card-corners">
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
          <Popover
            content={
              <div
                className="popover-inner row no-gutters"
                style={{ maxWidth: "180px" }}
              >
                <div className="popover-label">Email</div>
                <div className="col-12 mb-2">
                  <input
                    className="w-100"
                    type="text"
                    value={newMember.email}
                    onChange={(e) => {
                      e.persist();
                      setNewMember((prev) =>
                        Object.assign({}, prev, { email: e.target.value })
                      );
                    }}
                  ></input>
                </div>
                <div className="popover-label">Permissions</div>
                <div className="col-12 no mb-3">
                  <div className="row no-gutters mb-1">
                    <div className="col-auto mr-2">
                      <Checkbox
                        size={25}
                        checked={newMember.permissions === "owner"}
                        setChecked={(checked) => {
                          setNewMember((prev) =>
                            Object.assign({}, prev, {
                              permissions: checked ? "owner" : "",
                            })
                          );
                        }}
                      ></Checkbox>
                    </div>
                    <div className="col-auto">Owner</div>
                  </div>
                  <div className="row no-gutters">
                    <div className="col-auto mr-2">
                      <Checkbox
                        size={25}
                        checked={newMember.permissions === "client"}
                        setChecked={(checked) => {
                          setNewMember((prev) =>
                            Object.assign({}, prev, {
                              permissions: checked ? "client" : "",
                            })
                          );
                        }}
                      ></Checkbox>
                    </div>
                    <div className="col-auto">Client</div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row no-gutters justify-content-center">
                    <div
                      className="col-auto btn-pro mr-2"
                      onClick={() => {
                        let arr = [...project.members];

                        setProject((prev) =>
                          Object.assign({}, prev, {
                            members: arr.concat([newMember]),
                          })
                        );
                        setNewMember((prev) =>
                          Object.assign({}, prev, {
                            email: "",
                            permissions: "",
                          })
                        );
                        newMemberAdder.current.click();
                      }}
                    >
                      Add
                    </div>
                    <div
                      className="col-auto btn"
                      onClick={() => {
                        setNewMember((prev) =>
                          Object.assign({}, prev, {
                            email: "",
                            permissions: "",
                          })
                        );
                        newMemberAdder.current.click();
                      }}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <div className="col-auto btn mb-2" ref={newMemberAdder}>
              Add members
            </div>
          </Popover>
        </div>

        <div className="row no-gutters mb-4">
          {project.members.map((x, i) => (
            <div
              className="col-auto mr-2 mb-2 p-2 border"
              style={{ borderRadius: "0.5rem" }}
            >
              <div className="row no-gutters">
                <div className="col-auto mr-2">
                  <div className="row no-gutters">{x.email}</div>
                  <div className="row no-gutters">
                    <label>{x.permissions}</label>
                  </div>
                </div>
                <div className="col">
                  <BsX
                    fontSize="16px"
                    onClick={() => {
                      let arr = [...project.members];
                      arr.splice(i, 1);
                      setProject((prev) =>
                        Object.assign({}, prev, { members: arr })
                      );
                    }}
                  ></BsX>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row no-gutters">
          <div
            className="col-auto btn-pro mr-2"
            onClick={() => createProject(project, user)}
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
