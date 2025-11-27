import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Package, Users, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ManageBooks } from './admin/ManageBooks';
import { ManageOrders } from './admin/ManageOrders';
import { DashboardOverview } from './admin/DashboardOverview';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/admin' },
    { id: 'books', label: 'Manage Books', icon: BookOpen, path: '/admin/books' },
    { id: 'orders', label: 'Manage Orders', icon: Package, path: '/admin/orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span>Admin Panel</span>
          </div>
          <p className="text-muted-foreground">{user?.name}</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveTab(item.id)}
              >
                <Button
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/books" element={<ManageBooks />} />
          <Route path="/orders" element={<ManageOrders />} />
        </Routes>
      </main>
    </div>
  );
}
