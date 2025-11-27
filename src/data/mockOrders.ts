import { Order } from '../types';

export let mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '2',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    items: [
      {
        bookId: '1',
        bookTitle: 'The Great Gatsby',
        quantity: 1,
        price: 14.99,
      },
      {
        bookId: '3',
        bookTitle: '1984',
        quantity: 2,
        price: 13.99,
      },
    ],
    totalPrice: 42.97,
    status: 'delivered',
    paymentStatus: 'completed',
    createdAt: '2024-11-10T10:30:00Z',
    updatedAt: '2024-11-12T14:20:00Z',
  },
  {
    id: 'ORD-002',
    userId: '2',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    items: [
      {
        bookId: '6',
        bookTitle: 'The Hobbit',
        quantity: 1,
        price: 15.99,
      },
    ],
    totalPrice: 15.99,
    status: 'shipped',
    paymentStatus: 'completed',
    createdAt: '2024-11-13T09:15:00Z',
    updatedAt: '2024-11-14T11:30:00Z',
  },
];

export function addOrder(order: Order) {
  mockOrders.push(order);
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
  }
}
