import React, { useState } from "react";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";

const Popover = ({
  position = "bottom",
  theme = "light",
  content,
  trigger = "click",
  delay = 0,
  animation = "scale",
  open = undefined,
  ...rest
}) => {
  return (
    <Tooltip
      delay={delay}
      hideDelay={0}
      html={content}
      position={position}
      trigger={trigger}
      theme={theme}
      arrow={true}
      interactive={true}
      animation={animation}
      open={open}
    >
      {rest.children}
    </Tooltip>
  );
};

export default Popover;
