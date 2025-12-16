import { useEffect, useState } from "react";

const BASE_URL = "https://ai-powered-sensor-automation.onrender.com";

export default function LiveSensorDashboard() {
  const [readings, setReadings] = useState([]);
  const [summary, setSummary] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(true);

  const fetchReadings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/new-reading`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setReadings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch readings:", err);
      setReadings([]);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${BASE_URL}/summary?limit=5`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSummary(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      setSummary([]);
    }
  };

  const fetchPrediction = async () => {
    try {
      setLoadingPrediction(true);
      const res = await fetch(`${BASE_URL}/predict`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Failed to fetch prediction:", err);
      setPrediction(null);
    } finally {
      setLoadingPrediction(false);
    }
  };

  useEffect(() => {
    fetchReadings();
    fetchSummary();
    fetchPrediction();

    const interval = setInterval(() => {
      fetchReadings();
      fetchSummary();
      fetchPrediction();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-slate-100 p-4 md:p-6">
      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 border-l-4 border-blue-600 pl-4 mb-6">
        Real-Time Monitoring & Error Management System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100%-60px)]">
        {/* LEFT — SENSOR TABLE */}
        <div className="md:col-span-9 col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {readings.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              No sensor readings available
            </div>
          ) : (
            <table className="w-full text-sm min-w-[600px]">
              <thead className="sticky top-0 bg-slate-200 border-b border-slate-300">
                <tr className="text-left text-slate-700 text-xs font-semibold uppercase tracking-wide">
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">DHT Temp</th>
                  <th className="px-4 py-3">DHT RH</th>
                  <th className="px-4 py-3">BME Temp</th>
                  <th className="px-4 py-3">BME RH</th>
                  <th className="px-4 py-3">Pressure</th>
                  <th className="px-4 py-3">RH Error</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((row) => {
                  const error = Math.abs(row.RH_ERROR_pred);
                  const isActive = selectedRow?.id === row.id;

                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRow(row)}
                      className={`cursor-pointer transition ${
                        isActive ? "bg-blue-50" : "hover:bg-slate-50"
                      } border-b border-slate-200`}
                    >
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{row.id}</td>
                      <td className="px-4 py-3">{row.DHT_TEMP_C}</td>
                      <td className="px-4 py-3">{row.DHT_RH}</td>
                      <td className="px-4 py-3">{row.BME_TEMP_C}</td>
                      <td className="px-4 py-3">{row.BME_RH}</td>
                      <td className="px-4 py-3">{row.Pressure_hPa}</td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          error > 5
                            ? "text-red-600"
                            : error > 2
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {row.RH_ERROR_pred.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT — ERROR SUMMARY + PREDICTION */}
        <div className="md:col-span-3 col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col gap-4">
          {/* ERROR SUMMARY */}
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
            Error Summary
          </h2>
          {summary.length === 0 ? (
            <p className="text-sm text-slate-400">No errors detected</p>
          ) : (
            <ul className="space-y-3">
              {summary.map((item, index) => (
                <li
                  key={index}
                  className="p-3 rounded-md bg-slate-50 border border-slate-200"
                >
                  <p className="text-sm font-medium text-slate-700">
                    Sensor ID: {item.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    RH Error:{" "}
                    <span className="font-semibold text-red-600">
                      {item.RH_ERROR_pred.toFixed(2)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* PREDICTION */}
          <div className="mt-auto p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-semibold text-blue-700 mb-1">
              Predicted RH Error
            </h3>
            {loadingPrediction ? (
              <p className="text-sm text-blue-400">Awaiting response...</p>
            ) : prediction ? (
              <p
                className={`text-lg font-bold ${
                  prediction.RH_ERROR_pred > 5
                    ? "text-red-600"
                    : "text-blue-800"
                }`}
              >
                {prediction.RH_ERROR_pred?.toFixed(2) ?? prediction.toFixed(2)}
              </p>
            ) : (
              <p className="text-sm text-blue-400">No prediction available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
