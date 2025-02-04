import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
import { formatNumber, formatHour, calculateDomain } from "../utils/formatters";
import { ModalData } from "../interfaces";

interface DayDetailsModalProps {
  modalOpen: boolean;
  modalData: ModalData | null;
  modalLoading: boolean;
  modalError: string;
  onClose: () => void;
}

// custom tooltip for the charts when hovering over the data points
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    // extract the start time of the hoevered data point
    const hour = formatHour(payload[0].payload.startTime);
    return (
      <div className="p-2 bg-white text-black rounded shadow-md">
        <p className="font-semibold">Time: {hour}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            {entry.name}: {formatNumber(entry.value ?? 0, 2)}
            {/* Displays the data name production/consumption and its corresponding value, formatted to 2 decimal places. 
            0 is a fallback for when entry.value is undefined */}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// modal displaying the day specific statistics with charts
const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  modalOpen,
  modalData,
  modalLoading,
  modalError,
  onClose,
}) => {
  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-[#0f172a] text-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2 mb-4 border-gray-700">
          <h2 className="text-xl font-bold">
            Statistics for {modalData?.date}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </div>
        {modalLoading ? (
          <p>Loading...</p>
        ) : modalError ? (
          <p className="text-red-500">{modalError}</p>
        ) : modalData ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="font-semibold">Total Consumption</p>
                <p>{formatNumber(modalData.totalConsumption, 2)} MWh</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="font-semibold">Total Production</p>
                <p>{formatNumber(modalData.totalProduction, 2)} MWh</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="font-semibold">Average Price</p>
                <p>{formatNumber(modalData.avgPrice, 2)} €/MWh</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="font-semibold">Peak Consumption Hour</p>
                <p>
                  {formatHour(modalData.peakConsumptionHour.startTime)} (
                  {formatNumber(
                    modalData.peakConsumptionHour.consumptionProductionDiff,
                    2
                  )}{" "}
                  MWh)
                </p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="font-semibold">Cheapest Hour</p>
                <p>
                  {formatHour(modalData.cheapestHour.startTime)} (
                  {formatNumber(modalData.cheapestHour.price, 2)} €/MWh)
                </p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Hourly Consumption</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={modalData.hourlyData}
                  margin={{ top: 20, right: 20, left: 30, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="startTime" tickFormatter={formatHour} />
                  <YAxis
                    domain={calculateDomain(
                      modalData.hourlyData,
                      "consumptionAmount",
                      false
                    )}
                    tickFormatter={(val) => formatNumber(val, 0)}
                    scale="auto"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="consumptionAmount"
                    stroke="#8884d8"
                    name="Consumption (MWh)"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Hourly Production</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={modalData.hourlyData}
                  margin={{ top: 20, right: 20, left: 30, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="startTime" tickFormatter={formatHour} />
                  <YAxis
                    domain={calculateDomain(
                      modalData.hourlyData,
                      "productionAmount",
                      false
                    )}
                    tickFormatter={(val) => formatNumber(val, 0)}
                    scale="auto"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="productionAmount"
                    stroke="#82ca9d"
                    name="Production (MWh)"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Hourly Price</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={modalData.hourlyData}
                  margin={{ top: 20, right: 20, left: 30, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="startTime" tickFormatter={formatHour} />
                  <YAxis
                    domain={calculateDomain(
                      modalData.hourlyData,
                      "hourlyPrice",
                      true
                    )}
                    tickFormatter={(val) => formatNumber(val, 2)}
                    scale="auto"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="hourlyPrice"
                    fill="#ffc658"
                    name="Price (€/MWh)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DayDetailsModal;
