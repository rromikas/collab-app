import React, { useEffect } from "react";
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
  onHide = () => {},
  ...rest
}) => {
  useEffect(() => {
    return function cleanUp() {
      let popovers = document.getElementsByClassName("tippy-popper");
      for (let i = 0; i < popovers.length; i++) {
        popovers[i].parentNode.removeChild(popovers[i]);
      }
    };
  }, []);
  return (
    <Tooltip
      onHide={onHide}
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
      unmountHTMLWhenHide={true}
    >
      {rest.children}
    </Tooltip>
  );
};

export default Popover;
