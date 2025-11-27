import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';
import { mockOrders } from '../data/mockOrders';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userOrders = useMemo(() => {
    return mockOrders
      .filter(order => order.userId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user?.id]);

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="mb-4">No orders yet</h2>
          <p className="text-muted-foreground mb-8">
            Start shopping to see your orders here
          </p>
          <Button onClick={() => navigate('/')}>Browse Books</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="mb-8">My Orders</h1>

        <div className="space-y-6">
          {userOrders.map(order => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Order {order.id}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p>{item.bookTitle}</p>
                          <p className="text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Payment:</span>
                    <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
