import React from "react";
import DropboxChooser from "react-dropbox-chooser";
import { FaDropbox } from "react-icons/fa";
import { UploadDropboxFile } from "../../../database/firebase";

async function onSuccess(path, files, user, onFinish, projectId) {
  await Promise.all(
    files.map((x) => UploadDropboxFile(path, x, user, projectId))
  );
  onFinish();
}

const Dropbox = ({ path, user, projectId, onFinish }) => {
  return (
    <DropboxChooser
      appKey={"azjbxd0lilisshy"}
      success={(files) => {
        onSuccess(path, files, user, onFinish, projectId);
      }}
      cancel={() => {}}
      multiselect={true}
    >
      <div className="cursor-pointer">
        <FaDropbox className="mr-2"></FaDropbox>Dropbox
      </div>
    </DropboxChooser>
  );
};

export default Dropbox;
