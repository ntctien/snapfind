import type { Product } from "./mock-data"

// Text search function
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products

  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0)

  return products
    .filter((product) => {
      const searchableText = [product.name, product.description, product.category, product.brand, ...product.tags]
        .join(" ")
        .toLowerCase()

      return searchTerms.every((term) => searchableText.includes(term))
    })
    .sort((a, b) => {
      // Sort by relevance - products with query in name first
      const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase())
      const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase())

      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1

      // Then by rating
      return b.rating - a.rating
    })
}

// Mock image search function - simulates vector similarity search
export async function searchByImage(products: Product[], imageFile: File): Promise<Product[]> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock image analysis - in reality, this would use ML models like CLIP
  const mockImageFeatures = await analyzeImage(imageFile)

  // Simulate vector similarity search
  const results = products
    .map((product) => ({
      product,
      similarity: calculateSimilarity(mockImageFeatures, product),
    }))
    .filter((result) => result.similarity > 0.3) // Threshold for relevance
    .sort((a, b) => b.similarity - a.similarity)
    .map((result) => result.product)

  return results.slice(0, 8) // Return top 8 similar products
}

// Mock image analysis function
async function analyzeImage(imageFile: File): Promise<ImageFeatures> {
  // In a real implementation, this would:
  // 1. Send image to ML model (like CLIP)
  // 2. Generate embeddings/features
  // 3. Extract product categories, colors, etc.

  const fileName = imageFile.name.toLowerCase()
  const fileType = imageFile.type

  // Mock feature extraction based on filename and type
  return {
    category: extractCategoryFromFilename(fileName),
    dominantColors: ["black", "white", "silver"], // Mock colors
    shape: "rectangular", // Mock shape
    embeddings: generateMockEmbeddings(), // Mock vector embeddings
  }
}

// Mock similarity calculation
function calculateSimilarity(imageFeatures: ImageFeatures, product: Product): number {
  let similarity = 0

  // Category matching
  if (imageFeatures.category && product.category.toLowerCase().includes(imageFeatures.category.toLowerCase())) {
    similarity += 0.4
  }

  // Tag matching
  const matchingTags = product.tags.filter(
    (tag) =>
      imageFeatures.category?.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(imageFeatures.category?.toLowerCase() || ""),
  )
  similarity += matchingTags.length * 0.1

  // Color matching (mock)
  const productColors = extractColorsFromProduct(product)
  const colorMatches = imageFeatures.dominantColors.filter((color) =>
    productColors.some((pColor) => pColor.includes(color) || color.includes(pColor)),
  )
  similarity += colorMatches.length * 0.15

  // Add some randomness to simulate real ML model variance
  similarity += (Math.random() - 0.5) * 0.2

  return Math.max(0, Math.min(1, similarity))
}

// Helper functions
function extractCategoryFromFilename(filename: string): string {
  if (filename.includes("phone") || filename.includes("iphone") || filename.includes("samsung")) {
    return "điện thoại"
  }
  if (filename.includes("laptop") || filename.includes("macbook")) {
    return "laptop"
  }
  if (filename.includes("headphone") || filename.includes("airpods")) {
    return "tai nghe"
  }
  if (filename.includes("watch")) {
    return "đồng hồ thông minh"
  }
  if (filename.includes("camera")) {
    return "máy ảnh"
  }
  if (filename.includes("tablet") || filename.includes("ipad")) {
    return "máy tính bảng"
  }

  return "electronics" // Default category
}

function extractColorsFromProduct(product: Product): string[] {
  const colors: string[] = []
  const text = (product.name + " " + product.description + " " + (product.variants?.join(" ") || "")).toLowerCase()

  const colorKeywords = [
    "black",
    "white",
    "silver",
    "gold",
    "blue",
    "red",
    "green",
    "pink",
    "purple",
    "yellow",
    "orange",
    "gray",
    "grey",
    "đen",
    "trắng",
    "bạc",
    "vàng",
    "xanh",
    "đỏ",
    "hồng",
    "tím",
    "xám",
  ]

  colorKeywords.forEach((color) => {
    if (text.includes(color)) {
      colors.push(color)
    }
  })

  return colors
}

function generateMockEmbeddings(): number[] {
  // Generate mock 512-dimensional embeddings
  return Array.from({ length: 512 }, () => Math.random() * 2 - 1)
}

// Types
interface ImageFeatures {
  category?: string
  dominantColors: string[]
  shape: string
  embeddings: number[]
}
