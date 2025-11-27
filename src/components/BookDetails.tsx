import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { Header } from './Header';
import { mockBooks } from '../data/mockBooks';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const book = mockBooks.find(b => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Book not found</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (quantity > book.stockQuantity) {
      toast.error('Not enough stock available');
      return;
    }

    addToCart(book, quantity);
    toast.success(`Added ${quantity} ${quantity === 1 ? 'copy' : 'copies'} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div>
            <Card className="overflow-hidden">
              <ImageWithFallback
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-auto"
              />
            </Card>
          </div>

          {/* Book Details */}
          <div>
            <Badge variant="secondary" className="mb-2">
              {book.genre}
            </Badge>
            <h1 className="mb-4">{book.title}</h1>
            <p className="text-muted-foreground mb-4">
              by {book.authors.join(', ')}
            </p>

            {book.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {book.rating} ({book.reviews} reviews)
                </span>
              </div>
            )}

            <div className="mb-6">
              <div className="text-green-600 mb-2">${book.price.toFixed(2)}</div>
              <p className="text-muted-foreground">
                {book.stockQuantity > 0
                  ? `${book.stockQuantity} available in stock`
                  : 'Out of stock'}
              </p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="mb-2">Book Information</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>ISBN:</span>
                    <span>{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Genre:</span>
                    <span>{book.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Author(s):</span>
                    <span>{book.authors.join(', ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {book.stockQuantity > 0 && (
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-muted-foreground">Quantity:</label>
                  <Input
                    type="number"
                    min="1"
                    max={book.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20"
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full mb-4"
              onClick={handleAddToCart}
              disabled={book.stockQuantity === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {book.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            <div className="prose max-w-none">
              <h3>Description</h3>
              <p className="text-muted-foreground">{book.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
