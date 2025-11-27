import { BookOpen, Package, DollarSign, TrendingUp } from 'lucide-react';
import { mockBooks } from '../../data/mockBooks';
import { mockOrders } from '../../data/mockOrders';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function DashboardOverview() {
  const totalBooks = mockBooks.length;
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalStock = mockBooks.reduce((sum, book) => sum + book.stockQuantity, 0);

  const recentOrders = mockOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lowStockBooks = mockBooks
    .filter(book => book.stockQuantity < 20)
    .sort((a, b) => a.stockQuantity - b.stockQuantity)
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your bookstore admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{totalBooks}</div>
            <p className="text-muted-foreground">In catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{totalOrders}</div>
            <p className="text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-muted-foreground">Total sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{totalStock}</div>
            <p className="text-muted-foreground">Units available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p>{order.id}</p>
                    <p className="text-muted-foreground">{order.userName}</p>
                  </div>
                  <div className="text-right">
                    <p>${order.totalPrice.toFixed(2)}</p>
                    <p className="text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockBooks.length > 0 ? (
                lowStockBooks.map(book => (
                  <div key={book.id} className="flex items-center justify-between">
                    <div>
                      <p>{book.title}</p>
                      <p className="text-muted-foreground">{book.authors.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600">{book.stockQuantity} left</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">All books have sufficient stock</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
