import { UpdateOrdersAction } from "../../types/redux/orders";
import { OrdersSummary } from "../../interfaces/orders";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  data: OrdersSummary;
  originalData: OrdersSummary;
  entity: string;
  hasEntity: boolean;
  dateFilter: string;
} = {
  data: {},
  originalData: {},
  entity: "",
  hasEntity: false,
  dateFilter: "30",
};

export const ordersSlice = createSlice({
  name: UpdateOrdersAction,
  initialState: initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrdersSummary>) => {
      // state.data = action.payload;
      state.originalData = action.payload;
      let date = new Date(new Date().setDate(new Date().getDate() - 30));
      let completed = [] as any[];
      let in_progress = [...(action.payload.in_progress as any[])];

      if (action.payload.completed && action.payload.completed.length > 0) {
        action.payload.completed.forEach((order) => {
          if (
            order.shipping_status !== "Complete" &&
            order.shipping_status !== "Completed"
          ) {
            in_progress.push(order);
          } else {
            completed.push(order);
          }
        });
      }

      let completedDefaultFilter = completed.filter(
        (appr) => new Date(appr.date) > date
      );

      let ipDefaultFilter = in_progress.filter(
        (appr) => new Date(appr.date) > date
      );

      if (completedDefaultFilter.length === 0) {
        date = new Date(new Date().setDate(new Date().getDate() - 60));
        completedDefaultFilter = completed.filter(
          (appr) => new Date(appr.date) > date
        );
        ipDefaultFilter = in_progress.filter(
          (appr) => new Date(appr.date) > date
        );
        state.dateFilter = "60";

        if (completedDefaultFilter.length === 0) {
          state.dateFilter = "All";
          completedDefaultFilter = completed;
          ipDefaultFilter = in_progress;
        }
      }
      state.data.completed = completedDefaultFilter;
      state.data.in_progress = ipDefaultFilter;
    },
    filterEntity: (state, action: PayloadAction<string>) => {
      if (action.payload !== "") {
        if (
          state.originalData.completed &&
          state.originalData.completed.length > 0
        ) {
          state.data.completed = state.originalData.completed.filter(
            (ord) => ord.entity === action.payload
          );
        }

        if (
          state.originalData.in_progress &&
          state.originalData.in_progress.length > 0
        ) {
          state.data.in_progress = state.originalData.in_progress.filter(
            (ord) => ord.entity === action.payload
          );
        }
      } else {
        state.data = state.originalData;
      }
    },
    filterDate: (state, action: PayloadAction<string>) => {
      state.dateFilter = action.payload;

      if (action.payload === "30") {
        let date = new Date(new Date().setDate(new Date().getDate() - 30));
        state.data.completed = state.originalData.completed!.filter(
          (appr) => new Date(appr.date) > date
        );

        state.data.in_progress = state.originalData.in_progress!.filter(
          (appr) => new Date(appr.date) > date
        );
      } else if (action.payload === "60") {
        let date = new Date(new Date().setDate(new Date().getDate() - 60));
        state.data.completed = state.originalData.completed!.filter(
          (appr) => new Date(appr.date) > date
        );

        state.data.in_progress = state.originalData.in_progress!.filter(
          (appr) => new Date(appr.date) > date
        );
      } else {
        state.data = state.originalData;
      }
    },
  },
});

export const { setOrders, filterEntity, filterDate } = ordersSlice.actions;

export default ordersSlice.reducer;
