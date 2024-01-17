import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateMarketOrderAction } from "../../types/redux/market";
import { PauseOutlined } from "@mui/icons-material";
import { MarketplaceProducts2 } from "../../interfaces/inventory";

const initialState: {
  data: any;
  filteredData: any;
  dateFilter: string;
  order_info: any;
  accessories: any;
  products: MarketplaceProducts2[];
  marketplace_client: string;
} = {
  data: [],
  filteredData: [],
  dateFilter: "30",
  order_info: null,
  accessories: null,
  products: [],
  marketplace_client: "",
};

export const marketSlice = createSlice({
  name: UpdateMarketOrderAction,
  initialState: initialState,
  reducers: {
    setApprovals: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload.reverse();
      let date = new Date(new Date().setDate(new Date().getDate() - 30));
      let defaultFilter = action.payload.filter(
        (appr) => new Date(appr.date) > date
      );

      if (defaultFilter.length > 0) {
        state.filteredData = defaultFilter;
      } else {
        date = new Date(new Date().setDate(new Date().getDate() - 60));
        let sixtyFilter = action.payload.filter(
          (appr) => new Date(appr.date) > date
        );

        if (sixtyFilter.length > 0) {
          state.filteredData = sixtyFilter;
          state.dateFilter = "60";
        } else {
          state.filteredData = action.payload;
          state.dateFilter = "All";
        }
      }
    },
    updateApprovals: (state, action: PayloadAction<string>) => {
      state.dateFilter = action.payload;
      if (action.payload === "30") {
        let date = new Date(new Date().setDate(new Date().getDate() - 30));
        state.filteredData = state.data.filter(
          (appr: any) => new Date(appr.date) > date
        );
      } else if (action.payload === "60") {
        let date = new Date(new Date().setDate(new Date().getDate() - 60));
        state.filteredData = state.data.filter(
          (appr: any) => new Date(appr.date) > date
        );
      } else if (action.payload === "All") {
        state.filteredData = state.data;
      }
    },
    filterApprovals: (state, action: PayloadAction<string>) => {
      if (action.payload !== "") {
        const lowerCaseText = action.payload.toLowerCase();
        const filteredOrders = state.data.filter(
          (ord: any) =>
            ord.recipient_name.toLowerCase().indexOf(lowerCaseText) > -1 ||
            ord.device_type.toLowerCase().indexOf(lowerCaseText) > -1
        );

        if (filteredOrders.length > 0) {
          state.filteredData = filteredOrders;
          state.dateFilter = "All";
        }
      } else {
        state.filteredData = state.data;
        state.dateFilter = "All";
      }
    },
    openMarketplace: (state, action: PayloadAction<any>) => {
      state.order_info = action.payload;
    },
    resetMarketplaceInfo: (state) => {
      state.order_info = null;
    },
    addProducts: (state, action: PayloadAction<MarketplaceProducts2[]>) => {
      state.products = action.payload;
      state.accessories = null;
      let accessories_index = -1;
      action.payload.forEach((product, index) => {
        state.marketplace_client = product.client;
        if (product.item_type === "Accessories") {
          state.accessories = product;
          accessories_index = index;
        }
      });

      if (accessories_index > -1) {
        state.products.push(state.products.splice(accessories_index, 1)[0]);
      }

      if (state.accessories === null) {
        state.accessories = {};
      }
    },
  },
});

export const {
  setApprovals,
  updateApprovals,
  filterApprovals,
  openMarketplace,
  resetMarketplaceInfo,
  addProducts,
} = marketSlice.actions;

export default marketSlice.reducer;
