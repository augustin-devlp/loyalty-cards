import type { OrderStatus } from "./constants";

export type OrderRow = {
  id: string;
  restaurant_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  requested_pickup_time: string | null;
  status: OrderStatus;
  total_amount: string | number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Delivery
  fulfillment_type?: "pickup" | "delivery";
  delivery_address?: string | null;
  delivery_postal_code?: string | null;
  delivery_city?: string | null;
  delivery_floor_door?: string | null;
  delivery_instructions?: string | null;
  delivery_fee?: string | number | null;
  payer_phone?: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name_snapshot: string;
  item_price_snapshot: string | number;
  quantity: number;
  selected_options: { group: string; name: string; extra_price: number }[];
  subtotal: string | number;
  notes: string | null;
};

export type OrderStatusHistoryRow = {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_at: string;
  changed_by: string | null;
};

export type OrderWithItems = OrderRow & {
  items: OrderItemRow[];
};

export type MenuCategoryRow = {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  icon: string | null;
};

export type MenuItemRow = {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string | number;
  image_url: string | null;
  is_available: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  has_options: boolean;
  display_order: number;
};

export type MenuItemOptionRow = {
  id: string;
  item_id: string;
  option_group: string;
  option_name: string;
  extra_price: string | number;
  is_required: boolean;
  max_selections: number;
  display_order: number;
};

export type RestaurantRow = {
  id: string;
  slug: string;
  name: string;
  business_id: string | null;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
  order_min_amount: string | number;
  order_open_time: string;
  order_close_time: string;
  prep_time_minutes: number;
  accepting_orders: boolean;
  notification_sound: boolean;
};
