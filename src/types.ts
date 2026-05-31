/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isBestseller: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  type: 'delivery' | 'takeaway' | 'dinein';
  address: string;
  instructions: string;
  couponCode: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid';
  status: 'received' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  pointsEarned: number;
  pointsRedeemed: number;
}

export interface UserAccount {
  email: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  addresses: string[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  dish: string;
  date: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  bannerImage: string;
  upiId: string;
  paymentNumber: string;
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
}

export interface StoreConfig {
  gstPercent: number;
  deliveryFeeUnder500: number;
  loyaltyPointValue: number;
}


