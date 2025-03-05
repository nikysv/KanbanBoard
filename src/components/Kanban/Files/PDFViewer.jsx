import { useState, useEffect } from "react";
import useLocalStorage from "../../../hooks/useLocalStorage";

const PDFViewer = ({ file }) => {
  const [error, setError] = useState(null);
  const [storedPDF, setStoredPDF] = useLocalStorage(`pdf-${file.id}`, null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  useEffect(() => {
    if (file && file.base64) {
      setStoredPDF(file.base64);
    }
  }, [file, setStoredPDF]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = storedPDF;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Descargar PDF
        </button>
      </div>
    );
  }

  if (!storedPDF) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {useGoogleViewer ? (
        // Google Docs Viewer
        <iframe
          src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
            storedPDF
          )}`}
          className="w-full h-[600px] border rounded-lg shadow-lg"
          title="PDF Viewer"
        />
      ) : (
        // Native PDF Viewer
        <iframe
          src={storedPDF}
          className="w-full h-[600px] border rounded-lg shadow-lg"
          title="PDF Viewer"
        />
      )}

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setUseGoogleViewer(!useGoogleViewer)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          {useGoogleViewer ? "Usar visor nativo" : "Usar Google Docs"}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
