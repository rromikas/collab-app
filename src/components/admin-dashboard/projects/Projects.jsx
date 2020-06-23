import React from "react";
import { BsThreeDots, BsStarFill } from "react-icons/bs";
import Popover from "../../utility/Popover";

const Projects = () => {
  const projects = [
    {
      title: "Bridge on the hudson river",
      for: "Owner company",
      description:
        "BRIDGE addresses the urgent urban challenge of better aligning young people’s educational choices with future labour market needs.",
    },
    {
      title: "Bridge on the hudson river",
      for: "Owner company",
      description:
        "BRIDGE addresses the urgent urban challenge of better aligning young people’s educational choices with future labour market needs.",
    },
    {
      title: "Bridge on the hudson river",
      for: "Owner company",
      description:
        "BRIDGE addresses the urgent urban challenge of better aligning young people’s educational choices with future labour market needs.",
    },
    {
      title: "Bridge on the hudson river",
      for: "Owner company",
      description:
        "BRIDGE addresses the urgent urban challenge of better aligning young people’s educational choices with future labour market needs.",
    },
    {
      title: "Bridge on the hudson river",
      for: "Owner company",
      description:
        "BRIDGE addresses the urgent urban challenge of better aligning young people’s educational choices with future labour market needs.",
    },
  ];

  const editOptions = ["edit", "complete"];

  return (
    <div className="row no-gutters px-2 px-sm-3 px-md-4">
      <div className="col-12 h2">Projects</div>
      <div className="col-12">
        <div className="row">
          {projects.map((x) => (
            <div
              className="col-lg-3 col-md-6 col-sm-12 p-2 p-sm-3"
              style={{ minWidth: "250px" }}
            >
              <div className="row no-gutters bg-white p-4 project-card">
                <div className="col-12">
                  <div className="row no-gutters">
                    <div className="col pr-2">
                      <div className="row no-gutters title">{x.title}</div>
                      <div className="row no-gutters for-company">
                        <div style={{ fontWeight: "500" }} className="pr-1">
                          for
                        </div>
                        <div>{x.for}</div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="row no-gutters">
                        <Popover
                          delay={500}
                          theme="dark"
                          trigger="mouseenter"
                          position="top"
                          content={
                            <div className="popover-inner-dark">
                              star/unstar
                            </div>
                          }
                        >
                          <BsStarFill
                            fontSize="20px"
                            className="hoverable-gray"
                          ></BsStarFill>
                        </Popover>
                      </div>
                      <div className="row no-gutters">
                        <Popover
                          content={
                            <div className="popover-inner">
                              {editOptions.map((x) => (
                                <div className="popover-content-item">{x}</div>
                              ))}
                              <hr></hr>
                              <div className="popover-content-item">
                                move to trash
                              </div>
                            </div>
                          }
                        >
                          <BsThreeDots
                            fontSize="20px"
                            className="hoverable-gray"
                          ></BsThreeDots>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 description">{x.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
