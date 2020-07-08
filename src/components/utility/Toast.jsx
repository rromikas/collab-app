import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import store from "../../store/store";
import { BsCheck, BsExclamation, BsX } from "react-icons/bs";

const Toast = ({ notification }) => {
  const [hovered, setHovered] = useState(false);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    let timeout;
    if (!notification.expired) {
      timeout = setTimeout(() => {
        setExpired(true);
      }, 5000);
    }

    return function cleanUp() {
      if (!notification.expired && timeout) {
        clearTimeout(timeout);
      }
    };
  }, [notification]);

  useEffect(() => {
    if (expired && !hovered) {
      store.dispatch({
        type: "UPDATE_NOTIFICATION",
        notification: { expired: true },
      });
      setExpired(false);
    }
  }, [expired, hovered]);

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="container-fluid toast-pro bg-white px-0"
      style={{
        maxWidth: "300px",
        visibility: notification.expired ? "hidden" : "visible",
        opacity: notification.expired ? "0" : "1",
      }}
    >
      <div className="row no-gutters p-3">
        {notification.type && (
          <div className="col-auto pr-2">
            {notification.type === "success" ? (
              <BsCheck
                strokeWidth="1px"
                fontSize="24px"
                className="text-success"
              ></BsCheck>
            ) : (
              <BsExclamation
                strokeWidth="1px"
                fontSize="24px"
                className="text-primary"
              ></BsExclamation>
            )}
          </div>
        )}
        <div className="col pr-2 toast-title">{notification.title}</div>
        <div
          className="col-auto toast-close-icon"
          onClick={() =>
            store.dispatch({
              type: "UPDATE_NOTIFICATION",
              notification: { expired: true },
            })
          }
        >
          <BsX fontSize="24px"></BsX>
        </div>
      </div>

      <div className="row no-gutters p-3">{notification.message}</div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    notification: state.notification,
    ...ownProps,
  };
}

export default connect(mapp)(Toast);
