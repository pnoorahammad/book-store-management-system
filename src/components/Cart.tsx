import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Header } from './Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { addOrder } from '../data/mockOrders';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const order = {
      id: `ORD-${Date.now()}`,
      userId: user!.id,
      userName: user!.name,
      userEmail: user!.email,
      items: cart.map(item => ({
        bookId: item.book.id,
        bookTitle: item.book.title,
        quantity: item.quantity,
        price: item.book.price,
      })),
      totalPrice,
      status: 'pending' as const,
      paymentStatus: 'completed' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    toast.success('Order placed successfully!');
    navigate('/orders');

    setIsProcessing(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some books to your cart to get started
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
        <h1 className="mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.book.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <ImageWithFallback
                      src={item.book.imageUrl}
                      alt={item.book.title}
                      className="w-24 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1">{item.book.title}</h3>
                      <p className="text-muted-foreground mb-2">
                        {item.book.authors.join(', ')}
                      </p>
                      <p className="text-green-600 mb-4">
                        ${item.book.price.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                            disabled={item.quantity >= item.book.stockQuantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.book.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
