export interface OrderAttributes {
  id: number;
  userId: number;
  address: string;
  products:{productId:number; quantity:number; price:number}[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
}