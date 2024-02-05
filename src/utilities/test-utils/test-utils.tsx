import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
//import type { RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
//@ts-ignore
import { mount } from "enzyme";

// import type { RootReducerState, AppStore } from "../../app/store";

import inventoryReducer from "../../app/slices/inventorySlice";
import ordersReducer from "../../app/slices/ordersSlice";
import approvalsReducer from "../../app/slices/approvalsSlice";
import marketReducer from "../../app/slices/marketSlice";
import recipientReducer from "../../app/slices/recipientSlice";
import { clientSlice } from "../../app/store";

// interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
//   preloadedState?: Partial<RootReducerState>;
//   store?: AppStore;
// }

// export function renderWithProviders(
//   ui: React.ReactElement,
//   {
//     preloadedState = {},
//     // Automatically create a store instance if no store was passed in
//     store = configureStore({
//       reducer: {
//         inventory: inventoryReducer,
//         orders: ordersReducer,
//         client: clientSlice.reducer,
//         approvals: approvalsReducer,
//         market: marketReducer,
//         recipient: recipientReducer,
//       },
//       preloadedState,
//     }),
//     ...renderOptions
//   }: ExtendedRenderOptions = {}
// ) {
//   function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
//     return <Provider store={store}>{children}</Provider>;
//   }

//   // Return an object with the store and all of RTL's query functions
//   return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
// }

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

export const makeMountRender = (Component: any, defaultProps = {}) => {
  return (customProps = {}) => {
    const props = {
      ...defaultProps,
      ...customProps,
    };

    return mount(
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
};

export const debugMountRender = (Component: any, defaultProps = {}) => {
  return (customProps = {}) => {
    const props = {
      ...defaultProps,
      ...customProps,
    };

    return mount(
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    ).debug();
  };
};
