import {
  InventorySummary,
  MarketplaceProducts2,
} from "../../interfaces/inventory";

interface InitialInventoryState {
  data: {
    in_stock: InventorySummary[];
    pending: InventorySummary[];
    deployed: InventorySummary[];
    end_of_life: InventorySummary[];
  };
  pending: InventorySummary[];
  deployed: InventorySummary[];
  in_stock: InventorySummary[];
  end_of_life: InventorySummary[];
  products: MarketplaceProducts2[];
  brands: string[];
  devices: InventorySummary[];
  filteredDevices: InventorySummary[];
  filtered: boolean;
  search_text: string;
  device_ids: {
    name: string;
    id: string;
    location: string;
    serial_numbers: string[];
  }[];
  current_inventory: InventorySummary[];
  serial_info: any;
}

const UpdateInventoryAction: string = "UpdateInventory";

export default InitialInventoryState;
export { UpdateInventoryAction };
