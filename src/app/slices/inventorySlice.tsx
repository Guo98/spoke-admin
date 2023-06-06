import InitialInventoryState, {
  UpdateInventoryAction,
} from "../../types/redux/inventory";
import {
  InventorySummary,
  MarketplaceProducts2,
} from "../../interfaces/inventory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialInventoryState = {
  data: [],
  pending: [],
  deployed: [],
  in_stock: [],
  products: [],
};

const splitInventory = (
  device: InventorySummary,
  inStock: InventorySummary[],
  deployed: InventorySummary[],
  offboarding: InventorySummary[]
) => {
  let instocklaptops = device.serial_numbers.filter(
    (individual) => individual.status === "In Stock"
  );

  let deployedlaptops = device.serial_numbers.filter(
    (individual) => individual.status === "Deployed"
  );

  let offboardingLaptops = device.serial_numbers.filter(
    (individual) =>
      individual.status === "Offboarding" ||
      individual.status === "Offboard" ||
      individual.status === "Returning" ||
      individual.status === "Top Up" ||
      individual.status === "In Progress"
  );

  let tempInStock = { ...device };
  tempInStock.serial_numbers = instocklaptops.slice(0);
  inStock.push(tempInStock);

  let tempDeployed = { ...device };
  tempDeployed.serial_numbers = deployedlaptops.slice(0);
  deployed.push(tempDeployed);

  let tempOffboarding = { ...device };
  tempOffboarding.serial_numbers = offboardingLaptops.slice(0);
  offboarding.push(tempOffboarding);
};

const sortInventory = (
  inStock: InventorySummary[],
  deployed: InventorySummary[]
) => {
  inStock.sort((a, b) => b.serial_numbers.length - a.serial_numbers.length);
  deployed.sort((a, b) => b.serial_numbers.length - a.serial_numbers.length);
};

export const inventorySlice = createSlice({
  name: UpdateInventoryAction,
  initialState: initialState,
  reducers: {
    updateInventory: (state, action: PayloadAction<InventorySummary[]>) => {
      state.data = action.payload;

      let inStock: InventorySummary[] = [];
      let deployed: InventorySummary[] = [];
      let offboarding: InventorySummary[] = [];

      const tempData = action.payload;
      tempData.forEach((device) => {
        if (device.serial_numbers) {
          splitInventory(device, inStock, deployed, offboarding);
        }
      });

      sortInventory(inStock, deployed);

      state.pending = offboarding;
      state.deployed = deployed;
      state.in_stock = inStock;
    },
    filterInventoryByEntity: (state, action: PayloadAction<string>) => {
      const tempData = state.data;
      let inStock: InventorySummary[] = [];
      let deployed: InventorySummary[] = [];
      let offboarding: InventorySummary[] = [];

      if (action.payload !== "") {
        tempData.forEach((device) => {
          if (device.entity === action.payload) {
            if (device.serial_numbers) {
              splitInventory(device, inStock, deployed, offboarding);
            }
          }
        });

        sortInventory(inStock, deployed);

        state.pending = offboarding;
        state.deployed = deployed;
        state.in_stock = inStock;
      } else {
        tempData.forEach((device) => {
          if (device.serial_numbers) {
            splitInventory(device, inStock, deployed, offboarding);
          }
        });

        sortInventory(inStock, deployed);

        state.pending = offboarding;
        state.deployed = deployed;
        state.in_stock = inStock;
      }
    },
    addProducts: (state, action: PayloadAction<MarketplaceProducts2[]>) => {
      state.products = action.payload;
    },
  },
});

export const { updateInventory, filterInventoryByEntity, addProducts } =
  inventorySlice.actions;

export default inventorySlice.reducer;
