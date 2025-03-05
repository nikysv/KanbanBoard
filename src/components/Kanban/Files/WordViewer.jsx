import { useState } from "react";

const WordViewer = ({ file }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.base64;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
      <div className="text-center mb-8">
        <div className="mb-6">
          <span className="text-6xl mb-4 block">📝</span>
          <h3 className="text-xl font-semibold mt-4">{file.name}</h3>
          <p className="text-gray-500 text-sm mt-2">Documento de Word</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6 max-w-md">
          <div className="flex items-center gap-3">
            <span className="text-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">Tamaño del archivo</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full"
        >
          <span>⬇️</span>
          Descargar documento
        </button>
      </div>
    </div>
  );
};

export default WordViewer;
