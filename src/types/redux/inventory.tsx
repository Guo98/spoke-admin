import {
  InventorySummary,
  MarketplaceProducts,
} from "../../interfaces/inventory";

interface InitialInventoryState {
  data: InventorySummary[];
  pending: InventorySummary[];
  deployed: InventorySummary[];
  in_stock: InventorySummary[];
  products: MarketplaceProducts[];
}

const UpdateInventoryAction: string = "UpdateInventory";

export default InitialInventoryState;
export { UpdateInventoryAction };
