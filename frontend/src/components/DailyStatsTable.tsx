import React, { useState, useEffect } from "react";
import FilterControls from "./FilterControls";
import DataTable, { DailyStat } from "./DataTable";
import PaginationControls from "./PaginationControls";
import DayDetailsModal from "./DayDetailsModal";
import { buildQueryParams, getDailyStats, getDayDetails } from "../lib/utils";

const DailyStatsTableContainer: React.FC = () => {
  // Pending filter state.
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingMinProduction, setPendingMinProduction] = useState<
    string | undefined
  >(undefined);
  const [pendingMaxProduction, setPendingMaxProduction] = useState<
    string | undefined
  >(undefined);
  const [pendingMinConsumption, setPendingMinConsumption] = useState<
    number | undefined
  >();
  const [pendingMaxConsumption, setPendingMaxConsumption] = useState<
    number | undefined
  >();
  const [pendingMinPrice, setPendingMinPrice] = useState<number | undefined>();
  const [pendingMaxPrice, setPendingMaxPrice] = useState<number | undefined>();
  const [pendingMinNegativeStreak, setPendingMinNegativeStreak] = useState<
    number | undefined
  >();
  const [pendingMaxNegativeStreak, setPendingMaxNegativeStreak] = useState<
    number | undefined
  >();

  // Applied filters (triggering data fetch)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    minProduction: undefined as number | undefined,
    maxProduction: undefined as number | undefined,
    minConsumption: undefined as number | undefined,
    maxConsumption: undefined as number | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minNegativeStreak: undefined as number | undefined,
    maxNegativeStreak: undefined as number | undefined,
  });

  // Other state.
  const [data, setData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const limit = 10;

  // Modal state.
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [cachedModalData, setCachedModalData] = useState<Record<string, any>>(
    {}
  );

  // If the number of returned records equals the page limit, assume there's at least one more page.
  const computedTotalPages = data.length === limit ? page + 1 : page;

  // Fetch data when filters, page, orderBy, or order change.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const queryParams = buildQueryParams({
        page,
        limit,
        orderBy,
        order,
        search: appliedFilters.search,
        minProduction: appliedFilters.minProduction,
        maxProduction: appliedFilters.maxProduction,
        minConsumption: appliedFilters.minConsumption
          ? appliedFilters.minConsumption * 1_000_000
          : undefined,
        maxConsumption: appliedFilters.maxConsumption
          ? appliedFilters.maxConsumption * 1_000_000 + 10000
          : undefined,
        minPrice: appliedFilters.minPrice,
        maxPrice: appliedFilters.maxPrice,
        minNegativeStreak: appliedFilters.minNegativeStreak,
        maxNegativeStreak: appliedFilters.maxNegativeStreak,
      });

      const result = await getDailyStats(`?${queryParams}`);
      console.log("Fetched result:", result);
      if (result) {
        //  the API returns an object with a 'rows' property containing the data.
        const dataArray = result.rows
          ? result.rows
          : result.data
          ? result.data
          : result;
        setData(dataArray);
      }
      setLoading(false);
    };

    fetchData();
  }, [appliedFilters, page, orderBy, order]);

  // When "Get Data" is clicked, update applied filters and reset page.
  const handleGetData = () => {
    setAppliedFilters({
      search: pendingSearch,
      minProduction: pendingMinProduction
        ? parseFloat(pendingMinProduction.replace(/,/g, ""))
        : undefined,
      maxProduction: pendingMaxProduction
        ? parseFloat(pendingMaxProduction.replace(/,/g, ""))
        : undefined,
      minConsumption: pendingMinConsumption,
      maxConsumption: pendingMaxConsumption,
      minPrice: pendingMinPrice,
      maxPrice: pendingMaxPrice,
      minNegativeStreak: pendingMinNegativeStreak,
      maxNegativeStreak: pendingMaxNegativeStreak,
    });
    setPage(1);
  };

  // When a column is sorted, reset page.
  const handleSort = (columnId: string) => {
    setOrderBy(columnId);
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  // Handle modal close.
  const handleOpenModal = async (date: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError("");

    // Check if we already have data cached
    if (cachedModalData[date]) {
      setModalData(cachedModalData[date]);
      setModalLoading(false);
      return;
    }

    const result = await getDayDetails(date);
    if (result && result.error) {
      setModalError(result.error);
    } else {
      setCachedModalData((prev) => ({ ...prev, [date]: result }));
      setModalData(result);
    }
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
    setModalError("");
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen max-w-[1600px] flex flex-col mx-auto">
      <FilterControls
        pendingSearch={pendingSearch}
        setPendingSearch={setPendingSearch}
        pendingMinProduction={pendingMinProduction}
        setPendingMinProduction={setPendingMinProduction}
        pendingMaxProduction={pendingMaxProduction}
        setPendingMaxProduction={setPendingMaxProduction}
        pendingMinConsumption={pendingMinConsumption}
        setPendingMinConsumption={setPendingMinConsumption}
        pendingMaxConsumption={pendingMaxConsumption}
        setPendingMaxConsumption={setPendingMaxConsumption}
        pendingMinPrice={pendingMinPrice}
        setPendingMinPrice={setPendingMinPrice}
        pendingMaxPrice={pendingMaxPrice}
        setPendingMaxPrice={setPendingMaxPrice}
        pendingMinNegativeStreak={pendingMinNegativeStreak}
        setPendingMinNegativeStreak={setPendingMinNegativeStreak}
        pendingMaxNegativeStreak={pendingMaxNegativeStreak}
        setPendingMaxNegativeStreak={setPendingMaxNegativeStreak}
        onGetData={handleGetData}
      />
      <div className="overflow-x-auto">
        <DataTable
          data={data}
          loading={loading}
          limit={limit}
          onOpenModal={handleOpenModal}
          onSort={handleSort}
          orderBy={orderBy}
          order={order}
        />
      </div>
      <PaginationControls
        page={page}
        setPage={setPage}
        totalPages={computedTotalPages}
      />
      <DayDetailsModal
        modalOpen={modalOpen}
        modalData={modalData}
        modalLoading={modalLoading}
        modalError={modalError}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DailyStatsTableContainer;
