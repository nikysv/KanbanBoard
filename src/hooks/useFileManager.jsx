import { useState } from "react";

const useFileManager = (initialFiles = []) => {
  const [files, setFiles] = useState(initialFiles);

  const handleFileUpload = async (newFiles) => {
    const processedFiles = await Promise.all(
      Array.from(newFiles).map(async (file) => {
        // Convertir el archivo a base64 para almacenamiento/visualización
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64,
          uploadedBy: "Usuario",
          uploadedAt: new Date().toISOString(),
        };
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
    return processedFiles;
  };

  const removeFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const getFileUrl = (file) => {
    return file.base64;
  };

  const downloadFile = (file) => {
    const link = document.createElement("a");
    link.href = file.base64;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    files,
    setFiles,
    handleFileUpload,
    removeFile,
    getFileUrl,
    downloadFile,
  };
};

export default useFileManager;
