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
  description: string;
  price: number;
  turnaround_time: string;
}

export interface Order {
  id: number;
  customer_id: number;
  location_id: number;
  service_id: number;
  status: 'pending' | 'processing' | 'completed' | 'picked_up';
  weight: number;
  total_price: number;
  notes: string;
  drop_off_date: string;
  pickup_date: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  location?: Location;
  service?: Service;
} 