import { combineReducers, configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slices/inventorySlice";
import ordersReducer from "./slices/ordersSlice";
import approvalsReducer from "./slices/approvalsSlice";
import marketReducer from "./slices/marketSlice";
import recipientReducer from "./slices/recipientSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
  name: "UpdateClient",
  initialState: {
    data: "",
    selectedClient: "public",
    selectedEntity: "",
    roles: [] as string[],
    allowed_pages: [] as string[],
    entities: [] as string[],
  },
  reducers: {
    updateClient: (state, action: PayloadAction<string>) => {
      state.data = action.payload;
    },
    updateSelectedClient: (state, action: PayloadAction<string>) => {
      state.selectedClient = action.payload;
      state.selectedEntity = "";
    },
    updateEntity: (state, action: PayloadAction<string>) => {
      state.selectedEntity = action.payload;
    },
    addRole: (state, action: PayloadAction<string[]>) => {
      if (action.payload) {
        state.roles = action.payload;
      }
    },
    updatePages: (state, action: PayloadAction<string[]>) => {
      if (action.payload) {
        state.allowed_pages = action.payload;
      }
    },
    setEntities: (state, action: PayloadAction<string[]>) => {
      if (action.payload) {
        state.entities = action.payload;
      }
    },
  },
});

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    orders: ordersReducer,
    client: clientSlice.reducer,
    approvals: approvalsReducer,
    market: marketReducer,
    recipient: recipientReducer,
  },
});

const rootReducer = combineReducers({
  inventory: inventoryReducer,
  orders: ordersReducer,
  client: clientSlice.reducer,
  approvals: approvalsReducer,
  market: marketReducer,
  recipient: recipientReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export default store;

export const {
  updateClient,
  updateSelectedClient,
  updateEntity,
  addRole,
  updatePages,
  setEntities,
} = clientSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type RootReducerState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
