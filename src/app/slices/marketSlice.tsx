import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateMarketOrderAction } from "../../types/redux/market";

const initialState: {
  data: any;
  filteredData: any;
  dateFilter: string;
} = {
  data: [],
  filteredData: [],
  dateFilter: "30",
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
  },
});

export const { setApprovals, updateApprovals, filterApprovals } =
  marketSlice.actions;

export default marketSlice.reducer;
