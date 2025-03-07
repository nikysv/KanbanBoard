import { useStore } from "zustand";
import SiteProgress from "./SiteProgress";

const SiteList = ({ sites, onSiteClick, renderProgress }) => {
  return (
    <>
      {sites.map((site) => (
        <div
          key={site.id}
          onClick={() => onSiteClick(site.id)}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{site.name}</h2>
              <p className="text-gray-500">ID: {site.id}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                site.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {site.status === "active" ? "Activo" : "Pendiente"}
            </span>
          </div>
          {renderProgress && renderProgress(site)}
        </div>
      ))}
    </>
  );
};

export default SiteList;
