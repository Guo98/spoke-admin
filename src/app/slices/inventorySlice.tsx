import InitialInventoryState, {
  UpdateInventoryAction,
} from "../../types/redux/inventory";
import {
  InventorySummary,
  MarketplaceProducts2,
} from "../../interfaces/inventory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { standardGet } from "../../services/standard";

const initialState: InitialInventoryState = {
  data: { in_stock: [], pending: [], deployed: [], end_of_life: [] },
  pending: [],
  deployed: [],
  in_stock: [],
  end_of_life: [],
  products: [],
  brands: [],
  devices: [],
  filteredDevices: [],
  filteredPage: -1,
  search_text: "",
  device_ids: [],
};

const splitInventory = (
  device: InventorySummary,
  inStock: InventorySummary[],
  deployed: InventorySummary[],
  offboarding: InventorySummary[],
  endOfLife: InventorySummary[]
) => {
  let instocklaptops = device.serial_numbers.filter(
    (individual) =>
      individual.status === "In Stock" &&
      individual.condition !== "Damaged" &&
      individual.condition !== "End of Life"
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
      individual.status === "In Progress" ||
      individual.status == "Shipping"
  );

  let endoflifeLaptops = device.serial_numbers.filter(
    (individual) =>
      individual.status === "In Stock" &&
      individual.condition !== "Used" &&
      individual.condition !== "New"
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

  let tempEndOfLife = { ...device };
  tempEndOfLife.serial_numbers = endoflifeLaptops.slice(0);
  endOfLife.push(tempEndOfLife);
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
    setInventory: (state, action: PayloadAction<InventorySummary[]>) => {
      let inStock: InventorySummary[] = [];
      let deployed: InventorySummary[] = [];
      let offboarding: InventorySummary[] = [];
      let endOfLife: InventorySummary[] = [];
      state.device_ids = [];

      const tempData = action.payload;
      tempData.forEach((device) => {
        state.device_ids.push({
          name: device.name,
          id: device.id,
          location: device.location,
          serial_numbers: device.serial_numbers.map((s) => s.sn),
        });
        if (device.serial_numbers) {
          splitInventory(device, inStock, deployed, offboarding, endOfLife);
        }
        const devicename = device.name.toLowerCase();
        if (
          (devicename.includes("mac") || devicename.includes("apple")) &&
          state.brands.indexOf("Apple") < 0
        ) {
          state.brands.push("Apple");
        } else if (
          devicename.includes("lenovo") &&
          state.brands.indexOf("Lenovo") < 0
        ) {
          state.brands.push("Lenovo");
        } else if (
          devicename.includes("dell") &&
          state.brands.indexOf("Dell") < 0
        ) {
          state.brands.push("Dell");
        }
      });

      sortInventory(inStock, deployed);

      state.pending = offboarding;
      state.data.pending = offboarding;
      state.deployed = deployed;
      state.data.deployed = deployed;
      state.in_stock = inStock;
      state.data.in_stock = inStock;
      state.data.end_of_life = endOfLife;
      state.end_of_life = endOfLife;
    },
    filterInventoryByEntity: (state, action: PayloadAction<string>) => {
      let inStock: InventorySummary[] = [];
      let deployed: InventorySummary[] = [];
      let pending: InventorySummary[] = [];
      let endOfLife: InventorySummary[] = [];

      if (action.payload !== "") {
        state.data.in_stock.forEach((dev) => {
          if (dev.entity === action.payload) {
            inStock.push(dev);
          }
        });
        state.data.pending.forEach((dev) => {
          if (dev.entity === action.payload) {
            pending.push(dev);
          }
        });
        state.data.deployed.forEach((dev) => {
          if (dev.entity === action.payload) {
            deployed.push(dev);
          }
        });
        state.data.end_of_life.forEach((dev) => {
          if (dev.entity === action.payload) {
            endOfLife.push(dev);
          }
        });
        state.pending = pending;
        state.deployed = deployed;
        state.in_stock = inStock;
        state.end_of_life = endOfLife;
      } else {
        state.pending = state.data.pending;
        state.deployed = state.data.deployed;
        state.in_stock = state.data.in_stock;
        state.end_of_life = state.data.end_of_life;
      }
    },
    addProducts: (state, action: PayloadAction<MarketplaceProducts2[]>) => {
      state.products = action.payload;
    },
    filterByBrand: (state, action: PayloadAction<string>) => {
      if (action.payload === "Apple") {
        state.in_stock = state.in_stock.filter(
          (dev) =>
            dev.name.toLowerCase().includes("mac") ||
            dev.name.toLowerCase().includes("apple")
        );
        state.pending = state.pending.filter(
          (dev) =>
            dev.name.toLowerCase().includes("mac") ||
            dev.name.toLowerCase().includes("apple")
        );
        state.deployed = state.deployed.filter(
          (dev) =>
            dev.name.toLowerCase().includes("mac") ||
            dev.name.toLowerCase().includes("apple")
        );
        state.end_of_life = state.end_of_life.filter(
          (dev) =>
            dev.name.toLowerCase().includes("mac") ||
            dev.name.toLowerCase().includes("apple")
        );
      } else {
        state.in_stock = state.in_stock.filter((dev) =>
          dev.name.toLowerCase().includes(action.payload.toLowerCase())
        );
        state.pending = state.pending.filter((dev) =>
          dev.name.toLowerCase().includes(action.payload.toLowerCase())
        );
        state.deployed = state.deployed.filter((dev) =>
          dev.name.toLowerCase().includes(action.payload.toLowerCase())
        );
        state.end_of_life = state.end_of_life.filter((dev) =>
          dev.name.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    resetInventory: (state) => {
      state.pending = state.data.pending;
      state.in_stock = state.data.in_stock;
      state.deployed = state.data.deployed;
      state.end_of_life = state.data.end_of_life;
      state.filteredPage = -1;
      state.filteredDevices = [];
      state.search_text = "";
    },
    setNewInventory: (state, action: PayloadAction<InventorySummary[]>) => {
      //state.devices = action.payload;
      let common_devices: any[] = [];
      let common_device_names: string[] = [];
      // let locations: string[] = [];
      if (action.payload) {
        action.payload.forEach((d) => {
          let device_index = common_device_names.indexOf(d.name);
          if (device_index < 0) {
            common_device_names.push(d.name);
            let devices_w_locations = d.serial_numbers.map((dsn) => {
              let map_obj: any = { ...dsn, location: d.location, id: d.id };
              if (d.entity) {
                map_obj.entity = d.entity;
              }
              return map_obj;
            });
            common_devices.push({
              ...d,
              serial_numbers: devices_w_locations,
              locations: [d.location],
            });
          } else {
            let devices_w_locations = d.serial_numbers.map((dsn) => {
              let map_obj: any = { ...dsn, location: d.location, id: d.id };
              if (d.entity) {
                map_obj.entity = d.entity;
              }
              return map_obj;
            });

            common_devices[device_index].serial_numbers = [
              ...common_devices[device_index].serial_numbers,
              ...devices_w_locations,
            ];

            common_devices[device_index].locations.push(d.location);
          }
        });
      }

      state.devices = common_devices;
    },
    filterInventory: (state, action: PayloadAction<string>) => {
      const search_text = action.payload.toLowerCase();
      state.search_text = search_text;
      const page_0 = state.devices.filter(
        (d) =>
          d.name.toLowerCase().includes(search_text) ||
          d.location.toLowerCase().includes(search_text)
      );

      if (page_0.length > 0) {
        state.filteredPage = 0;
        state.filteredDevices = page_0;
      } else {
        const page_1 = state.devices.filter(
          (d) =>
            d.serial_numbers.filter(
              (s) =>
                s.sn.toLowerCase().includes(search_text) ||
                s.full_name?.toLowerCase().includes(search_text)
            ).length > 0
        );
        state.filteredDevices = page_1;
        state.filteredPage = 1;
      }
    },
    inventoryFilterByEntity: (state, action: PayloadAction<string>) => {
      if (action.payload !== "") {
        state.filteredPage = 0;
        const entity_devices = state.devices.filter(
          (d) => d.entity === action.payload
        );
        state.filteredDevices = entity_devices;
      } else {
        state.filteredPage = -1;
        state.filteredDevices = [];
      }
    },
  },
});

export const {
  setInventory,
  filterInventoryByEntity,
  addProducts,
  filterByBrand,
  resetInventory,
  setNewInventory,
  filterInventory,
  inventoryFilterByEntity,
} = inventorySlice.actions;

export default inventorySlice.reducer;
