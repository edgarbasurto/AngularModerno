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

/** DTO de entrada para crear/editar: el servidor asigna el id. */
export type ProductDto = Omit<Product, 'id'>;
