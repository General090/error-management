import { useState } from "react";

const readings = [
  {
    created_at: "2025-12-15 12:09:10.713699",
    id: 200,
    dht_temp_c: 28.9,
    dht_rh: 75.0,
    bme_temp_c: 29.85,
    bme_rh: 100.0,
    pressure_hpa: 1003.21,
    rh_error_pred: -2.8062710762023926,
  },
  {
    created_at: "2025-12-15 12:09:03.248696",
    id: 199,
    dht_temp_c: 28.9,
    dht_rh: 75.0,
    bme_temp_c: 29.84,
    bme_rh: 100.0,
    pressure_hpa: 1003.21,
    rh_error_pred: -2.8062710762023926,
  },
  {
    created_at: "2025-12-15 12:08:54.138979",
    id: 198,
    dht_temp_c: 28.9,
    dht_rh: 75.0,
    bme_temp_c: 29.84,
    bme_rh: 100.0,
    pressure_hpa: 1003.18,
    rh_error_pred: -2.8062710762023926,
  },
];

export default function LiveSensorDashboard() {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <div className="h-screen bg-slate-100 p-6">
      <h1 className="mb-6 text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 tracking-tight border-l-4 border-blue-500 pl-4 py-2">Real time monitoring and error management system</h1>

      <div className="grid grid-cols-12 gap-6 h-full">

        {/* LEFT — TABLE */}
        <div className="col-span-9 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-900">
              <tr className="text-left text-white text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">DHT_TEMP_C</th>
                <th className="px-4 py-3">DHT_RH</th>
                <th className="px-4 py-3">BME_TEMP_C</th>
                <th className="px-4 py-3">BME_RH</th>
                <th className="px-4 py-3">Pressure_hPa</th>
                <th className="px-4 py-3">RH_ERROR_pred</th>
              </tr>
            </thead>

            <tbody>
              {readings.map((row, index) => {
                const isActive = selectedRow?.id === row.id;

                return (
                  <tr
                    key={index}
                    onClick={() => setSelectedRow(row)}
                    className={`cursor-pointer transition ${
                      isActive ? "bg-blue-50" : "hover:bg-slate-50"
                    } border-b border-slate-100`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {row.created_at}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.id}</td>
                    <td className="px-4 py-3 text-slate-600">{row.dht_temp_c}</td>
                    <td className="px-4 py-3 text-slate-600">{row.dht_rh}</td>
                    <td className="px-4 py-3 text-slate-600">{row.bme_temp_c}</td>
                    <td className="px-4 py-3 text-slate-600">{row.bme_rh}</td>
                    <td className="px-4 py-3 text-slate-600">{row.pressure_hpa}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.rh_error_pred}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* RIGHT — DETAILS PANEL */}
        <div className="col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {!selectedRow ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
              <span className="mb-2 text-base">📊</span>
              Select a row to view details
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-6">
                Sensor Reading Details
              </h2>

              <div className="space-y-4 text-sm">
                <Detail label="Created At" value={selectedRow.created_at} />
                <Detail label="ID" value={selectedRow.id} />
                <Detail label="DHT Temp (°C)" value={selectedRow.dht_temp_c} />
                <Detail label="DHT RH (%)" value={selectedRow.dht_rh} />
                <Detail label="BME Temp (°C)" value={selectedRow.bme_temp_c} />
                <Detail label="BME RH (%)" value={selectedRow.bme_rh} />
                <Detail label="Pressure (hPa)" value={selectedRow.pressure_hpa} />
                <Detail
                  label="RH Error Prediction"
                  value={selectedRow.rh_error_pred}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* Reusable detail row */
function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
