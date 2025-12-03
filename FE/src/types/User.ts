export interface User {
  _id?: string;
  id?: string;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  role: "admin" | "user";
  isActive?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
