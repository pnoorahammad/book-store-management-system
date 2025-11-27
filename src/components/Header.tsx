import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span>BookStore</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <div>{user?.name}</div>
                    <div className="text-muted-foreground">{user?.email}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  My Orders
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
