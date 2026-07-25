export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number;
  stock: number;
  brand: string;
  discountPercentage: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  phone: string;
  address?: {
    city: string;
    address: string;
  };
}
