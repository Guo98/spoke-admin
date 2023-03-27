import InitialInventoryState, {
  UpdateInventoryAction,
} from "../../types/redux/inventory";
import { InventorySummary } from "../../interfaces/inventory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialInventoryState = {
  data: [],
  pending: [],
  deployed: [],
  in_stock: [],
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
          let instocklaptops = device.serial_numbers.filter(
            (individual) => individual.status === "In Stock"
          );

          let deployedlaptops = device.serial_numbers.filter(
            (individual) => individual.status === "Deployed"
          );

          let offboardingLaptops = device.serial_numbers.filter(
            (individual) =>
              individual.status === "Offboarding" ||
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
        }
      });

      inStock.sort((a, b) => b.serial_numbers.length - a.serial_numbers.length);
      deployed.sort(
        (a, b) => b.serial_numbers.length - a.serial_numbers.length
      );

      state.pending = offboarding;
      state.deployed = deployed;
      state.in_stock = inStock;
    },
    filterInventoryByEntity: (state, action: PayloadAction<string>) => {
      const tempData = state.data;
      if (action.payload !== "") {
        let inStock: InventorySummary[] = [];
        let deployed: InventorySummary[] = [];
        let offboarding: InventorySummary[] = [];

        tempData.forEach((device) => {
          if (device.entity === action.payload) {
            if (device.serial_numbers) {
              let instocklaptops = device.serial_numbers.filter(
                (individual) => individual.status === "In Stock"
              );

              let deployedlaptops = device.serial_numbers.filter(
                (individual) => individual.status === "Deployed"
              );

              let offboardingLaptops = device.serial_numbers.filter(
                (individual) =>
                  individual.status === "Offboarding" ||
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
            }
          }
        });

        inStock.sort(
          (a, b) => b.serial_numbers.length - a.serial_numbers.length
        );
        deployed.sort(
          (a, b) => b.serial_numbers.length - a.serial_numbers.length
        );

        state.pending = offboarding;
        state.deployed = deployed;
        state.in_stock = inStock;
      } else {
        let inStock: InventorySummary[] = [];
        let deployed: InventorySummary[] = [];
        let offboarding: InventorySummary[] = [];
        tempData.forEach((device) => {
          if (device.serial_numbers) {
            let instocklaptops = device.serial_numbers.filter(
              (individual) => individual.status === "In Stock"
            );

            let deployedlaptops = device.serial_numbers.filter(
              (individual) => individual.status === "Deployed"
            );

            let offboardingLaptops = device.serial_numbers.filter(
              (individual) =>
                individual.status === "Offboarding" ||
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
          }
        });

        inStock.sort(
          (a, b) => b.serial_numbers.length - a.serial_numbers.length
        );
        deployed.sort(
          (a, b) => b.serial_numbers.length - a.serial_numbers.length
        );

        state.pending = offboarding;
        state.deployed = deployed;
        state.in_stock = inStock;
      }
    },
  },
});

export const { updateInventory, filterInventoryByEntity } =
  inventorySlice.actions;

export default inventorySlice.reducer;
