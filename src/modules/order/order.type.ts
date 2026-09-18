export interface OrderAttributes {
  id: number;
  userId: number;
  address: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
}