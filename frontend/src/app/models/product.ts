export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
}
