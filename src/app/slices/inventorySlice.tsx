import InitialState, {
  UpdateInventoryAction,
} from "../../types/redux/inventory";
import { InventorySummary } from "../../interfaces/inventory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { data: InventorySummary[] } = {
  data: [],
};

export const inventorySlice = createSlice({
  name: UpdateInventoryAction,
  initialState: initialState,
  reducers: {
    updateInventory: (state, action: PayloadAction<InventorySummary[]>) => {
      state.data = action.payload;
    },
  },
});

export const { updateInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
