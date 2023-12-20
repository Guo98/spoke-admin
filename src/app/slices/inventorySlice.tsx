import InitialInventoryState, {
  UpdateInventoryAction,
} from "../../types/redux/inventory";
import {
  InventorySummary,
  MarketplaceProducts2,
} from "../../interfaces/inventory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  filtered: false,
  search_text: "",
  device_ids: [],
  current_inventory: [],
  serial_info: {},
};

export const inventorySlice = createSlice({
  name: UpdateInventoryAction,
  initialState: initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<InventorySummary[]>) => {
      state.device_ids = [];
      state.current_inventory = action.payload;

      state.current_inventory.forEach((device) => {
        state.device_ids.push({
          name: device.name,
          id: device.id,
          location: device.location,
          serial_numbers: device.serial_numbers.map((s) => s.sn),
        });

        device.in_stock = [];
        device.deployed = [];
        device.pending = [];
        device.eol = [];

        device.serial_numbers.forEach((d) => {
          if (
            d.status === "In Stock" &&
            d.condition !== "Damaged" &&
            d.condition !== "End of Life"
          ) {
            device.in_stock!.push(d);
          } else if (d.status === "Deployed") {
            device.deployed!.push(d);
          } else if (
            d.status === "Offboarding" ||
            d.status === "Offboard" ||
            d.status === "Returning" ||
            d.status === "Top Up" ||
            d.status === "In Progress" ||
            d.status == "Shipping"
          ) {
            device.pending!.push(d);
          } else if (
            d.status === "In Stock" &&
            d.condition !== "Used" &&
            d.condition !== "New"
          ) {
            device.eol!.push(d);
          }
        });
      });
    },
    searchBySerial: (state, action: PayloadAction<any>) => {
      state.serial_info = action.payload;
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
      // state.filteredPage = -1;
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

      if (search_text !== "") {
        const filtered_devices = state.current_inventory.filter(
          (d) =>
            d.name.toLowerCase().includes(search_text) ||
            d.location.toLowerCase().includes(search_text) ||
            d.serial_numbers.filter(
              (s) =>
                s.sn.toLowerCase().includes(search_text) ||
                s.full_name?.toLowerCase().includes(search_text)
            ).length > 0
        );

        state.filteredDevices = filtered_devices;
        state.filtered = true;
      } else {
        state.filteredDevices = [];
        state.filtered = false;
      }
    },
    inventoryFilterByEntity: (state, action: PayloadAction<string>) => {
      if (action.payload !== "") {
        //state.filteredPage = 0;
        const entity_devices = state.current_inventory.filter(
          (d) => d.entity?.toLowerCase() === action.payload.toLowerCase()
        );
        state.filteredDevices = entity_devices;
        state.filtered = true;
      } else {
        //state.filteredPage = -1;
        state.filteredDevices = [];
        state.filtered = false;
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
  searchBySerial,
} = inventorySlice.actions;

export default inventorySlice.reducer;
