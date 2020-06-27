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

const sliceObject = (obj, property) => {
  let newObj = { ...obj };
  delete newObj[property];
  return newObj;
};

const AdminDashboard = (props) => {
  const page = props.match.params.page;
  const user = props.user;
  const projects = user.projects;
  const section = props.match.params.section;
  const projectId = props.match.params.projectId;
  console.log("PROET ID", projectId);
  const [people, setPeople] = useState({}); //needed for mobile dashboard
  return (
    <div className="container-fluid d-flex flex-column h-100 px-0">
      <div className="row no-gutters flex-shrink-0">
        <div className="col-12">
          <Navbar></Navbar>
        </div>
      </div>
      <div className="row no-gutters flex-fill overflow-hidden" onR>
        <div className="col-auto mh-100">
          <LeftSideMenu userId={user.id}></LeftSideMenu>
        </div>
        <div className="col mh-100">
          {page === "people" ? (
            <People user={user} projects={projects} size={props.size}></People>
          ) : page === "activity" ? (
            <Activity projects={projects}></Activity>
          ) : page === "messages" ? (
            <MessagesParent user={user} size={props.size}></MessagesParent>
          ) : page === "projects" ? (
            section === "edit" ? (
              <EditProject projectId={projectId} user={user}></EditProject>
            ) : projectId ? (
              <ProjectDashboard
                projectId={projectId}
                user={user}
                section={section ? section : "files"}
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
            <CalendarsParent user={user}></CalendarsParent>
          ) : page === "new-project" ? (
            <NewProject user={user}></NewProject>
          ) : (
            ""
          )}
        </div>
      </div>
      <div
        className="row no-gutters d-flex d-md-none flex-shrink-0"
        style={{ height: "56px" }}
      >
        <div className="col-12">
          <MobileNavbar
            page={page}
            userId={user.id}
            projectId={projectId}
            people={people}
            section={section}
          ></MobileNavbar>
        </div>
      </div>
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
