import React from "react";
import DotLoader from "react-spinners/DotLoader";
const Loader = ({ loading, size = 60 }) => {
  return (
    <DotLoader size={size} color={"#0a80ff"} loading={loading}></DotLoader>
  );
};

export default Loader;
