// Type definitions for inventory management system

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category_id: string;
  category_name: string;
  supplier_id: string;
  supplier_name: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  selling_price: number;
  reorder_level: number;
  reorder_quantity: number;
  location: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'transfer';
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  total_amount: number;
  reference_number: string;
  notes?: string;
  transaction_date: string;
  created_by: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string;
  expected_delivery_date: string;
  status: 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  total_amount: number;
  payment_status: 'pending' | 'partial' | 'paid';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
}

export interface Batch {
  id: string;
  item_id: string;
  batch_number: string;
  quantity: number;
  warehouse: string;
  location: string;
  received_date: string;
  expiry_date?: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock' | 'Reserved';
  cost_per_unit: number;
  supplier_id: string;
  supplier_name: string;
  purchase_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  batch_id?: string;
  quantity: number;
  from_location?: string;
  to_location?: string;
  movement_type: 'receipt' | 'issue' | 'transfer' | 'adjustment';
  reference_number?: string;
  reason?: string;
  movement_date: string;
  created_by: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  order_date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'partial' | 'paid';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch_id?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'staff';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}