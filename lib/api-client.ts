const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://gljs1111-8000.asse.devtunnels.ms"

export interface ApiProduct {
  id: string
  product_id: string
  name: string
  price: number
  image_url: string
  description?: string
  category?: string
  gender?: string
  sub_category?: string
  product_type?: string
  colour?: string
  in_stock: boolean
  similarity_score?: number
  created_at?: string
}

export interface ProductListResponse {
  products: ApiProduct[]
  pagination: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
  }
  filters_applied: {
    search?: string
    gender?: string
    category?: string
    sub_category?: string
    product_type?: string
    colour?: string
    min_price?: number
    max_price?: number
    in_stock?: boolean
    sort_by?: string
    sort_order?: string
    page: number
    page_size: number
  }
}

export interface ProductFilters {
  search?: string
  gender?: string
  category?: string
  sub_category?: string
  product_type?: string
  colour?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  sort_by?: "name" | "price" | "created_at" | "popularity"
  sort_order?: "asc" | "desc"
  page?: number
  page_size?: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString())
      }
    })

    const response = await fetch(`${this.baseUrl}/products?${params}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    return response.json()
  }

  async getGenders(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/products/genders`)
    if (!response.ok) {
      throw new Error(`Failed to fetch genders: ${response.statusText}`)
    }

    const data = await response.json()
    return data.genders
  }

  async getProductTypes(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/products/product-types`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product types: ${response.statusText}`)
    }

    const data = await response.json()
    return data.product_types
  }

  async getColours(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/products/colours`)
    if (!response.ok) {
      throw new Error(`Failed to fetch colours: ${response.statusText}`)
    }

    const data = await response.json()
    return data.colours
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/products/categories`)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }

    const data = await response.json()
    return data.categories
  }

  async searchByImage(imageFile: File): Promise<ApiProduct[]> {
    const formData = new FormData()
    formData.append("file", imageFile)

    const response = await fetch(`${this.baseUrl}/search/image`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Image search failed: ${response.statusText}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
