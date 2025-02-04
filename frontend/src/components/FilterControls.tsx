import React, { useState } from "react";
import { FilterControlsProps, FiltersProps } from "../interfaces";

/**
 * This component is responsible for rendering the filtering options.
 * On mobile the view is a button that opens a modal with the filters inside.
 * On desktop the filters are rendered directly.
 */
const FilterControls: React.FC<FilterControlsProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      {/* Mobile view */}
      <div className="sm:hidden">
        {/* button to open the filters modal */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-2 bg-gray-800 text-white rounded"
        >
          Filter Options
        </button>
        {/* modal for the filters. opened if isOpen  */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0f172a] text-white p-6 rounded-lg shadow-lg w-11/12 max-w-md max-h-[90vh] overflow-y-auto relative">
              {/* Button to close the modal */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">Filter Options</h2>
              {/* Render the filters component and pass all the props along with the
              setIsOpen */}
              <Filters {...props} setIsOpen={setIsOpen} />
            </div>
          </div>
        )}
      </div>
      {/* Desktop view visible on 640px and upwards */}
      <div className="hidden sm:block">
        <Filters {...props} />
      </div>
    </div>
  );
};

/**
 *  Filters component is responsible for rendering the actual filtering inputs.
 *  Each input as a value has it's pending state and onchange it updates the pending state.
 */
const Filters: React.FC<FiltersProps> = ({ setIsOpen, ...props }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <input
        type="date"
        placeholder="Search by date (YYYY-MM-DD)"
        value={props.pendingSearch}
        onChange={(e) => props.setPendingSearch(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Min Consumption (M)"
        value={props.pendingMinConsumption ?? ""}
        onChange={(e) => props.setPendingMinConsumption(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Max Consumption (M)"
        value={props.pendingMaxConsumption ?? ""}
        onChange={(e) => props.setPendingMaxConsumption(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Min Production"
        value={props.pendingMinProduction || ""}
        onChange={(e) => props.setPendingMinProduction(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Max Production"
        value={props.pendingMaxProduction || ""}
        onChange={(e) => props.setPendingMaxProduction(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Min Price"
        value={props.pendingMinPrice ?? ""}
        onChange={(e) => props.setPendingMinPrice(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Max Price (€)"
        value={props.pendingMaxPrice ?? ""}
        onChange={(e) => props.setPendingMaxPrice(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Min Negative Streak (hrs)"
        value={props.pendingMinNegativeStreak ?? ""}
        onChange={(e) => props.setPendingMinNegativeStreak(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Max Negative Streak (hrs)"
        value={props.pendingMaxNegativeStreak ?? ""}
        onChange={(e) => props.setPendingMaxNegativeStreak(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      {/* button that applies the filters and fetches the data*/}
      <button
        onClick={() => {
          props.onGetData();
          setIsOpen?.(false);
        }}
        className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto hover:cursor-pointer hover:bg-blue-600"
      >
        Get Data
      </button>
    </div>
  );
};

export default FilterControls;
