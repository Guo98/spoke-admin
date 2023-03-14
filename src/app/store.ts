import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import ordersReducer from "./slices/ordersSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
  name: "UpdateClient",
  initialState: { data: "", selectedClient: "public", selectedEntity: "" },
  reducers: {
    updateClient: (state, action: PayloadAction<string>) => {
      state.data = action.payload;
    },
    updateSelectedClient: (state, action: PayloadAction<string>) => {
      state.selectedClient = action.payload;
    },
    updateEntity: (state, action: PayloadAction<string>) => {
      state.selectedEntity = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    orders: ordersReducer,
    client: clientSlice.reducer,
  },
});

export default store;

export const { updateClient, updateSelectedClient, updateEntity } =
  clientSlice.actions;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
