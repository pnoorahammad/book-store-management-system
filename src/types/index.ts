export interface Book {
  id: string;
  title: string;
  authors: string[];
  genre: string;
  isbn: string;
  price: number;
  description: string;
  stockQuantity: number;
  imageUrl: string;
  rating?: number;
  reviews?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  bookId: string;
  bookTitle: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}
