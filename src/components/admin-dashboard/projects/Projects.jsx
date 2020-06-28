import React, { useEffect, useState } from "react";
import { BsThreeDots, BsStarFill } from "react-icons/bs";
import Popover from "../../utility/Popover";
import { uid } from "react-uid";
import history from "../../../history";
import NoProjects from "../../../pictures/NoProjects";
import * as firebase from "../../../database/firebase";
import store from "../../../store/store";

const deleteProject = (projectId) => {
  let updates = {};
  firebase.GetFromDatabase(`projects/${projectId}/people`).then((data) => {
    if (data) {
      Object.values(data).forEach((x) => {
        updates[`users/${x.id}/projects/${projectId}/status`] = "Deleted";
      });
    }
    firebase.UpdateDatabase(updates);
  });
  updates[`projects/${projectId}/status`] = "Deleted";
  firebase.UpdateDatabase(updates);
};

const Projects = ({ projects, userId, size }) => {
  const blockHeight =
    size.width > 768
      ? size.height - 62.4 - 48 - 24
      : size.height - 48 - 56 - 62.4;
  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Projects" });
  }, []);

  const runningProjects = Object.values(projects).filter(
    (x) => x.status !== "Deleted"
  );

  return (
    <div className="row no-gutters px-2 px-md-3 px-lg-4 pb-md-2">
      <div
        className="col-auto btn-pro my-2 mx-3"
        onClick={() => history.push(`/${userId}/new-project`)}
      >
        Start a new project
      </div>
      <div
        className="col-12 overflow-auto"
        style={{ minWidth: "250px", height: `${blockHeight}px` }}
      >
        {runningProjects.length > 0 ? (
          <div className="row no-gutters p-3">
            {runningProjects
              .filter((x) => x.status !== "Deleted")
              .map((x) => (
                <div
                  key={uid(x)}
                  className="col-lg-4 col-xl-3 col-xxl-2 col-sm-6 col-12 pr-sm-3 pb-2 pb-sm-3"
                >
                  <div className="row no-gutters bg-white p-4 project-card">
                    <div className="col-12">
                      <div className="row no-gutters">
                        <div className="col pr-2">
                          <div
                            className="row no-gutters title text-truncate cursor-pointer"
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
                            <div>{x.creator.username}</div>
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
                                className="clickable-item"
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
                                    onClick={() => deleteProject(x.id)}
                                  >
                                    move to trash
                                  </div>
                                </div>
                              }
                            >
                              <BsThreeDots
                                fontSize="20px"
                                className="clickable-item"
                              ></BsThreeDots>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-wrap text-truncate col-12 description cursor-pointer"
                      style={{ height: "104px" }}
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
