import React, { useState } from "react";

interface FilterControlsProps {
  pendingSearch: string;
  setPendingSearch: (value: string) => void;
  pendingMinProduction?: string;
  setPendingMinProduction: (value: string | undefined) => void;
  pendingMaxProduction?: string;
  setPendingMaxProduction: (value: string | undefined) => void;
  pendingMinConsumption?: number;
  setPendingMinConsumption: (value: number | undefined) => void;
  pendingMaxConsumption?: number;
  setPendingMaxConsumption: (value: number | undefined) => void;
  pendingMinPrice?: number;
  setPendingMinPrice: (value: number | undefined) => void;
  pendingMaxPrice?: number;
  setPendingMaxPrice: (value: number | undefined) => void;
  pendingMinNegativeStreak?: number;
  setPendingMinNegativeStreak: (value: number | undefined) => void;
  pendingMaxNegativeStreak?: number;
  setPendingMaxNegativeStreak: (value: number | undefined) => void;
  onGetData: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-2 bg-gray-800 text-white rounded"
        >
          Filter Options
        </button>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0f172a] text-white p-6 rounded-lg shadow-lg w-11/12 max-w-md max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">Filter Options</h2>
              <Filters {...props} setIsOpen={setIsOpen} />
            </div>
          </div>
        )}
      </div>
      <div className="hidden sm:block">
        <Filters {...props} />
      </div>
    </div>
  );
};

const Filters: React.FC<
  FilterControlsProps & { setIsOpen?: (isOpen: boolean) => void }
> = ({ setIsOpen, ...props }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <input
        type="text"
        placeholder="Search by date (YYYY-MM-DD)"
        value={props.pendingSearch}
        onChange={(e) => props.setPendingSearch(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Min Consumption (M)"
        value={props.pendingMinConsumption ?? ""}
        onChange={(e) =>
          props.setPendingMinConsumption(
            e.target.value ? parseFloat(e.target.value) : undefined
          )
        }
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Max Consumption (M)"
        value={props.pendingMaxConsumption ?? ""}
        onChange={(e) =>
          props.setPendingMaxConsumption(
            e.target.value ? parseFloat(e.target.value) : undefined
          )
        }
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="text"
        placeholder="Min Production"
        value={props.pendingMinProduction || ""}
        onChange={(e) => props.setPendingMinProduction(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="text"
        placeholder="Max Production"
        value={props.pendingMaxProduction || ""}
        onChange={(e) => props.setPendingMaxProduction(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Min Price"
        value={props.pendingMinPrice ?? ""}
        onChange={(e) =>
          props.setPendingMinPrice(
            e.target.value ? parseFloat(e.target.value) : undefined
          )
        }
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Max Price (€)"
        value={props.pendingMaxPrice ?? ""}
        onChange={(e) =>
          props.setPendingMaxPrice(
            e.target.value ? parseFloat(e.target.value) : undefined
          )
        }
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Min Negative Streak (hrs)"
        value={props.pendingMinNegativeStreak ?? ""}
        onChange={(e) =>
          props.setPendingMinNegativeStreak(
            e.target.value ? parseFloat(e.target.value) : undefined
          )
        }
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <input
        type="number"
        placeholder="Max Negative Streak (hrs)"
        value={props.pendingMaxNegativeStreak ?? ""}
        onChange={(e) =>
          props.setPendingMaxNegativeStreak(
            e.target.value ? parseFloat(e.target.value) : undefined
          )
        }
        className="p-2 border border-gray-700 bg-gray-800 text-white w-full rounded"
      />
      <button
        onClick={() => {
          props.onGetData();
          setIsOpen?.(false);
        }}
        className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto"
      >
        Get Data
      </button>
    </div>
  );
};

export default FilterControls;
