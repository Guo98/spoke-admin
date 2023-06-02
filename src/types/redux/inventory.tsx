import {
  InventorySummary,
  MarketplaceProducts2,
} from "../../interfaces/inventory";

interface InitialInventoryState {
  data: InventorySummary[];
  pending: InventorySummary[];
  deployed: InventorySummary[];
  in_stock: InventorySummary[];
  products: MarketplaceProducts2[];
}

const UpdateInventoryAction: string = "UpdateInventory";

export default InitialInventoryState;
export { UpdateInventoryAction };
