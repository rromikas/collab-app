import React, { useEffect, useState, useRef } from "react";
import store from "../../../store/store";
import NoPeople from "../../../pictures/NoPeople";
import Popover from "../../utility/Popover";
import * as firebase from "../../../database/firebase";
import md5 from "md5";
import { BsFillReplyFill } from "react-icons/bs";
import uniqid, { time } from "uniqid";
import Checkbox from "../../utility/Checkbox";
import { BsChevronDown } from "react-icons/bs";
import { uid } from "react-uid";

const sendInvitation = (invitation, user) => {
  let id = uniqid("notification-");
  let updates = {};
  updates[
    `projects/${invitation.project.id}/people/${md5(invitation.toWhom)}`
  ] = { status: "invited", email: invitation.toWhom };
  updates[`users/${md5(invitation.toWhom)}/notifications/${id}`] = {
    permissions: invitation.permissions,
    photo: user.photo,
    status: "asked",
    text: `${user.username} invited you to the project "${invitation.project.title}"`,
    type: "invitation",
    project: invitation.project,
    id: id,
    date: new Date(Date.now()),
    seen: false,
  };
  firebase.UpdateDatabase(updates);
};

const People = ({ projects, user, size }) => {
  const blockHeight =
    size.width > 768 ? size.height - 48 - 24 - 76 : size.height - 76 - 56 - 48;
  const runningProjects = Object.values(projects).filter(
    (x) => x.status !== "Deleted"
  );
  const [invitation, setInvitation] = useState({
    who: "",
    toWhom: "",
    permissions: "",
    project: { title: "Select project", description: "", id: "" },
  });
  const [projectId, setProjectId] = useState("all");
  const [tick, setTick] = useState(false);
  const [problem, setProblem] = useState("");
  const projectChooser = useRef(null);
  const peopleProjectChooser = useRef(null);
  const invitationMaker = useRef(null);
  const [people, setPeople] = useState({});
  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "People" });
  }, []);

  useEffect(() => {
    if (projectId !== "all") {
      firebase.on(`projects/${projectId}/people`, (data) => {
        let allPeople = {};
        allPeople[projectId] = data ? data : {};
        setPeople(allPeople);
      });
    } else {
      async function fetchPeople() {
        let allPeople = { 1: { [user.id]: user } };
        await Promise.all(
          Object.values(projects).map(async (x) => {
            let data = await firebase.GetFromDatabase(
              `projects/${x.id}/people`
            );
            data = data ? data : {};
            delete data[user.id];
            allPeople[x.id] = data;
          })
        );

        setPeople(allPeople);
      }
      fetchPeople();
    }
    return function cleanUp() {
      if (projectId !== "all") {
        firebase.off(`projects/${projectId}/people`);
      }
    };
  }, [projectId, tick]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setTick(!tick);
    }, 5000);

    return function cleanUp() {
      clearTimeout(timeout);
    };
  }, [tick]);

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
                        key={uid(x)}
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
                <label style={{ color: "red" }}>select project</label>
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
            <div
              className="popover-content-item"
              onClick={() => {
                setProjectId("all");
                peopleProjectChooser.current.click();
              }}
            >
              All
            </div>
            {runningProjects.map((x) => (
              <div
                key={uid(x)}
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
            {projects[projectId] ? projects[projectId].title : projectId}
          </div>

          <BsChevronDown fontSize="14px"></BsChevronDown>
        </div>
      </Popover>

      <div className="col-12">
        <div
          className="row no-gutters overflow-auto p-3"
          style={{ height: `${blockHeight}px` }}
        >
          {Object.keys(people).length > 0 ? (
            <div className="col-12 mt-2">
              {Object.keys(people).map((x) =>
                Object.values(people[x]).map((y) => (
                  <div
                    key={uid(y)}
                    className="row no-gutters p-3 align-items-center clickable-item basic-card mb-3 people-list-item"
                  >
                    {y.status === "invited" && (
                      <React.Fragment>
                        <div className="col-auto mr-2">
                          <BsFillReplyFill fontSize="18px"></BsFillReplyFill>
                        </div>
                        <div className="col-auto mr-2">Invitation sent to</div>
                      </React.Fragment>
                    )}
                    {y.photo && (
                      <div
                        className="col-auto mr-2 photo-circle-sm"
                        style={{
                          backgroundImage: `url(${y.photo})`,
                        }}
                      ></div>
                    )}

                    <div className="col-auto">
                      {y.email} / {x === "1" ? "All" : projects[x].title}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="col-12">
              <div className="row no-gutters align-items-center justify-content-center h-100">
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
