export interface DailyStat {
  date: string;
  totalproduction: number;
  totalconsumption: number;
  avgprice: number;
  longestnegativestreak: string;
}

export interface FilterControlsProps {
  pendingSearch: string;
  setPendingSearch: (value: string) => void;
  pendingMinProduction?: string;
  setPendingMinProduction: (value: string | undefined) => void;
  pendingMaxProduction?: string;
  setPendingMaxProduction: (value: string | undefined) => void;
  pendingMinConsumption?: string;
  setPendingMinConsumption: (value: string | undefined) => void;
  pendingMaxConsumption?: string;
  setPendingMaxConsumption: (value: string | undefined) => void;
  pendingMinPrice?: string;
  setPendingMinPrice: (value: string | undefined) => void;
  pendingMaxPrice?: string;
  setPendingMaxPrice: (value: string | undefined) => void;
  pendingMinNegativeStreak?: string;
  setPendingMinNegativeStreak: (value: string | undefined) => void;
  pendingMaxNegativeStreak?: string;
  setPendingMaxNegativeStreak: (value: string | undefined) => void;
  onGetData: () => void;
}
export interface FiltersProps extends FilterControlsProps {
  setIsOpen?: (isOpen: boolean) => void;
}

export interface DataTableProps {
  data: DailyStat[];
  loading: boolean;
  limit: number;
  onOpenModal: (date: string) => void;
  onSort: (columnId: string) => void;
  orderBy: string;
  order: string;
}

export interface HourlyData {
  startTime: string;
  productionAmount: string;
  consumptionAmount: string;
  hourlyPrice: string;
}

interface PeakConsumptionHour {
  startTime: string;
  consumptionProductionDiff: string;
}

interface CheapestHour {
  startTime: string;
  price: string;
}

export interface ModalData {
  date: string;
  avgPrice: string;
  cheapestHour: CheapestHour;
  hourlyData: HourlyData[];
  peakConsumptionHour: PeakConsumptionHour;
  totalConsumption: string;
  totalProduction: string;
}

export interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}
