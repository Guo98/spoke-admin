export interface InventorySummary {
  name: string;
  serial_numbers: SerialNumbers[];
  location: string;
  sku?: string;
  setFilters?: Function;
  index?: number;
  image_source?: string;
  type?: string;
  specs?: {
    screen_size: string;
    ram: string;
    hard_drive: string;
    cpu: string;
    gpu?: string;
  };
  hidden?: boolean;
  new_device?: boolean;
  entity?: string;
  id: string;
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
  color?: string;
  date_deployed?: string;
  quantity?: number;
  tracking_number?: string;
  date_requested?: string;
}

export interface MarketplaceProducts {
  id: string;
  brand: {
    [key: string]: {
      name: string;
      types?: {
        [key: string]: { specs: string[]; colors: string[] };
      };
      imgSrc: string;
    };
  };
  imgSrc: string;
}
