import React, { useRef } from "react";
import { connect } from "react-redux";
import history from "../../../history";
import { BsChevronLeft } from "react-icons/bs";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import { BsBell } from "react-icons/bs";

const Navbar = ({ pageTitle, user, backlink }) => {
  const userPhoto = useRef(null);
  return (
    <div className="row no-gutters justify-content-between px-2 px-md-3 px-lg-4">
      <div className="col-auto mb-2">
        <div className="row no-gutters align-items-center">
          {backlink.title !== "" && (
            <div
              className="col-auto mr-2 clickable-item"
              onClick={() => history.push(`${backlink.path}`)}
            >
              <BsChevronLeft fontSize="16px"></BsChevronLeft>
              {backlink.title}
            </div>
          )}
          <div className="col-auto h2 mb-0">{pageTitle}</div>
        </div>
      </div>

      <div className="col-auto">
        <div
          className="row no-gutters"
          style={{ lineHeight: "38px", alignItems: "center" }}
        >
          <Popover
            content={
              <div className="popover-inner">
                {Object.values(user.notifications.unseen).map((x) => (
                  <div className="popover-content-item">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ))}
              </div>
            }
          >
            <div className="position-relative mx-4 navbar-icon">
              <div
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  background: "#0a80ff",
                  top: "0px",
                  right: "0px",
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                {Object.keys(user.notifications.unseen).length}
              </div>
              <BsBell fontSize="18px" strokeWidth="0.5px"></BsBell>
            </div>
          </Popover>

          <Popover
            content={
              <div className="popover-inner">
                <div
                  className="popover-content-item"
                  onClick={() => {
                    store.dispatch({
                      type: "SET_USER",
                      user: { photo: "", username: "", email: "", id: "" },
                    });
                    userPhoto.current.click();
                  }}
                >
                  Logout
                </div>
              </div>
            }
          >
            <div
              ref={userPhoto}
              className="col-auto mr-2 photo-circle-sm cursor-pointer"
              style={{
                backgroundImage: `url(${user.photo})`,
              }}
            ></div>
          </Popover>

          <div className="col">{user.email}</div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    pageTitle: state.pageTitle,
    user: state.user,
    backlink: state.backlink,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(Navbar);
