import React, { useEffect, useState, useRef } from "react";
import store from "../../../store/store";
import NoPeople from "../../../pictures/NoPeople";
import Popover from "../../utility/Popover";
import * as firebase from "../../../database/firebase";
import md5 from "md5";
import { BsFillReplyFill } from "react-icons/bs";
import uniqid from "uniqid";
import Checkbox from "../../utility/Checkbox";
import { BsChevronDown } from "react-icons/bs";

const sendInvitation = (invitation, user) => {
  let id = uniqid("invitation-");
  let updates = {};
  updates[
    `projects/${invitation.project.id}/people/${md5(invitation.toWhom)}`
  ] = { status: "invited", email: invitation.toWhom };
  updates[`users/${md5(invitation.toWhom)}/notifications/unseen/${id}`] = {
    permissions: invitation.permissions,
    photo: user.photo,
    text: `${user.username} invited you to the project "${invitation.project.title}"`,
    type: "invitation",
    project: invitation.project,
    id: id,
    date: new Date(Date.now()),
  };
  firebase.UpdateDatabase(updates);
};

const People = ({ projects, user, size }) => {
  const blockHeight =
    size.width > 768
      ? size.height - 48 - 24 - 62.4
      : size.height - 62.4 - 56 - 48;
  const runningProjects = Object.values(projects).filter(
    (x) => x.status !== "Deleted"
  );
  const [invitation, setInvitation] = useState({
    who: "",
    toWhom: "",
    permissions: "",
    project: { title: "Select project", description: "", id: "" },
  });
  const [projectId, setProjectId] = useState(
    runningProjects.length > 0 ? runningProjects[0].id : -1
  );
  const [problem, setProblem] = useState("");
  const projectChooser = useRef(null);
  const peopleProjectChooser = useRef(null);
  const invitationMaker = useRef(null);
  const [people, setPeople] = useState({});
  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "People" });
  }, []);

  useEffect(() => {
    if (projectId !== -1) {
      firebase.on(`projects/${projectId}/people`, (data) => {
        data = data ? data : {};
        setPeople(data);
      });
    }
    return function cleanUp() {
      if (projectId !== -1) {
        firebase.off(`projects/${projectId}/people`);
      }
    };
  }, [projectId]);

  return (
    <div className="row no-gutters px-2 px-sm-3 px-md-4">
      <Popover
        content={
          <div className="row no-gutters" style={{ maxWidth: "200px" }}>
            <div className="mb-1 col-12">Invite by email</div>
            <input
              className="d-block mb-1 col-12"
              type="text"
              placeholder="Type email"
              value={invitation.toWhom}
              onChange={(e) => {
                e.persist();
                setInvitation((inv) =>
                  Object.assign({}, inv, { toWhom: e.target.value })
                );
              }}
            ></input>
            <div className="col-12">
              <Popover
                position="right"
                content={
                  <div className="popover-inner">
                    {runningProjects.map((x) => (
                      <div
                        className="popover-content-item col-12"
                        onClick={() => {
                          setInvitation((inv) =>
                            Object.assign({}, inv, { project: x })
                          );
                          projectChooser.current.click();
                        }}
                      >
                        {x.title}
                      </div>
                    ))}
                  </div>
                }
              >
                <div
                  className="btn mb-2 mx-auto text-truncate"
                  ref={projectChooser}
                >
                  {invitation.project.title.length > 20
                    ? invitation.project.title.substring(0, 20) + "..."
                    : invitation.project.title}
                </div>
              </Popover>
            </div>
            <div className="mb-1 col-12">
              <label>Permissions</label>
            </div>
            <div className="col-12 mb-3">
              <div className="row no-gutters mb-1">
                <div className="col-auto mr-2">
                  <Checkbox
                    size={25}
                    checked={invitation.permissions === "owner"}
                    setChecked={(checked) => {
                      setInvitation((inv) =>
                        Object.assign({}, inv, {
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
                    checked={invitation.permissions === "client"}
                    setChecked={(checked) => {
                      setInvitation((inv) =>
                        Object.assign({}, inv, {
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
              {problem === "no permissions selected" ? (
                <label style={{ color: "red" }}>permissions required</label>
              ) : problem === "wrong email" ? (
                <label style={{ color: "red" }}>email required</label>
              ) : problem === "no project selected" ? (
                <label style={{ color: "red" }}>permissions required</label>
              ) : (
                ""
              )}
            </div>

            <div
              className="btn-pro mb-1 col-6"
              onClick={() => {
                if (!invitation.toWhom) {
                  setProblem("wrong email");
                } else {
                  if (invitation.project.title === "Select project") {
                    setProblem("no project selected");
                  } else {
                    if (invitation.permissions === "") {
                      setProblem("no permissions selected");
                    } else {
                      sendInvitation(invitation, user);
                      invitationMaker.current.click();
                    }
                  }
                }
              }}
            >
              Send
            </div>
            <div
              className="btn col-6"
              onClick={() => invitationMaker.current.click()}
            >
              Cancel
            </div>
          </div>
        }
      >
        <div className="col-auto btn-pro my-2 mr-2 ml-3" ref={invitationMaker}>
          Invite people
        </div>
      </Popover>

      <Popover
        content={
          <div className="popover-inner">
            {runningProjects.map((x) => (
              <div
                className="popover-content-item"
                onClick={() => {
                  setProjectId(x.id);
                  peopleProjectChooser.current.click();
                }}
              >
                {x.title}
              </div>
            ))}
          </div>
        }
      >
        <div
          className="col-auto btn d-flex align-items-center my-2"
          ref={peopleProjectChooser}
        >
          <div className="mr-2 text-truncate" style={{ maxWidth: "160px" }}>
            {projectId !== -1 && projects[projectId]
              ? `people of "${projects[projectId].title}"`
              : "No projects"}
          </div>

          <BsChevronDown fontSize="14px"></BsChevronDown>
        </div>
      </Popover>

      <div className="col-12">
        <div
          className="row no-gutters overflow-auto p-3"
          style={{ height: `${blockHeight}px` }}
        >
          {Object.values(people).length > 0 ? (
            <div className="col-12 mt-2">
              {Object.values(people).map((x) => (
                <div className="row no-gutters p-3 align-items-center clickable-item basic-card mb-3 people-list-item">
                  {x.status === "invited" && (
                    <React.Fragment>
                      <div className="col-auto mr-2">
                        <BsFillReplyFill fontSize="18px"></BsFillReplyFill>
                      </div>
                      <div className="col-auto mr-2">Invitation sent to</div>
                    </React.Fragment>
                  )}
                  {x.photo && (
                    <div
                      className="col-auto mr-2 photo-circle-sm"
                      style={{
                        backgroundImage: `url(${x.photo})`,
                      }}
                    ></div>
                  )}

                  <div className="col-auto">{x.email}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-12">
              <div
                className="row no-gutters align-items-center justify-content-center"
                style={{ height: "600px" }}
              >
                <div className="col-12 col-sm-10 col-md-9 col-lg-7">
                  <NoPeople></NoPeople>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default People;
