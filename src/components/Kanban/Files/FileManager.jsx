import { useState } from "react";
import FilePreviewModal from "./FilePreviewModal";

const FileManager = ({ selectedFile, onClose }) => {
  return (
    <FilePreviewModal
      isOpen={Boolean(selectedFile)}
      onClose={onClose}
      files={selectedFile ? [selectedFile] : []}
      initialSelectedFile={selectedFile}
    />
  );
};

export default FileManager;
