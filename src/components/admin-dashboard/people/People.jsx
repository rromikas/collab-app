import React, { useEffect, useState, useRef } from "react";
import store from "../../../store/store";
import NoPeople from "../../../pictures/NoPeople";
import Popover from "../../utility/Popover";
import * as firebase from "../../../database/firebase";
import md5 from "md5";
import { BsFillReplyFill } from "react-icons/bs";
import uniqid from "uniqid";

const sendInvitation = (invitation, user) => {
  let id = uniqid("invitation-");
  let updates = {};
  updates[
    `projects/${invitation.project.id}/people/${md5(invitation.toWhom)}`
  ] = { status: "invited", email: invitation.toWhom };
  updates[`users/${md5(invitation.toWhom)}/notifications/unseen/${id}`] = {
    photo: user.photo,
    text: `${user.username} invited you to the project "${invitation.project.title}"`,
    type: "invitation",
    project: invitation.project,
    id: id,
    date: new Date(Date.now()),
  };
  firebase.UpdateDatabase(updates);
};

const People = ({ projects, user }) => {
  const [invitation, setInvitation] = useState({
    who: "",
    toWhom: "",
    project: { title: "Select project", description: "", id: "" },
  });
  const [projectId, setProjectId] = useState(
    Object.keys(projects).length > 0 ? Object.keys(projects)[0] : -1
  );
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
          <div>
            <div className="mb-1">Invite by email</div>
            <input
              className="d-block mb-1"
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
            <Popover
              position="right"
              content={
                <div className="popover-inner">
                  {Object.values(projects).map((x) => (
                    <div
                      className="popover-content-item"
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
              <div className="btn mb-3 w-100" ref={projectChooser}>
                {invitation.project.title}
              </div>
            </Popover>
            <div
              className="btn-pro mb-1 w-100"
              onClick={() => sendInvitation(invitation, user)}
            >
              Send
            </div>
            <div
              className="btn w-100"
              onClick={() => invitationMaker.current.click()}
            >
              Cancel
            </div>
          </div>
        }
      >
        <div className="col-auto btn-pro mb-2 mr-2" ref={invitationMaker}>
          Invite people
        </div>
      </Popover>

      <Popover
        content={
          <div className="popover-inner">
            {Object.values(projects).map((x) => (
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
        <div className="col-auto btn" ref={peopleProjectChooser}>
          {projectId !== -1 && projects[projectId]
            ? `people of "${projects[projectId].title}"`
            : "No projects"}
        </div>
      </Popover>
      {Object.values(people).length > 0 ? (
        <div className="col-12">
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
  );
};

export default People;
