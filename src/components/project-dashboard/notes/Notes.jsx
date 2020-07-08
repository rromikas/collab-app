import React, { useState, useRef } from "react";
import { uid } from "react-uid";
import date from "date-and-time";
import Popover from "../../utility/Popover";
import { AddNote } from "../../../database/api";
import uniqid from "uniqid";
import { BsJustify, BsGrid } from "react-icons/bs";
import { connect } from "react-redux";

const Notes = ({ size, notes, projectId, user, users }) => {
  const containerMinHeight =
    size.width > 768 ? size.height - 76 - 56 - 24 : size.height - 76 - 56;
  const [newNote, setNewNote] = useState({
    id: uniqid("note-"),
    user_id: user.id,
    text: "",
  });
  const [structure, setStructure] = useState("list");
  const noteMaker = useRef(null);
  return (
    <div
      className="row no-gutters position-relative px-3 px-md-4 py-3 bg-light"
      style={{ minHeight: `${containerMinHeight}px` }}
    >
      <div className="col-12">
        <div className="row no-gutters">
          <div className="col-12">
            <div className="row no-gutters justify-content-between px-2">
              <Popover
                content={
                  <div className="popover-inner">
                    <div className="mb-2">Add a note</div>
                    <textarea
                      value={newNote.text}
                      onChange={(e) => {
                        e.persist();
                        setNewNote((prev) =>
                          Object.assign({}, prev, { text: e.target.value })
                        );
                      }}
                      style={{ height: "150px", minWidth: "350px" }}
                    ></textarea>
                    <div className="d-flex jsutify-content-center">
                      <div
                        className="btn-pro mr-1"
                        onClick={() => {
                          AddNote(newNote, projectId);
                          setNewNote((n) =>
                            Object.assign({}, n, {
                              id: uniqid("note-"),
                              text: "",
                            })
                          );
                          noteMaker.current.click();
                        }}
                      >
                        Add note
                      </div>
                      <div
                        className="btn"
                        onClick={() => {
                          noteMaker.current.click();
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="btn-pro" ref={noteMaker}>
                  Add note
                </div>
              </Popover>
              <div className="col-auto d-none d-lg-block">
                <div className="row no-gutters">
                  <div
                    className="col-auto mr-2"
                    onClick={() => setStructure("list")}
                  >
                    <BsJustify
                      color={structure === "list" ? "#0a80ff" : "inherit"}
                      fontSize="18px"
                      className="clickable-item"
                      strokeWidth="0.5px"
                    ></BsJustify>
                  </div>
                  <div
                    className="col-auto"
                    onClick={() => setStructure("grid")}
                  >
                    <BsGrid
                      color={structure === "grid" ? "#0a80ff" : "inherit"}
                      strokeWidth="0.5px"
                      fontSize="18px"
                      className="clickable-item"
                    ></BsGrid>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters">
          {Object.values(notes)
            .reverse()
            .map((x) => (
              <div
                key={uniqid("note-")}
                className={`col-12 col-lg-${
                  structure === "list" ? "12" : "6"
                } col-xl-${structure === "list" ? "12" : "4"}`}
              >
                <div
                  key={uid(x)}
                  className={`row no-gutters p-4 m-${
                    structure === "list" ? "2" : "3"
                  } basic-card`}
                >
                  <div
                    className="col-auto mr-2 bg-image square-50"
                    style={{
                      backgroundImage: `url(${users[x.user_id].photo})`,
                    }}
                  ></div>
                  <div className="col">
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto mr-3 alt-chat-author">
                        {users[x.user_id].username}
                      </div>
                      <div className="col-auto alt-chat-date">
                        {x.date
                          ? date.format(new Date(x.date), "DD MMM, YYYY")
                          : ""}
                      </div>
                    </div>
                    <div
                      className="row no-gutters alt-chat-message overflow-auto"
                      style={{
                        height: structure === "grid" ? "190px" : "auto",
                      }}
                    >
                      {x.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    users: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(Notes);
