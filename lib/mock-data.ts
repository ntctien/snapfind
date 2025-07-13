export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  brand: string
  rating: number
  reviews: number
  variants?: string[]
  tags: string[]
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB",
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp và thiết kế titan cao cấp. Màn hình Super Retina XDR 6.7 inch với ProMotion.",
    price: 29990000,
    originalPrice: 34990000,
    discount: 15,
    image: "/placeholder.svg?height=400&width=400",
    category: "Điện thoại",
    brand: "Apple",
    rating: 4.8,
    reviews: 1250,
    variants: ["Titan Tự Nhiên", "Titan Xanh", "Titan Trắng", "Titan Đen"],
    tags: ["smartphone", "apple", "iphone", "cao cấp", "camera", "titan"],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    description:
      "Galaxy S24 Ultra với S Pen tích hợp, camera 200MP và AI thông minh. Màn hình Dynamic AMOLED 2X 6.8 inch cùng hiệu năng Snapdragon 8 Gen 3.",
    price: 26990000,
    originalPrice: 30990000,
    discount: 13,
    image: "/placeholder.svg?height=400&width=400",
    category: "Điện thoại",
    brand: "Samsung",
    rating: 4.7,
    reviews: 890,
    variants: ["Titan Gray", "Titan Black", "Titan Violet"],
    tags: ["smartphone", "samsung", "galaxy", "s pen", "camera", "android"],
  },
  {
    id: "3",
    name: "MacBook Air M3 13 inch",
    description:
      "MacBook Air với chip M3 mới nhất, hiệu năng vượt trội và thời lượng pin lên đến 18 giờ. Thiết kế mỏng nhẹ với màn hình Liquid Retina 13.6 inch.",
    price: 27990000,
    image: "/placeholder.svg?height=400&width=400",
    category: "Laptop",
    brand: "Apple",
    rating: 4.9,
    reviews: 567,
    variants: ["Midnight", "Starlight", "Silver", "Space Gray"],
    tags: ["laptop", "macbook", "apple", "m3", "mỏng nhẹ", "học tập", "văn phòng"],
  },
  {
    id: "4",
    name: "Dell XPS 13 Plus",
    description:
      "Laptop Dell XPS 13 Plus với thiết kế premium, màn hình InfinityEdge 13.4 inch và bàn phím cảm ứng hiện đại. Hiệu năng Intel Core i7 thế hệ 12.",
    price: 35990000,
    image: "/placeholder.svg?height=400&width=400",
    category: "Laptop",
    brand: "Dell",
    rating: 4.6,
    reviews: 234,
    variants: ["Graphite", "Platinum"],
    tags: ["laptop", "dell", "xps", "premium", "intel", "ultrabook", "doanh nhân"],
  },
  {
    id: "5",
    name: "Sony WH-1000XM5",
    description:
      "Tai nghe chống ồn hàng đầu với công nghệ V1 processor và 8 microphone. Thời lượng pin 30 giờ và chất lượng âm thanh Hi-Res Audio.",
    price: 7990000,
    originalPrice: 8990000,
    discount: 11,
    image: "/placeholder.svg?height=400&width=400",
    category: "Tai nghe",
    brand: "Sony",
    rating: 4.8,
    reviews: 1456,
    variants: ["Đen", "Bạc"],
    tags: ["tai nghe", "sony", "chống ồn", "bluetooth", "hi-res", "âm thanh"],
  },
  {
    id: "6",
    name: "AirPods Pro 2nd Gen",
    description:
      "AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động nâng cao và Spatial Audio. Case sạc MagSafe với loa tìm kiếm tích hợp.",
    price: 5990000,
    image: "/placeholder.svg?height=400&width=400",
    category: "Tai nghe",
    brand: "Apple",
    rating: 4.7,
    reviews: 2341,
    tags: ["tai nghe", "apple", "airpods", "true wireless", "chống ồn", "spatial audio"],
  },
  {
    id: "7",
    name: "iPad Pro 12.9 inch M2",
    description:
      "iPad Pro với chip M2 mạnh mẽ, màn hình Liquid Retina XDR 12.9 inch và hỗ trợ Apple Pencil thế hệ 2. Lý tưởng cho sáng tạo và làm việc chuyên nghiệp.",
    price: 25990000,
    originalPrice: 28990000,
    discount: 10,
    image: "/placeholder.svg?height=400&width=400",
    category: "Máy tính bảng",
    brand: "Apple",
    rating: 4.8,
    reviews: 678,
    variants: ["Silver", "Space Gray"],
    tags: ["ipad", "apple", "tablet", "m2", "sáng tạo", "apple pencil", "pro"],
  },
  {
    id: "8",
    name: "Samsung Galaxy Tab S9 Ultra",
    description:
      "Máy tính bảng Android cao cấp với màn hình Dynamic AMOLED 2X 14.6 inch, S Pen đi kèm và hiệu năng Snapdragon 8 Gen 2 for Galaxy.",
    price: 23990000,
    image: "/placeholder.svg?height=400&width=400",
    category: "Máy tính bảng",
    brand: "Samsung",
    rating: 4.6,
    reviews: 345,
    variants: ["Graphite", "Beige"],
    tags: ["tablet", "samsung", "galaxy tab", "s pen", "android", "màn hình lớn"],
  },
  {
    id: "9",
    name: "Apple Watch Series 9",
    description:
      "Apple Watch Series 9 với chip S9 SiP, màn hình Retina Always-On sáng hơn và tính năng Double Tap mới. Theo dõi sức khỏe toàn diện.",
    price: 8990000,
    image: "/placeholder.svg?height=400&width=400",
    category: "Đồng hồ thông minh",
    brand: "Apple",
    rating: 4.7,
    reviews: 1123,
    variants: ["Pink", "Midnight", "Starlight", "Silver", "Product Red"],
    tags: ["smartwatch", "apple watch", "sức khỏe", "thể thao", "double tap"],
  },
  {
    id: "10",
    name: "Samsung Galaxy Watch6 Classic",
    description:
      "Đồng hồ thông minh Samsung với thiết kế cổ điển, vòng xoay Rotating Bezel và theo dõi sức khỏe nâng cao. Tương thích với Android và iOS.",
    price: 6990000,
    originalPrice: 7990000,
    discount: 13,
    image: "/placeholder.svg?height=400&width=400",
    category: "Đồng hồ thông minh",
    brand: "Samsung",
    rating: 4.5,
    reviews: 567,
    variants: ["Black", "Silver"],
    tags: ["smartwatch", "samsung", "galaxy watch", "rotating bezel", "cổ điển"],
  },
  {
    id: "11",
    name: "Canon EOS R6 Mark II",
    description:
      "Máy ảnh mirrorless full-frame với cảm biến 24.2MP, quay video 4K 60p và hệ thống lấy nét Dual Pixel CMOS AF II nhanh chóng.",
    price: 45990000,
    image: "/placeholder.svg?height=400&width=400",
    category: "Máy ảnh",
    brand: "Canon",
    rating: 4.9,
    reviews: 234,
    tags: ["máy ảnh", "canon", "mirrorless", "full frame", "4k", "chuyên nghiệp"],
  },
  {
    id: "12",
    name: "Sony Alpha A7 IV",
    description:
      "Máy ảnh mirrorless full-frame 33MP với khả năng quay video 4K, chống rung 5 trục và pin có thời lượng sử dụng lâu.",
    price: 52990000,
    originalPrice: 56990000,
    discount: 7,
    image: "/placeholder.svg?height=400&width=400",
    category: "Máy ảnh",
    brand: "Sony",
    rating: 4.8,
    reviews: 189,
    tags: ["máy ảnh", "sony", "alpha", "mirrorless", "full frame", "chống rung"],
  },
]
