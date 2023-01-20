import { InventorySummary } from "../../interfaces/inventory";

interface InitialInventoryState {
  data: InventorySummary[];
  pending: InventorySummary[];
  deployed: InventorySummary[];
  in_stock: InventorySummary[];
}

const UpdateInventoryAction: string = "UpdateInventory";

export default InitialInventoryState;
export { UpdateInventoryAction };
