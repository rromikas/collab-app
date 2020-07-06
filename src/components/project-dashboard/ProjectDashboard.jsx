import React, { useEffect, useState } from "react";
import Navbar from "./navbar/Navbar";
import store from "../../store/store";
import * as firebase from "../../database/firebase";
import Calendar from "./calendar/Calendar";
import Files from "./files/Files";
import Times from "./times/Times";
import AltChat from "./messages/AltChat";
import Requests from "./requests/Requests";
import NewRequest from "./requests/NewRequest";
import Request from "./requests/Request";
import Notes from "./notes/Notes";

const ProjectDashboard = ({
  projectId,
  user,
  section,
  subsection,
  setPeople,
  size,
}) => {
  const [project, setProject] = useState({
    events: {},
    messages: {},
    times: {},
    files: {},
    people: {},
  });
  useEffect(() => {
    store.dispatch({
      type: "SET_BACKLINK",
      backlink: {
        title: user.accountType === "admin" ? "Projects" : "Profile",
        path: `/${user.id}/projects`,
      },
    });

    firebase.GetFromDatabase(`projects/${projectId}`).then((data) => {
      if (data && data.title) {
        store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: data.title });
        setProject((pr) => Object.assign({}, pr, data));
      }
    });

    return function cleanup() {
      store.dispatch({
        type: "SET_BACKLINK",
        backlink: { title: "", path: "" },
      });
    };
  }, []);

  useEffect(() => {
    firebase.on(`projects/${projectId}`, (data) => {
      if (data) {
        setProject(data);
        if (data.people) {
          setPeople(data.people);
        }
      }
    });

    return function cleanUp() {
      firebase.off(`projects/${projectId}`);
    };
  }, [projectId]);

  return (
    <div className="row no-gutters px-0 py-0 pb-md-4 px-md-4 h-100">
      <div className="col-12 collab-project bg-white mh-100 project-card-corners">
        <Navbar
          projectId={projectId}
          page={section}
          userId={user.id}
          people={project.people ? project.people : {}}
        ></Navbar>
        {section === "calendar" ? (
          <Calendar
            people={project.people ? project.people : {}}
            projectId={projectId}
            events={project.events}
            addEvent={(ev) => {
              let events = { ...project.events };
              let newEvents = Object.assign({}, events, { [ev.id]: ev });
              setProject((pr) => Object.assign({}, pr, { events: newEvents }));
            }}
          ></Calendar>
        ) : // <TuiCalendar events={project.events}></TuiCalendar>
        section === "files" ? (
          <Files
            size={size}
            projectId={projectId}
            user={user}
            setProject={setProject}
            metadata={project.files ? project.files : {}}
          ></Files>
        ) : section === "notes" ? (
          <Notes
            size={size}
            notes={project.notes ? project.notes : {}}
            projectId={projectId}
            user={user}
          ></Notes>
        ) : section === "messages" ? (
          <AltChat projectId={projectId} user={user} size={size}></AltChat>
        ) : section === "time" ? (
          <Times
            size={size}
            user={user}
            projectId={projectId}
            times={project.times}
            people={project.people ? project.people : {}}
          ></Times>
        ) : section === "requests" ? (
          subsection ? (
            subsection === "new" ? (
              <NewRequest
                projectId={projectId}
                user={user}
                people={project.people ? project.people : {}}
              ></NewRequest>
            ) : (
              <Request
                requestId={subsection}
                projectId={projectId}
                user={user}
              ></Request>
            )
          ) : (
            <Requests user={user} projectId={projectId} size={size}></Requests>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
