import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Timestamp } from "firebase/firestore"

export interface Product {
  id?: string
  title: string
  slug: string
  description: string
  longDescription: string
  category: string
  price?: string
  features: string[]
  images: string[]
  specifications?: Record<string, string>
  brochure?: string
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface ProductState {
  productList: Product[]
  activeProductList: Product[]
  isLoading: boolean
  hasFetched: boolean
  error: string | null
  currentProduct: Product | null
}

const initialState: ProductState = {
  productList: [],
  activeProductList: [],
  isLoading: false,
  hasFetched: false,
  error: null,
  currentProduct: null,
}

// Async thunks

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/routes/products", {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch products")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch products")
    }
  }
)

// Fetch active products
export const fetchActiveProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchActiveProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/routes/products/active", {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch active products")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch active products")
    }
  }
)

// Fetch product by ID
export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/products/${id}`, {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch product")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch product")
    }
  }
)

// Fetch product by slug
export const fetchProductBySlug = createAsyncThunk<Product, string, { rejectValue: string }>(
  "products/fetchProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/products/slug/${slug}`, {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch product")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch product")
    }
  }
)

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk<Product[], string, { rejectValue: string }>(
  "products/fetchProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/products/category/${category}`, {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch products by category")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch products by category")
    }
  }
)

// Create a new product (expects FormData for file upload)
export const createProduct = createAsyncThunk<Product, FormData, { rejectValue: string }>(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/routes/products", {
        method: "POST",
        body: productData,
      })
      const data = await response.json()
      if (data.statusCode !== 201) {
        return rejectWithValue(data.errorMessage || "Failed to create product")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create product")
    }
  }
)

// Update a product (expects FormData for file upload)
export const updateProduct = createAsyncThunk<Product, { id: string; productData: FormData }, { rejectValue: string }>(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/products/${id}`, {
        method: "PUT",
        body: productData,
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to update product")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update product")
    }
  }
)

// Delete a product
export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/products/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to delete product")
      }
      return id
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete product")
    }
  }
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetProductState: (state) => {
      state.productList = []
      state.activeProductList = []
      state.hasFetched = false
      state.error = null
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.productList = action.payload
        state.hasFetched = true
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to fetch products"
      })
      // Fetch active products
      .addCase(fetchActiveProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchActiveProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeProductList = action.payload
        state.hasFetched = true
      })
      .addCase(fetchActiveProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to fetch active products"
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to fetch product"
      })
      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to fetch product"
      })
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeProductList = action.payload
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to fetch products by category"
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.productList.unshift(action.payload)
        if (action.payload.isActive) {
          state.activeProductList.unshift(action.payload)
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to create product"
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.productList.findIndex((product) => product.id === action.payload.id)
        if (index !== -1) {
          state.productList[index] = action.payload
        }
        const activeIndex = state.activeProductList.findIndex((product) => product.id === action.payload.id)
        if (activeIndex !== -1) {
          if (action.payload.isActive) {
            state.activeProductList[activeIndex] = action.payload
          } else {
            state.activeProductList.splice(activeIndex, 1)
          }
        } else if (action.payload.isActive) {
          state.activeProductList.unshift(action.payload)
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to update product"
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.productList = state.productList.filter((product) => product.id !== action.payload)
        state.activeProductList = state.activeProductList.filter((product) => product.id !== action.payload)
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || action.error.message || "Failed to delete product"
      })
  },
})

export const { setCurrentProduct, clearError, resetProductState } = productSlice.actions

// Selectors
export const selectProductList = (state: { products: ProductState }) => state.products.productList
export const selectActiveProductList = (state: { products: ProductState }) => state.products.activeProductList
export const selectCurrentProduct = (state: { products: ProductState }) => state.products.currentProduct
export const selectIsLoading = (state: { products: ProductState }) => state.products.isLoading
export const selectHasFetched = (state: { products: ProductState }) => state.products.hasFetched
export const selectError = (state: { products: ProductState }) => state.products.error

export default productSlice.reducer
