export interface OrdersSummary {
  in_progress?: Order[];
  completed?: Order[];
}

export interface Order {
  orderId: string;
  items: Item[];
  orderNo: any;
  firstName: string;
  lastName: string;
  address: {
    city: string;
    country: string;
    subdivision: string;
    formatted: string;
  };
  email: string;
  phone: string;
  client: string;
  note?: string;
  price: number;
  full_name: string;
  date: number;
  shipping_status: string;
  id: string;
  entity?: string;
}

export interface Item {
  name: string;
  price: number;
  variant?: Variant[];
  quantity: number;
  supplier: string;
  tracking_number: string[] | string;
  type?: string;
  courier?: string;
  serial_number?: string;
  date_shipped?: string;
  delivery_status?: string;
  laptop_name?: string;
  spoke_fee?: number;
}

interface Variant {
  option: string;
  selection: string;
}
