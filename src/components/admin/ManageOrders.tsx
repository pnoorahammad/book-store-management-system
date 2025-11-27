import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { mockOrders, updateOrderStatus } from '../../data/mockOrders';
import { Order } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function ManageOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredOrders = orders.filter(
    order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setOrders([...mockOrders]);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    toast.success('Order status updated');
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1>Manage Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{deliveredOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p>{order.id}</p>
                    <p className="text-muted-foreground">{order.userName}</p>
                    <p className="text-muted-foreground">{order.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-2">${order.totalPrice.toFixed(2)}</p>
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) =>
                        handleUpdateStatus(order.id, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>View complete order information</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Order ID</p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <Badge className={statusColors[selectedOrder.status]}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Customer</p>
                  <p>{selectedOrder.userName}</p>
                  <p className="text-muted-foreground">{selectedOrder.userEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Order Date</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p>{item.bookTitle}</p>
                        <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Total</span>
                <span>${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Payment Status</p>
                <Badge variant={selectedOrder.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                  {selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                    selectedOrder.paymentStatus.slice(1)}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
