import React from "react";
import store from "./store/store";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import ProjectDashboard from "./components/project-dashboard/ProjectDashboard";
import Projects from "./components/admin-dashboard/projects/Projects";
import {
  BsGrid,
  BsCalendar,
  BsChatDots,
  BsPeople,
  BsGraphUp,
} from "react-icons/bs";
import Calendars from "./components/admin-dashboard/calendars/Calendars";
import Activity from "./components/admin-dashboard/activity/Activity";

const LeftSideMenu = () => {
  const items = [
    { name: "Projects", icon: <BsGrid fontSize="24px"></BsGrid> },
    { name: "Calendar", icon: <BsCalendar fontSize="24px"></BsCalendar> },
    { name: "Messages", icon: <BsChatDots fontSize="24px"></BsChatDots> },
    { name: "People", icon: <BsPeople fontSize="24px"></BsPeople> },
    { name: "Activity", icon: <BsGraphUp fontSize="24px"></BsGraphUp> },
  ];
  return (
    <div className="row no-gutters pr-2 pr-sm-3 pr-md-4">
      <div className="col-12">
        {items.map((x) => (
          <div className="row no-gutters w-100">
            <div
              className="d-flex menu-item"
              onClick={() => history.push(`/${x.name.toLowerCase()}`)}
            >
              <div
                className="text-center mr-0 mr-sm-3"
                style={{ width: "40px" }}
              >
                {x.icon}
              </div>
              <div className="pr-4 d-none d-sm-block">{x.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MainPage = () => {
  return <div className="row no-gutters"></div>;
};

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="container-fluid p-2 p-sm-3 p-md-4">
          <div className="row no-gutters">
            <div className="col-auto">
              <LeftSideMenu></LeftSideMenu>
            </div>
            <div className="col">
              <Switch>
                <Route exact path="/" component={Projects}></Route>
                <Route exact path="/projects" component={Projects}></Route>
                <Route exact path="/calendar" component={Calendars}></Route>
                <Route exact path="/activity" component={Activity}></Route>
                <Route
                  exact
                  path="/:userId/projects/:projectId"
                  component={ProjectDashboard}
                ></Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
