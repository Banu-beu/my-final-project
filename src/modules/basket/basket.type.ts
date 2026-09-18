export interface BasketProduct {
  productId: number;
  quantity: number;
  price: number;
}

export interface BasketAttributes {
  id: number;
  userId: number;
  products: BasketProduct[];
  totalAmount: number;
}