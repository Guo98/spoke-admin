export interface InventorySummary {
  name: string;
  serial_numbers: SerialNumbers[];
  location: string;
  sku?: string;
  setFilters?: Function;
  index?: number;
  image_source?: string;
  type?: string;
}

interface SerialNumbers {
  sn: string;
  status: string;
  first_name?: string;
  last_name?: string;
  address?: {
    al1: string;
    al2?: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
  };
  events?: string[];
  email?: string;
  phone_number?: string;
  condition?: string;
  grade?: string;
}
