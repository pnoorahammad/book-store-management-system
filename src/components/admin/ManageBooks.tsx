import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { mockBooks } from '../../data/mockBooks';
import { Book } from '../../types';
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
import { Label } from '../ui/label';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export function ManageBooks() {
  const [books, setBooks] = useState(mockBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});

  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        authors: [],
        genre: '',
        isbn: '',
        price: 0,
        description: '',
        stockQuantity: 0,
        imageUrl: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBook(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.title || !formData.price || !formData.stockQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingBook) {
      // Update existing book
      setBooks(books.map(book => (book.id === editingBook.id ? { ...book, ...formData } : book)));
      toast.success('Book updated successfully');
    } else {
      // Add new book
      const newBook: Book = {
        id: String(Date.now()),
        title: formData.title!,
        authors: formData.authors || [],
        genre: formData.genre || '',
        isbn: formData.isbn || '',
        price: formData.price!,
        description: formData.description || '',
        stockQuantity: formData.stockQuantity!,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      };
      setBooks([...books, newBook]);
      toast.success('Book added successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id));
      toast.success('Book deleted successfully');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Manage Books</h1>
          <p className="text-muted-foreground">Add, edit, or remove books from your inventory</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Books List */}
      <div className="space-y-4">
        {filteredBooks.map(book => (
          <Card key={book.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <ImageWithFallback
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-1">{book.title}</h3>
                      <p className="text-muted-foreground mb-2">{book.authors.join(', ')}</p>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary">{book.genre}</Badge>
                        <Badge variant={book.stockQuantity > 0 ? 'default' : 'destructive'}>
                          {book.stockQuantity > 0
                            ? `${book.stockQuantity} in stock`
                            : 'Out of stock'}
                        </Badge>
                      </div>
                      <p className="text-green-600">${book.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(book)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            <DialogDescription>
              {editingBook ? 'Update book details' : 'Add a new book to your inventory'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authors">Authors (comma-separated)</Label>
              <Input
                id="authors"
                value={formData.authors?.join(', ') || ''}
                onChange={e =>
                  setFormData({ ...formData, authors: e.target.value.split(',').map(s => s.trim()) })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre || ''}
                  onChange={e => setFormData({ ...formData, genre: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn || ''}
                  onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stockQuantity || ''}
                  onChange={e =>
                    setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl || ''}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
