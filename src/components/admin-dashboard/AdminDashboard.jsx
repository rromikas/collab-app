import React, { useState } from "react";
import CalendarsParent from "./calendars/CalendarsParent";
import MessagesParent from "./messages/MessagesParent";
import Activity from "./activity/Activity";
import People from "./people/People";
import Projects from "./projects/Projects";
import LeftSideMenu from "./left-side-menu/LeftSideMenu";
import Navbar from "./navbar/Navbar";
import NewProject from "./projects/NewProject";
import ProjectDashboard from "../project-dashboard/ProjectDashboard";
import EditProject from "./projects/EditProject";
import MobileNavbar from "../project-dashboard/navbar/MobileNavbar";
import { connect } from "react-redux";
import Profile from "../profile/Profile";
import Toast from "../utility/Toast";

const sliceObject = (obj, property) => {
  let newObj = { ...obj };
  delete newObj[property];
  return newObj;
};

const AdminDashboard = (props) => {
  const page = props.match.params.page;
  const user = props.user;
  const projects = {};
  user.projects &&
    Object.values(user.projects).forEach((x) => {
      if (x.status !== "Deleted") {
        projects[x.id] = x;
      }
    });
  const section = props.match.params.section;
  const subsection = props.match.params.subsection;
  const projectId = props.match.params.projectId;
  const [people, setPeople] = useState({}); //needed for mobile dashboard
  return (
    <div className="container-fluid d-flex flex-column h-100 px-0">
      <div className="row no-gutters" style={{ flex: "0 0 auto" }}>
        <div className="col-12">
          <Navbar></Navbar>
        </div>
      </div>
      <div
        className="row no-gutters overflow-auto"
        style={{ flex: "1 1 auto" }}
      >
        {user.accountType === "admin" && (
          <div className="col-auto">
            <LeftSideMenu userId={user.id} page={page}></LeftSideMenu>
          </div>
        )}

        <div className="col">
          <div className="row no-gutters">
            <div
              className={`col-12 col-xl-${
                user.accountType === "client" ? "10" : "12"
              } mx-auto`}
            >
              {user.accountType === "admin" ? (
                page === "profile" ? (
                  <Profile user={user} projects={projects}></Profile>
                ) : page === "people" ? (
                  <People
                    user={user}
                    projects={projects}
                    size={props.size}
                  ></People>
                ) : page === "activity" ? (
                  <Activity projects={projects}></Activity>
                ) : page === "messages" ? (
                  <MessagesParent
                    user={user}
                    size={props.size}
                  ></MessagesParent>
                ) : page === "projects" ? (
                  section === "edit" ? (
                    <EditProject
                      projectId={projectId}
                      user={user}
                    ></EditProject>
                  ) : projectId ? (
                    <ProjectDashboard
                      projectId={projectId}
                      user={user}
                      section={section ? section : "files"}
                      subsection={subsection}
                      setPeople={setPeople}
                      size={props.size}
                    ></ProjectDashboard>
                  ) : (
                    <Projects
                      projects={projects}
                      userId={user.id}
                      size={props.size}
                    ></Projects>
                  )
                ) : page === "calendar" ? (
                  <CalendarsParent
                    user={user}
                    projects={projects}
                  ></CalendarsParent>
                ) : page === "new-project" ? (
                  <NewProject user={user}></NewProject>
                ) : (
                  ""
                )
              ) : page === "profile" || (page === "projects" && !projectId) ? (
                <Profile user={user} projects={projects}></Profile>
              ) : page === "projects" && projectId ? (
                <ProjectDashboard
                  projectId={projectId}
                  user={user}
                  section={section ? section : "files"}
                  subsection={subsection}
                  setPeople={setPeople}
                  size={props.size}
                ></ProjectDashboard>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileNavbar
        page={page}
        user={user}
        projectId={projectId}
        people={people}
        section={section}
      ></MobileNavbar>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    size: state.size,
    ownProps,
  };
}

export default connect(mapStateToProps)(AdminDashboard);
