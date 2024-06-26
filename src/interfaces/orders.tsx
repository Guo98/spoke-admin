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
    addressLine?: string;
    postalCode?: string;
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
  type?: string;
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
  shipment_id?: string;
  date_reminder_sent?: string;
}

interface Variant {
  option: string;
  selection: string;
}
