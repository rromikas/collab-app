import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaCheck, FaCamera } from "react-icons/fa";
import PhotoUploader from "./PhotoUploader";
import history from "../../history";
import store from "../../store/store";
import date from "date-and-time";

const initialProfile = {
  name: "",
  photo: "",
  description: "",
  summaries: [],
  favoriteBooks: [],
};

const Profile = ({ user }) => {
  const hiddenUploader = useRef(null);
  const [editIntro, setEditIntro] = useState(false);

  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Profile" });
  }, []);

  return (
    <div className="row no-gutters justify-content-center">
      <div className="col-12 col-sm-5 col-md-4 col-lg-3 p-3">
        <div className="row no-gutters justify-content-center project-card p-4 bg-white">
          <div className="col-12">
            <div
              className="bg-image mx-auto"
              style={{
                width: "120px",
                height: "120px",
                background: "white",
                overflow: "hidden",
                position: "relative",
                backgroundImage:
                  user.photo !== "" ? `url(${user.photo})` : "unset",
              }}
            >
              <div
                className="w-100 d-flex justify-content-center img-uploader align-items-center pointer"
                onClick={() => hiddenUploader.current.click()}
              >
                <FaCamera fontSize="20px" color="white"></FaCamera>
                <PhotoUploader
                  domRef={hiddenUploader}
                  onUpload={(photo) => {
                    store.dispatch({
                      type: "SET_USER",
                      user: {
                        photo: photo,
                      },
                    });
                  }}
                ></PhotoUploader>
              </div>
            </div>
          </div>
          <div className="col-12 mx-2 ml-md-3 mr-md-3">
            <div className="text-center mt-3 h1" style={{ color: "white" }}>
              {user.name}
            </div>
          </div>
          <div className="col-12 text-center mb-2">
            <input placeholder="name" type="text" className="w-100"></input>
          </div>
          <div className="col-12 text-center mb-2">
            <input placeholder="surname" type="text" className="w-100"></input>
          </div>
          <div className="col-12 text-center mb-2">
            <input
              placeholder="phone number"
              type="text"
              className="w-100"
            ></input>
          </div>
          <div className="col-12 text-center mb-2">
            <input placeholder="location" type="text" className="w-100"></input>
          </div>
          <div className="col-12 text-center mb-2">
            <input placeholder="website" type="text" className="w-100"></input>
          </div>
          <div
            className="mt-3 col-auto mx-auto btn-pro"
            onClick={() => {
              store.dispatch({
                type: "SET_USER",
                user: { email: "", _id: "", photo: "", name: "" },
              });
              localStorage["secret_token"] = "";
              history.push("/");
            }}
          >
            Logout
          </div>
        </div>
      </div>
      <div className="col-12 col-md-8 p-3">
        {Object.values(user.projects).map((x) => (
          <div className="row no-gutters project-card p-4 bg-white mb-3">
            <div className="col">
              <label>Title</label>
              <div className="mb-3 text-truncate">{x.title}</div>
              <label>Description</label>
              <div className="mb-3">{x.description}</div>
              <label>Creator</label>
              <div className="row no-gutters w-100 mb-3 align-items-center">
                <div
                  className="col-auto bg-image mr-2"
                  style={{
                    height: "40px",
                    width: "40px",
                    backgroundImage: `url(${x.creator.photo})`,
                  }}
                ></div>
                <div className="col">{x.creator.username}</div>
              </div>
              <label>Date</label>
              <div className="mb-3">
                {date.format(new Date(x.date), "DD MMM, YYYY")}
              </div>
            </div>
            <div className="col-auto">
              <div className="row no-gutters">
                <div
                  className="col-auto btn-pro"
                  onClick={() => history.push(`/${user.id}/projects/${x.id}`)}
                >
                  Go to project page
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
