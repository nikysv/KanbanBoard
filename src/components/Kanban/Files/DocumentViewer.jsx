import { useState, useEffect, Suspense, lazy } from "react";
import * as XLSX from "xlsx";

// Carga diferida de los componentes
const PDFViewer = lazy(() => import("./PDFViewer"));
const WordViewer = lazy(() => import("./WordViewer"));

const DocumentViewer = ({ file }) => {
  const [excelData, setExcelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullTable, setShowFullTable] = useState(false);

  // Función para determinar el tipo de archivo
  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") return "pdf";
    if (["xls", "xlsx"].includes(extension)) return "excel";
    if (["doc", "docx"].includes(extension)) return "word";
    if (["ppt", "pptx"].includes(extension)) return "powerpoint";
    return "unsupported";
  };

  useEffect(() => {
    const processExcelFile = async () => {
      if (getFileType(file.name) === "excel") {
        try {
          setLoading(true);
          setError(null);

          // Procesar el archivo Excel de manera optimizada
          const base64 = file.base64.split(",")[1];
          const binaryString = window.atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Usar un setTimeout para no bloquear la UI
          setTimeout(() => {
            try {
              const workbook = XLSX.read(bytes, { type: "array" });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

              setExcelData(data);
              setLoading(false);
            } catch (error) {
              console.error("Error procesando Excel:", error);
              setError("Error al procesar el archivo Excel");
              setLoading(false);
            }
          }, 100);
        } catch (error) {
          console.error("Error al cargar el archivo Excel:", error);
          setError("Error al cargar el archivo");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    processExcelFile();
    return () => {
      setExcelData(null);
      setError(null);
      setLoading(false);
    };
  }, [file]);

  const fileType = getFileType(file.name);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.base64;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Descargar archivo
        </button>
      </div>
    );
  }

  if (fileType === "pdf") {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <div className="w-full h-full min-h-[600px]">
          <PDFViewer file={file} />
        </div>
      </Suspense>
    );
  }

  if (fileType === "word") {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <div className="w-full h-full min-h-[600px]">
          <WordViewer file={file} />
        </div>
      </Suspense>
    );
  }

  if (fileType === "excel" && excelData) {
    const previewRows = showFullTable ? excelData : excelData.slice(0, 50);
    const hasMoreRows = excelData.length > 50;

    return (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {excelData[0]?.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewRows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMoreRows && !showFullTable && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowFullTable(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Mostrar todas las filas ({excelData.length - 1} filas)
            </button>
          </div>
        )}
        <div className="text-center mt-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Descargar Excel original
          </button>
        </div>
      </div>
    );
  }

  // Para PowerPoint, mostrar un mensaje y botón de descarga
  if (fileType === "powerpoint") {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <span className="text-6xl mb-4 block">📽️</span>
          <h3 className="text-xl font-semibold mt-4">
            Presentación de PowerPoint
          </h3>
          <p className="text-gray-600 mt-3">
            Este tipo de archivo no se puede previsualizar directamente.
            <br />
            Por favor, descarga el archivo para verlo.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center mx-auto gap-2"
        >
          <span>⬇️</span>
          Descargar archivo
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">
        Este tipo de archivo no se puede previsualizar.
      </p>
      <button
        onClick={handleDownload}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Descargar archivo
      </button>
    </div>
  );
};

export default DocumentViewer;
