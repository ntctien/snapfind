"use client";

import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { apiClient, type ProductFilters } from "@/lib/api-client";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const COLOR_MAP: Record<string, string> = { 
  Beige: "#F5F5DC",
  Black: "#000000",
  Blue: "#0066CC",
  Bronze: "#CD7F32",
  Brown: "#8B4513",
  Charcoal: "#36454F",
  Copper: "#B87333",
  Cream: "#FFFDD0",
  Gold: "#FFD700",
  Green: "#00CC00",
  Grey: "#808080",
  "Grey Melange": "#A9A9A9",
  Khaki: "#F0E68C",
  Lavender: "#E6E6FA",
  "Lime Green": "#32CD32",
  Magenta: "#FF00FF",
  Maroon: "#800000",
  Multi: "#CCCCCC",
  "Mushroom Brown": "#B19975",
  Mustard: "#FFDB58",
  "Navy Blue": "#000080",
  Nude: "#FAD6BF",
  "Off White": "#FAF9F6",
  Olive: "#808000",
  Orange: "#FF8C00",
  Peach: "#FFE5B4",
  Pink: "#FF69B4",
  Purple: "#800080",
  Red: "#CC0000",
  Rust: "#B7410E",
  "Sea Green": "#2E8B57",
  Silver: "#C0C0C0",
  Tan: "#D2B48C",
  Taupe: "#483C32",
  Teal: "#008080",
  "Turquoise Blue": "#00CED1",
  White: "#FFFFFF",
  Yellow: "#FFCC00",
  Gray: "#808080",
  Navy: "#000080"
};

export function ProductFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading,
}: ProductFiltersProps) {
  const [genders, setGenders] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [colours, setColours] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    gender: true,
    category: true,
    productType: true,
    colour: true,
    stock: true,
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [gendersData, productTypesData, coloursData, categoriesData] =
          await Promise.all([
            apiClient.getGenders(),
            apiClient.getProductTypes(),
            apiClient.getColours(),
            apiClient.getCategories(),
          ]);

        setGenders(gendersData);
        setProductTypes(productTypesData);
        setColours(coloursData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load filter options:", error);
      }
    };

    loadFilterOptions();
  }, []);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.gender) count++;
    if (filters.category) count++;
    if (filters.product_type) count++;
    if (filters.colour) count++;
    if (filters.min_price) count++;
    if (filters.max_price) count++;
    if (filters.in_stock !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <Filter className="h-5 w-5" />
            <span className="lg:text-xl text-base">Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Xóa tất cả
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={`space-y-4 ${!isExpanded ? "hidden lg:block" : ""}`}
      >
        {/* Price Range */}
        <Collapsible
          open={expandedSections.price}
          onOpenChange={() => toggleSection("price")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
            >
              <Label className="font-medium">Khoảng giá</Label>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-price" className="text-xs text-gray-600">
                  Từ
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={filters.min_price || ""}
                  onChange={(e) =>
                    updateFilter(
                      "min_price",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-xs text-gray-600">
                  Đến
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="∞"
                  value={filters.max_price || ""}
                  onChange={(e) =>
                    updateFilter(
                      "max_price",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-8"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Gender Filter */}
        <Collapsible
          open={expandedSections.gender}
          onOpenChange={() => toggleSection("gender")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
            >
              <Label className="font-medium">Giới tính</Label>
              {expandedSections.gender ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Select
              value={filters.gender || "all"}
              onValueChange={(value) =>
                updateFilter("gender", value || undefined)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        {/* <Separator /> */}

        {/* Category Filter */}
        {/* <Collapsible open={expandedSections.category} onOpenChange={() => toggleSection("category")}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <Label className="font-medium">Danh mục</Label>
              {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => updateFilter("category", value || undefined)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible> */}

        <Separator />

        {/* Product Type Filter */}
        <Collapsible
          open={expandedSections.productType}
          onOpenChange={() => toggleSection("productType")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
            >
              <Label className="font-medium">Loại sản phẩm</Label>
              {expandedSections.productType ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Select
              value={filters.product_type || "all"}
              onValueChange={(value) =>
                updateFilter("product_type", value || undefined)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Chọn loại sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Color Filter */}
        <Collapsible
          open={expandedSections.colour}
          onOpenChange={() => toggleSection("colour")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
            >
              <Label className="font-medium">Màu sắc</Label>
              {expandedSections.colour ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-6 gap-3 w-fit place-items-start">
              {colours.map((colour) => (
                <button
                  key={colour}
                  onClick={() =>
                    updateFilter(
                      "colour",
                      filters.colour === colour ? undefined : colour
                    )
                  }
                  className={`relative w-6 h-6 rounded-full border-2 transition-all ${
                    filters.colour === colour
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    backgroundColor: COLOR_MAP[colour] || "#CCCCCC",
                    border:
                      colour === "White" ? "2px solid #E5E7EB" : undefined,
                  }}
                  title={colour}
                >
                  {filters.colour === colour && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          colour === "White" ||
                          colour === "Yellow" ||
                          colour === "Beige"
                            ? "bg-gray-800"
                            : "bg-white"
                        }`}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {/* {filters.colour && (
              <div className="mt-2 text-center">
                <Badge variant="secondary" className="text-xs">
                  {filters.colour}
                </Badge>
              </div>
            )} */}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Stock Filter */}
        <Collapsible
          open={expandedSections.stock}
          onOpenChange={() => toggleSection("stock")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
            >
              <Label className="font-medium">Tình trạng</Label>
              {expandedSections.stock ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.in_stock === true}
                onCheckedChange={(checked) =>
                  updateFilter("in_stock", checked ? true : undefined)
                }
              />
              <Label htmlFor="in-stock" className="text-sm">
                Chỉ hiển thị sản phẩm còn hàng
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
