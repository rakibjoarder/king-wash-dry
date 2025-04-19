export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  user_id?: string;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  type: string;
}

export interface OrderPreferences {
  waterTemperature: 'cold' | 'hot';
  dryingLevel: 'regular' | 'delicate';
  detergent: 'scented' | 'unscented' | 'hypoallergenic';
  additionalServices: {
    babyCare?: boolean;
    bleach?: boolean;
    darkProtect?: boolean;
    fabricSoftener?: boolean;
    scentBooster?: boolean;
    hangingService?: boolean;
  };
  specialInstructions?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  avg_weight?: number;
}

export interface Order {
  id: number;
  created_at: string;
  status: string;
  service_id: number;
  service?: Service;
  weight: number;
  notes?: string;
  drop_off_date: string;
  drop_off_time: string;
  pickup_requested: boolean;
  pickup_date?: string;
  pickup_time?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  total_price: number;
  tip_amount?: number;
  discount_amount?: number;
  promo_code?: string;
  items?: OrderItem[];
  preferences?: OrderPreferences;
} 