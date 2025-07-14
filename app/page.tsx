"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Mic,
  Camera,
  ShoppingCart,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VoiceSearch } from "@/components/voice-search";
import { ImageSearch } from "@/components/image-search";
import { ProductModal } from "@/components/product-modal";
import { ProductFilters } from "@/components/product-filters";
import {
  apiClient,
  type ApiProduct,
  type ProductFilters as FilterType,
} from "@/lib/api-client";

// Convert API product to our internal format
const convertApiProduct = (apiProduct: ApiProduct) => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description || "",
  price: apiProduct.price,
  image: apiProduct.image_url,
  category: apiProduct.category || "",
  brand: apiProduct.category || "Unknown",
  rating: 4.5, // Default rating since API doesn't provide it
  reviews: Math.floor(Math.random() * 1000) + 100, // Mock reviews
  tags: [
    apiProduct.category,
    apiProduct.product_type,
    apiProduct.colour,
  ].filter(Boolean) as string[],
});

export default function EcommercePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"text" | "voice" | "image">(
    "text"
  );
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total_items: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    page_size: 20,
    sort_by: "name",
    sort_order: "asc",
  });

  const loadProducts = async (newFilters: FilterType = filters) => {
    setLoading(true);
    try {
      const response = await apiClient.getProducts(newFilters);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      const newFilters = {
        ...filters,
        search: searchQuery || undefined,
        page: 1,
      };
      setFilters(newFilters);
      loadProducts(newFilters);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    loadProducts(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterType = {
      page: 1,
      page_size: 20,
      sort_by: "name",
      sort_order: "asc",
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    loadProducts(clearedFilters);
  };

  const handleVoiceSearch = (transcript: string) => {
    setSearchQuery(transcript);
    setSearchMode("voice");
    setIsVoiceSearchOpen(false);
  };

  const handleImageSearch = async (imageFile: File) => {
    try {
      setLoading(true);
      const results = await apiClient.searchByImage(imageFile);
      setProducts(results);
      setSearchMode("image");
      setIsImageSearchOpen(false);
      // setSearchQuery(`Tìm kiếm bằng hình ảnh: ${imageFile.name}`)
      // Reset pagination for image search
      setPagination({
        page: 1,
        page_size: results.length,
        total_items: results.length,
        total_pages: 1,
        has_next: false,
        has_previous: false,
      });
    } catch (error) {
      console.error("Image search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortValue: string) => {
    const [sort_by, sort_order] = sortValue.split("-") as [
      string,
      "asc" | "desc"
    ];
    const newFilters = { ...filters, sort_by, sort_order, page: 1 };
    setFilters(newFilters);
    loadProducts(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    loadProducts(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">SnapFind</h1>
              <Badge variant="secondary" className="hidden lg:block">AI-Powered Search</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Giỏ hàng (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsVoiceSearchOpen(true)}
                className="shrink-0"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsImageSearchOpen(true)}
                className="shrink-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Mode Indicator */}
            <div className="flex items-center justify-between text-sm text-gray-600 flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span>Chế độ tìm kiếm:</span>
                <Badge
                  variant={searchMode === "text" ? "default" : "secondary"}
                >
                  {searchMode === "text" && "Văn bản"}
                  {searchMode === "voice" && "Giọng nói"}
                  {searchMode === "image" && "Hình ảnh"}
                </Badge>
                <span>•</span>
                <span>{pagination.total_items} sản phẩm</span>
              </div>

              <Select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                  <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                  <SelectItem value="created_at-desc">Mới nhất</SelectItem>
                  <SelectItem value="popularity-desc">Phổ biến nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isLoading={loading}
            />
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mb-4 bg-transparent"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ProductFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    isLoading={loading}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                    </CardContent>
                    <CardFooter className="p-4">
                      <div className="w-full space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => {
                    const convertedProduct = convertApiProduct(product);
                    return (
                      <Card
                        key={product.id}
                        className="group cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-0">
                          <div className="aspect-square relative overflow-hidden rounded-t-lg">
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onClick={() =>
                                setSelectedProduct(convertedProduct)
                              }
                            />
                            {!product.in_stock && (
                              <Badge className="absolute top-2 left-2 bg-red-500">
                                Hết hàng
                              </Badge>
                            )}
                            {product.similarity_score && (
                              <Badge className="absolute top-2 right-2 bg-blue-500">
                                {Math.round(product.similarity_score * 100)}%
                                khớp
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4">
                          <div className="w-full">
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < 4
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 ml-1">
                                (100+)
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-lg text-red-600">
                                {product.price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {product.category && (
                                <Badge variant="outline" className="text-xs">
                                  {product.category}
                                </Badge>
                              )}
                              {product.colour && (
                                <Badge variant="outline" className="text-xs">
                                  {product.colour}
                                </Badge>
                              )}
                            </div>
                            <Button
                              className="w-full"
                              size="sm"
                              onClick={() =>
                                setSelectedProduct(convertedProduct)
                              }
                              disabled={!product.in_stock}
                            >
                              {product.in_stock ? "Xem chi tiết" : "Hết hàng"}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.has_previous}
                    >
                      Trước
                    </Button>

                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, pagination.total_pages))].map(
                        (_, i) => {
                          const pageNum = Math.max(1, pagination.page - 2) + i;
                          if (pageNum > pagination.total_pages) return null;

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pageNum === pagination.page
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.has_next}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm">
                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Voice Search Modal */}
      <VoiceSearch
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onResult={handleVoiceSearch}
      />

      {/* Image Search Modal */}
      <ImageSearch
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
        onResult={handleImageSearch}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
