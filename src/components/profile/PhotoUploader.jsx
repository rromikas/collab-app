import React from "react";

const PhotoUploader = ({ domRef, onUpload }) => {
  return (
    <input
      ref={domRef}
      style={{ display: "none" }}
      type="file"
      text="upload"
      onChange={(e) => {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          function () {
            onUpload(reader.result);
          },
          false
        );
        let file = e.target.files[0];
        if (file) {
          if (file.type.includes("image")) {
            if (file.size < 10000000) {
              if (file.name.length < 40) {
                reader.readAsDataURL(file);
              } else {
                alert("file name is too long");
              }
            } else {
              alert("file is too large");
            }
          } else {
            alert("wrong file type");
          }
        }
      }}
    ></input>
  );
};

export default PhotoUploader;
