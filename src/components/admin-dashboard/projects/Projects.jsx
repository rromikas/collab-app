import React, { useEffect, useState } from "react";
import { BsThreeDots, BsStarFill } from "react-icons/bs";
import Popover from "../../utility/Popover";
import { uid } from "react-uid";
import history from "../../../History";
import NoProjects from "../../../pictures/NoProjects";
import * as firebase from "../../../database/firebase";
import store from "../../../store/store";

const deleteProject = (projectId, userId) => {
  let updates = {};
  updates[`projects/${projectId}`] = [];
  updates[`users/${userId}/projects/${projectId}`] = [];
  firebase.UpdateDatabase(updates);
};

const Projects = ({ projects, userId }) => {
  let onlyProjects = { ...projects };
  delete onlyProjects["AAAPlaceholder"];

  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Projects" });
  }, []);

  return (
    <div className="row no-gutters px-2 px-md-3 px-lg-4">
      <div
        className="col-auto btn-pro mb-2"
        onClick={() => history.push(`/${userId}/new-project`)}
      >
        Start a new project
      </div>
      <div className="col-12">
        {Object.values(onlyProjects).length > 0 ? (
          <div className="row">
            {Object.values(onlyProjects).map((x) => (
              <div
                key={uid(x)}
                className="col-lg-3 col-md-6 col-sm-12 px-3 py-2 py-md-3"
                style={{ minWidth: "250px" }}
              >
                <div className="row no-gutters bg-white p-4 project-card">
                  <div className="col-12">
                    <div className="row no-gutters">
                      <div className="col pr-2">
                        <div
                          className="row no-gutters title"
                          onClick={() =>
                            history.push(`/${userId}/projects/${x.id}/files`)
                          }
                        >
                          {x.title}
                        </div>
                        <div className="row no-gutters for-company">
                          <div style={{ fontWeight: "500" }} className="pr-1">
                            for
                          </div>
                          <div>{x.for}</div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="row no-gutters">
                          <Popover
                            delay={500}
                            theme="dark"
                            trigger="mouseenter"
                            position="top"
                            content={
                              <div className="popover-inner-dark">
                                star/unstar
                              </div>
                            }
                          >
                            <BsStarFill
                              fontSize="20px"
                              className="hoverable-gray"
                            ></BsStarFill>
                          </Popover>
                        </div>
                        <div className="row no-gutters">
                          <Popover
                            content={
                              <div className="popover-inner">
                                <div
                                  className="popover-content-item"
                                  onClick={() =>
                                    history.push(
                                      `/${userId}/projects/${x.id}/edit`
                                    )
                                  }
                                >
                                  Edit
                                </div>
                                <div className="popover-content-item">
                                  Complete
                                </div>
                                <hr></hr>
                                <div
                                  className="popover-content-item"
                                  onClick={() => deleteProject(x.id, userId)}
                                >
                                  move to trash
                                </div>
                              </div>
                            }
                          >
                            <BsThreeDots
                              fontSize="20px"
                              className="hoverable-gray"
                            ></BsThreeDots>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 description"
                    onClick={() =>
                      history.push(`/${userId}/projects/${x.id}/files`)
                    }
                  >
                    {x.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="row no-gutters justify-content-center"
            style={{ height: "500px" }}
          >
            <NoProjects></NoProjects>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
