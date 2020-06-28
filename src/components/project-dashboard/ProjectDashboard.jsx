import React, { useEffect, useState } from "react";
import Navbar from "./navbar/Navbar";
import MobileNavbar from "./navbar/MobileNavbar";
import store from "../../store/store";
import * as firebase from "../../database/firebase";
import Calendar from "./calendar/Calendar";
import Files from "./files/Files";
import Messages from "./messages/Messages";
import Times from "./times/Times";
import AltChat from "./messages/AltChat";
import TuiCalendar from "./calendar/TuiCalendar";

const ProjectDashboard = ({ projectId, user, section, setPeople, size }) => {
  const [page, setPage] = useState("");
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
      if (data) {
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
      setProject(data);
      if (data.people) {
        setPeople(data.people);
      }
    });

    return function cleanUp() {
      firebase.off(`projects/${projectId}`);
    };
  }, [projectId]);

  useEffect(() => {
    setPage(section);
  }, [section]);

  return (
    <div className="row no-gutters px-0 py-0 pb-md-4 px-md-4 mh-100">
      <div className="col-12 collab-project bg-white mh-100 project-card-corners">
        <Navbar
          projectId={projectId}
          page={page}
          userId={user.id}
          people={project.people}
        ></Navbar>
        {page === "calendar" ? (
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
        page === "files" ? (
          <Files
            size={size}
            projectId={projectId}
            user={user}
            files={project.files}
            setProject={setProject}
          ></Files>
        ) : page === "messages" ? (
          <AltChat projectId={projectId} user={user} size={size}></AltChat>
        ) : page === "time" ? (
          <Times
            user={user}
            projectId={projectId}
            times={project.times}
          ></Times>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
