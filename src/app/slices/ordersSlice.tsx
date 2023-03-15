import { UpdateOrdersAction } from "../../types/redux/orders";
import { OrdersSummary } from "../../interfaces/orders";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  data: OrdersSummary;
  originalData: OrdersSummary;
  entity: string;
  hasEntity: boolean;
} = {
  data: {},
  originalData: {},
  entity: "",
  hasEntity: false,
};

export const ordersSlice = createSlice({
  name: UpdateOrdersAction,
  initialState: initialState,
  reducers: {
    updateOrders: (state, action: PayloadAction<OrdersSummary>) => {
      state.data = action.payload;
      state.originalData = action.payload;

      if (action.payload.completed && action.payload.completed.length > 0) {
        if (action.payload.completed[0].entity) {
          state.hasEntity = true;
        }
      } else if (
        action.payload.in_progress &&
        action.payload.in_progress.length > 0
      ) {
        if (action.payload.in_progress[0].entity) {
          state.hasEntity = true;
        }
      }
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
  },
});

export const { updateOrders, filterEntity } = ordersSlice.actions;

export default ordersSlice.reducer;
