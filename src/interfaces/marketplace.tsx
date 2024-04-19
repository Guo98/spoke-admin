export interface ScrapedStockInfo {
  device_url: string;
  stock_level: string;
  est_price: string;
  image_source: string;
  scraped_specs: string;
  supplier: string;
  cdw_part_no?: string;
  scraped_name: string;
}
