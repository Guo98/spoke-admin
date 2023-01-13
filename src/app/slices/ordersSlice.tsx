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
      state.data = action.payload;
    },
  },
});

export const { updateOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
