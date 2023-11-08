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
  hide_out_of_stock?: boolean;
  marketplace?: any;
  brand?: string;
  locations?: string[];
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
  supplier?: string;
  supplier_order_no?: string;
  full_name?: string;
  warehouse?: string;
}

export interface MarketplaceProducts {
  id: string;
  brand: {
    [key: string]: {
      name: string;
      types?: {
        [key: string]: {
          specs: DeviceSpecs[];
          colors: string[];
          clients: string[];
        };
      };
      imgSrc: string;
      clients: string[];
    };
  };
  imgSrc: string;
  hide: boolean;
}

interface DeviceSpecs {
  spec: string;
  clients: [
    {
      client: string;
      locations: string[];
    }
  ];
}

export interface MarketplaceProducts2 {
  id: string;
  item_type: string;
  client: string;
  brands: [
    {
      brand: string;
      types: [
        {
          type: string;
          specs: [
            {
              spec: string;
              locations: string[];
            }
          ];
          colors: string[];
        }
      ];
      imgSrc: string;
    }
  ];
  imgSrc: string;
  hide?: boolean;
  suppliers?: any;
}
