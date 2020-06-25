import React from "react";
import Calendars from "./calendars/Calendars";
import Messages from "./messages/Messages";
import Activity from "./activity/Activity";
import People from "./people/People";
import Projects from "./projects/Projects";
import LeftSideMenu from "./left-side-menu/LeftSideMenu";
import Navbar from "./navbar/Navbar";
import NewProject from "./projects/NewProject";
import ProjectDashboard from "../project-dashboard/ProjectDashboard";
import EditProject from "./projects/EditProject";

const AdminDashboard = (props) => {
  const page = props.match.params.page;
  const user = props.user;
  const section = props.match.params.section;
  const projectId = props.match.params.projectId;
  return (
    <div className="container-fluid p-2 p-md-3 p-lg-4">
      <div className="row no-gutters">
        <div className="col-auto">
          <LeftSideMenu userId={user.id}></LeftSideMenu>
        </div>
        <div className="col">
          <Navbar></Navbar>
          {page === "people" ? (
            <People user={user} projects={user.projects}></People>
          ) : page === "activity" ? (
            <Activity projects={user.projects}></Activity>
          ) : page === "messages" ? (
            <Messages messages={user.messages}></Messages>
          ) : page === "projects" ? (
            section === "edit" ? (
              <EditProject projectId={projectId} user={user}></EditProject>
            ) : projectId ? (
              <ProjectDashboard
                projectId={projectId}
                user={user}
                section={section ? section : "files"}
              ></ProjectDashboard>
            ) : (
              <Projects projects={user.projects} userId={user.id}></Projects>
            )
          ) : page === "calendar" ? (
            <Calendars projects={user.projects}></Calendars>
          ) : page === "new-project" ? (
            <NewProject user={user}></NewProject>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;