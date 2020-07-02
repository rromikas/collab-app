import { createStore, combineReducers } from "redux";

function userReducer(
  state = {
    id: "",
    username: "",
    photo: "",
    description: "",
    email: "",
    messages: {},
    events: {},
    people: {},
    projects: {},
    notifications: { seen: {}, unseen: {} },
  },
  action
) {
  switch (action.type) {
    case "SET_USER":
      return Object.assign({}, state, action.user);
    default:
      return state;
  }
}

function sizeReducer(
  state = { width: window.innerWidth, height: window.innerHeight },
  action
) {
  switch (action.type) {
    case "SET_SIZE":
      return action.size;
    default:
      return state;
  }
}

function pageTitleReducer(state = "Home", action) {
  switch (action.type) {
    case "SET_PAGE_TITLE":
      return action.pageTitle;
    default:
      return state;
  }
}

function backlinkReducer(state = { title: "", path: "" }, action) {
  switch (action.type) {
    case "SET_BACKLINK":
      return action.backlink;
    default:
      return state;
  }
}

function calendarDateReducer(state = new Date(), action) {
  switch (action.type) {
    case "SET_CALENDAR_DATE":
      return action.calendarDate;
    default:
      return state;
  }
}
const rootReducer = combineReducers({
  user: userReducer,
  pageTitle: pageTitleReducer,
  backlink: backlinkReducer,
  size: sizeReducer,
  calendarDate: calendarDateReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
