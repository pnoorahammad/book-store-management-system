import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Header } from './Header';
import { mockBooks } from '../data/mockBooks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(mockBooks.map(book => book.genre)));
    return ['all', ...uniqueGenres];
  }, []);

  const filteredBooks = useMemo(() => {
    return mockBooks.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4">Welcome to Our Bookstore</h1>
          <p className="text-xl mb-8">Discover your next favorite book from our curated collection</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Books */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Browse Books</h2>
            <p className="text-muted-foreground">
              Showing {paginatedBooks.length} of {filteredBooks.length} books
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={selectedGenre} onValueChange={(value) => {
              setSelectedGenre(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {paginatedBooks.map(book => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <Link to={`/books/${book.id}`}>
                  <ImageWithFallback
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">
                  {book.genre}
                </Badge>
                <Link to={`/books/${book.id}`}>
                  <h3 className="mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-2">
                  {book.authors.join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600">${book.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">
                    {book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={`/books/${book.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
