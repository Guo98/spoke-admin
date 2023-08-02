import {
  InventorySummary,
  MarketplaceProducts2,
} from "../../interfaces/inventory";

interface InitialInventoryState {
  data: {
    in_stock: InventorySummary[];
    pending: InventorySummary[];
    deployed: InventorySummary[];
  };
  pending: InventorySummary[];
  deployed: InventorySummary[];
  in_stock: InventorySummary[];
  products: MarketplaceProducts2[];
  brands: string[];
}

const UpdateInventoryAction: string = "UpdateInventory";

export default InitialInventoryState;
export { UpdateInventoryAction };
