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
} from "recharts";
import { calculateDomain } from "../lib/utils";

interface DayDetailsModalProps {
  modalOpen: boolean;
  modalData: any;
  modalLoading: boolean;
  modalError: string;
  onClose: () => void;
}

const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  modalOpen,
  modalData,
  modalLoading,
  modalError,
  onClose,
}) => {
  if (!modalOpen) return null;

  const formatNumber = (value: number | string, fractionDigits: number = 2) => {
    const num = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString("en-US", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  };

  const formatHour = (time: string) => time.slice(11, 16);

  // Calculate the domain of the y-axis based on the data. Allow negative values for specified charts

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const hour = formatHour(payload[0].payload.startTime);
      return (
        <div className="p-2 bg-white text-black rounded shadow-md">
          <p className="font-semibold">Time: {hour}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              {entry.name}: {formatNumber(entry.value, 2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                  margin={{ top: 20, right: 30, left: 80, bottom: 30 }} // Add margins
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
                    scale="auto" // Ensure dynamic scaling
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
                  margin={{ top: 20, right: 30, left: 80, bottom: 30 }} // Add margins
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
                    scale="auto" // Ensure dynamic scaling
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
                  margin={{ top: 20, right: 30, left: 80, bottom: 30 }} // Add margins
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
                    scale="auto" // Ensure dynamic scaling
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
