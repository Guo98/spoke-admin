import { UpdateOrdersAction } from "../../types/redux/orders";
import { OrdersSummary } from "../../interfaces/orders";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { data: OrdersSummary } = {
  data: {},
};

export const ordersSlice = createSlice({
  name: UpdateOrdersAction,
  initialState: initialState,
  reducers: {
    updateOrders: (state, action: PayloadAction<OrdersSummary>) => {
      let completed = [] as any[];
      let in_progress = [...(action.payload.in_progress as any[])];

      if (action.payload.completed && action.payload.completed.length > 0) {
        action.payload.completed.forEach((order) => {
          if (order.shipping_status === "Incomplete") {
            in_progress.push(order);
          } else {
            completed.push(order);
          }
        });
      }

      state.data.completed = completed;
      state.data.in_progress = in_progress;
    },
  },
});

export const { updateOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
