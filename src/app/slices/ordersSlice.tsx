import { UpdateOrdersAction } from "../../types/redux/orders";
import { OrdersSummary, Order } from "../../interfaces/orders";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  data: OrdersSummary;
  originalData: OrdersSummary;
  entity: string;
  hasEntity: boolean;
  dateFilter: string;
  orders_data: OrdersSummary;
  filtered: boolean;
} = {
  data: {},
  originalData: {},
  entity: "",
  hasEntity: false,
  dateFilter: "30",
  orders_data: {},
  filtered: false,
};

export const ordersSlice = createSlice({
  name: UpdateOrdersAction,
  initialState: initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrdersSummary>) => {
      // state.data = action.payload;
      state.originalData = action.payload;
      state.orders_data = action.payload;
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
        (appr) =>
          new Date(appr.date) > date ||
          (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
      );

      let ipDefaultFilter = in_progress.filter(
        (appr) =>
          new Date(appr.date) > date ||
          (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
      );

      if (completedDefaultFilter.length === 0 && ipDefaultFilter.length === 0) {
        date = new Date(new Date().setDate(new Date().getDate() - 60));
        completedDefaultFilter = completed.filter(
          (appr) =>
            new Date(appr.date) > date ||
            (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
        );
        ipDefaultFilter = in_progress.filter(
          (appr) =>
            new Date(appr.date) > date ||
            (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
        );
        state.dateFilter = "60";

        if (
          completedDefaultFilter.length === 0 &&
          ipDefaultFilter.length === 0
        ) {
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
          (appr) =>
            new Date(appr.date) > date ||
            (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
        );

        state.data.in_progress = state.originalData.in_progress!.filter(
          (appr) =>
            new Date(appr.date) > date ||
            (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
        );
      } else if (action.payload === "60") {
        let date = new Date(new Date().setDate(new Date().getDate() - 60));
        state.data.completed = state.originalData.completed!.filter(
          (appr) =>
            new Date(appr.date) > date ||
            (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
        );

        state.data.in_progress = state.originalData.in_progress!.filter(
          (appr) =>
            new Date(appr.date) > date ||
            (isNaN(appr.orderNo) && appr.orderNo.includes("APR"))
        );
      } else {
        state.data = state.originalData;
      }
    },
    filterType: (state, action: PayloadAction<string>) => {
      const search_type = action.payload;

      let in_prog_filter = [] as Order[];
      let completed_filter = [] as Order[];
      if (
        state.originalData.in_progress &&
        state.originalData.in_progress.length > 0
      ) {
        if (search_type === "Deployments") {
          in_prog_filter = state.originalData.in_progress.filter(
            (o) => o.items.filter((i) => i.type === "laptop").length > 0
          );
        } else if (search_type === "Returns") {
          in_prog_filter = state.originalData.in_progress.filter(
            (o) =>
              o.items.filter(
                (i) => i.name === "Offboarding" || i.name === "Returning"
              ).length > 0
          );
        }
      }

      if (
        state.originalData.completed &&
        state.originalData.completed.length > 0
      ) {
        if (search_type === "Deployments") {
          completed_filter = state.originalData.completed.filter(
            (o) => o.items.filter((i) => i.type === "laptop").length > 0
          );
        } else if (search_type === "Returns") {
          completed_filter = state.originalData.completed.filter(
            (o) =>
              o.items.filter(
                (i) => i.name === "Offboarding" || i.name === "Returning"
              ).length > 0
          );
        }
      }

      state.orders_data.in_progress = in_prog_filter;
      state.orders_data.completed = completed_filter;
    },
    filterOrders: (state, action: PayloadAction<string>) => {
      const search_term = action.payload.toLowerCase();

      let in_prog_filter = [] as Order[];
      let completed_filter = [] as Order[];

      if (
        state.originalData.in_progress &&
        state.originalData.in_progress.length > 0
      ) {
        in_prog_filter = state.originalData.in_progress.filter(
          (i) =>
            i.orderNo.toString().includes(search_term) ||
            i.full_name.toLowerCase().includes(search_term) ||
            i.address?.formatted?.toLowerCase().includes(search_term) ||
            i.items.filter(
              (item) =>
                item.name.toLowerCase().includes(search_term) ||
                item.serial_number?.toLowerCase().includes(search_term)
            ).length > 0
        );
      }

      if (
        state.originalData.completed &&
        state.originalData.completed.length > 0
      ) {
        completed_filter = state.originalData.completed.filter(
          (i) =>
            i.orderNo.toString().includes(search_term) ||
            i.full_name.toLowerCase().includes(search_term) ||
            i.address?.formatted?.toLowerCase().includes(search_term) ||
            i.items.filter(
              (item) =>
                item.name.toLowerCase().includes(search_term) ||
                item.serial_number?.toLowerCase().includes(search_term)
            ).length > 0
        );
      }

      state.orders_data.in_progress = in_prog_filter;
      state.orders_data.completed = completed_filter;
    },
    resetOrders: (state) => {
      state.orders_data = state.originalData;
    },
  },
});

export const {
  setOrders,
  filterEntity,
  filterDate,
  filterType,
  resetOrders,
  filterOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
