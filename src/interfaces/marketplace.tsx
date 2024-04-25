export interface ScrapedStockInfo {
  device_url: string;
  stock_level: string;
  est_price: string;
  image_source: string;
  scraped_specs: string;
  supplier: string;
  cdw_part_no?: string;
  scraped_name: string;
  price: string;
}

export interface OtherDeviceInfo {
  brand: string;
  line: string;
  specs: string;
}

export interface NewOrderRedux {
  brand: string;
  line: string;
  specs: string;
  location: string;
  color: string;
}
