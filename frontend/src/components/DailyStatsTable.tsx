import React, { useState, useEffect } from "react";
import FilterControls from "./FilterControls";
import DataTable from "./DataTable";
import PaginationControls from "./PaginationControls";
import DayDetailsModal from "./DayDetailsModal";
import { buildQueryParams, cleanToNumber } from "../utils/formatters";
import { getDailyStats, getDayDetails } from "../utils/api";
import { DailyStat, ModalData } from "../../interfaces";

const DailyStatsTableContainer: React.FC = () => {
  // Pending filter states.
  // these states are used to store the values of the filters before they are applied.
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingMinProduction, setPendingMinProduction] = useState<
    string | undefined
  >(undefined);
  const [pendingMaxProduction, setPendingMaxProduction] = useState<
    string | undefined
  >(undefined);
  const [pendingMinConsumption, setPendingMinConsumption] = useState<
    string | undefined
  >();
  const [pendingMaxConsumption, setPendingMaxConsumption] = useState<
    string | undefined
  >();
  const [pendingMinPrice, setPendingMinPrice] = useState<string | undefined>();
  const [pendingMaxPrice, setPendingMaxPrice] = useState<string | undefined>();
  const [pendingMinNegativeStreak, setPendingMinNegativeStreak] = useState<
    string | undefined
  >();
  const [pendingMaxNegativeStreak, setPendingMaxNegativeStreak] = useState<
    string | undefined
  >();

  // Applied filters.
  // When the use clicks the 'Get Data' button, the pending filters are applied to these states.
  // todo why
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

  //  states for the table
  const [data, setData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(false);
  // current page number for the pagination
  const [page, setPage] = useState(1);
  // column to order by, default ordering is by date.
  const [orderBy, setOrderBy] = useState("date");
  // asc or desc order for the column
  const [order, setOrder] = useState("desc");
  // fixed number of items per page
  const limit = 10;

  // Modal state.
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  // cache state to store the data for each day and avoid fetching it again.
  const [cachedModalData, setCachedModalData] = useState<
    Record<string, ModalData>
  >({});

  console.log(modalData, "modalData is here");

  // If the fetched data.length is equal to the limit, then there are more pages to fetch.
  // therefore allow the user to press next button for the pagination.
  const computedTotalPages = data.length === limit ? page + 1 : page;

  // useEffect to fetch data when filters, page, orderBy, or order change.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Build query param using the applied filters and pagination/sorting states.
      const queryParams = buildQueryParams({
        page,
        limit,
        orderBy,
        order,
        search: appliedFilters.search,
        minProduction: appliedFilters.minProduction,
        maxProduction: appliedFilters.maxProduction,
        minConsumption: appliedFilters.minConsumption,
        maxConsumption: appliedFilters.maxConsumption,
        minPrice: appliedFilters.minPrice,
        maxPrice: appliedFilters.maxPrice,
        minNegativeStreak: appliedFilters.minNegativeStreak,
        maxNegativeStreak: appliedFilters.maxNegativeStreak,
      });
      // Hit the API to get the daily stats.
      const result = await getDailyStats(`?${queryParams}`);

      if (result) {
        // get the rows from the result and set the data state.
        const dataArray = result.rows;
        setData(dataArray);
      }
      setLoading(false);
    };

    fetchData();
  }, [appliedFilters, page, orderBy, order]);

  // When "Get Data" is clicked, update applied filters and reset page value to 1.
  const handleGetData = () => {
    setAppliedFilters({
      search: pendingSearch,
      minProduction: cleanToNumber(pendingMinProduction),
      maxProduction: cleanToNumber(pendingMaxProduction),
      minConsumption: cleanToNumber(pendingMinConsumption),
      maxConsumption: cleanToNumber(pendingMaxConsumption),
      minPrice: cleanToNumber(pendingMinPrice),
      maxPrice: cleanToNumber(pendingMaxPrice),
      minNegativeStreak: cleanToNumber(pendingMinNegativeStreak),
      maxNegativeStreak: cleanToNumber(pendingMaxNegativeStreak),
    });
    setPage(1);
  };

  // Switches the ordering of the data by column and resets the page to 1.
  const handleSort = (columnId: string) => {
    setOrderBy(columnId);
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  // Handle modal open for the single day details.
  // Checks if the day detaild are stored in our cache state before fetching them.
  const handleOpenModal = async (date: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError("");

    // check cache
    if (cachedModalData[date]) {
      setModalData(cachedModalData[date]);
      setModalLoading(false);
      return;
    }

    const result = await getDayDetails(date);

    if (!result) {
      setModalError("Error fetching day details");
    } else {
      // update cache with the new data and set the modal data.
      setCachedModalData((prev) => ({ ...prev, [date]: result }));
      setModalData(result);
    }
    setModalLoading(false);
  };

  // close the modal and reset the modal states.
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
    setModalError("");
  };

  return (
    <div className="p-4 bg-gray-950 text-white min-h-screen max-w-[1600px] flex flex-col mx-auto">
      {/* render the filtering controls and pass down the pending and applied states and a handler to to apply them. */}
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

      {/* Render data table. The div wrapping DataTable is used to make the table horizontally scrollable */}
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
