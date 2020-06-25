import React, { useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import store from "../../../store/store";

const Activity = () => {
  useEffect(() => {
    store.dispatch({ type: "SET_PAGE_TITLE", pageTitle: "Activity" });
  }, []);
  return (
    <div className="row no-gutters px-2 px-sm-3 px-md-4">
      <div className="col-12">
        <VerticalTimeline animate={false} layout="1-column">
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentArrowStyle={{ borderRight: "7px solid white" }}
            date="June 22, 2020, 6:13 pm"
            iconStyle={{ background: "#1a73e8", color: "#fff" }}
            icon={
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "white",
                }}
              ></div>
            }
            position="right"
          >
            <div className="vertical-timeline-element-title">
              Client 2 completed file 5
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentArrowStyle={{ borderRight: "7px solid white" }}
            date="June 21, 2020, 4:13 am"
            iconStyle={{ background: "#1a73e8", color: "#fff" }}
            icon={
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "white",
                }}
              ></div>
            }
            position="right"
          >
            <div className="vertical-timeline-element-title">
              Client 1 created event
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentArrowStyle={{ borderRight: "7px solid white" }}
            date="June 20, 2020, 6:18 pm"
            iconStyle={{ background: "#1a73e8", color: "#fff" }}
            icon={
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "white",
                }}
              ></div>
            }
            position="right"
          >
            <div className="vertical-timeline-element-title">
              Admin 2 uploaded file
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentArrowStyle={{ borderRight: "7px solid white" }}
            date="June 20, 2020, 6:13 pm"
            iconStyle={{ background: "#1a73e8", color: "#fff" }}
            icon={
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "white",
                }}
              ></div>
            }
            position="right"
          >
            <div className="vertical-timeline-element-title">
              Admin 1 uploaded file
            </div>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default Activity;
