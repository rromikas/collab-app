import React from "react";
import { BsCheck } from "react-icons/bs";
const Checkbox = ({ checked, setChecked, size }) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 3}px`,
        flexShrink: 0,
      }}
      className="d-flex justify-content-center align-items-center checkbox-pro"
      onClick={() => {
        setChecked(!checked);
      }}
    >
      {checked && (
        <BsCheck strokeWidth="0.5px" fontSize={`${size - 10}px`}></BsCheck>
      )}
    </div>
  );
};

export default Checkbox;
