import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { BsCircle } from "react-icons/bs";

const Activity = () => {
  return (
    <div className="row no-gutters px-2 px-sm-3 px-md-4">
      <div className="col-12 h2">Activity</div>
      <div className="col-12">
        <VerticalTimeline animate={false} layout="1-column">
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date="June 22, 2020, 6:13 pm"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<BsCircle fontSize="24px" />}
            position="right"
          >
            <div className="vertical-timeline-element-title">
              Client 2 completed file 5
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date="June 21, 2020, 4:13 am"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<BsCircle fontSize="24px" />}
            position="right"
          >
            <div className="vertical-timeline-element-title">
              Client 1 created event
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date="June 20, 2020, 6:18 pm"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<BsCircle fontSize="24px" />}
            position="right"
          >
            <div className="vertical-timeline-element-title">
              Admin 2 uploaded file
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date="June 20, 2020, 6:13 pm"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<BsCircle fontSize="24px" />}
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
