import { Category, Product } from '../models/product';

// Datos locales temporales. En el tema 13 se reemplazan por la API .NET.
export const CATEGORIES: Category[] = [
  { id: 1, name: 'Electrónica' },
  { id: 2, name: 'Hogar' },
  { id: 3, name: 'Libros' },
];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Teclado mecánico', price: 59.9, stock: 25, categoryId: 1 },
  { id: 2, name: 'Lámpara LED', price: 19.5, stock: 4, categoryId: 2 },
  { id: 3, name: 'Clean Code', price: 34, stock: 0, categoryId: 3 },
];
