import React from "react";
import GooglePicker from "react-google-picker";
import { FaGoogleDrive } from "react-icons/fa";
import { UploadGoogleDriveFile } from "../../../database/firebase";

async function onSuccess(path, files, user, onFinish, projectId) {
  await Promise.all(
    files.map((x) => UploadGoogleDriveFile(path, x, user.username, projectId))
  );
  onFinish();
}

const GoogleDrive = ({ projectId, path, user, onFinish }) => {
  return (
    <GooglePicker
      clientId={
        "517770655009-phkgmut015g7nofo2dcagjadg37oqcs2.apps.googleusercontent.com"
      }
      developerKey={"AIzaSyAJkJjkHeFCTixrPQsuqDgTRu5tKK7pDPc"}
      scope={["https://www.googleapis.com/auth/drive.readonly"]}
      onChange={(data) => {
        if (data && data.docs) {
          onSuccess(path, data.docs, user, onFinish, projectId);
        }
      }}
      onAuthFailed={(data) => {}}
      multiselect={true}
      navHidden={true}
      authImmediate={false}
      viewId={"DOCS"}
    >
      <div className="cursor-pointer">
        <FaGoogleDrive className="mr-2"></FaGoogleDrive>Google drive
      </div>
    </GooglePicker>
  );
};

export default GoogleDrive;
