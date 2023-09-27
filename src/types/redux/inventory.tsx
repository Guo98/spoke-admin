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
}

const UpdateInventoryAction: string = "UpdateInventory";

export default InitialInventoryState;
export { UpdateInventoryAction };
