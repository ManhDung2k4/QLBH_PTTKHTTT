export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images?: string[];
  isActive: boolean;
  slug: string;
  brand: string; 
  category?: string;
  screen?: string; 
  os?: string; 
  camera?: string; 
  cameraFront?: string; 
  cpu?: string; 
  ram?: string; 
  rom?: string; 
  battery?: string; 
  sim?: string; 
  weight?: string; 
  colors?: string[]; 
}

export interface ProductForm {
  title: string;
  description: string;
  price: number | string;
  discountPercentage: number | string;
  rating: number | string;
  stock: number | string;
  thumbnail: string;
  images?: string[];
  isActive: boolean;
  slug: string;
  brand: string;
  category?: string;
  screen?: string;
  os?: string;
  camera?: string;
  cameraFront?: string;
  cpu?: string;
  ram?: string;
  rom?: string;
  battery?: string;
  sim?: string;
  weight?: string;
  colors?: string[];
}
