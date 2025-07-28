import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/lib/data"

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  currentProduct: Product | null
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  currentProduct: null,
}

// Async thunks
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await fetch("/api/routes/products")
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
})

export const createProduct = createAsyncThunk("products/createProduct", async (productData: Omit<Product, "id">) => {
  const response = await fetch("/api/routes/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
})

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, ...productData }: Product) => {
  const response = await fetch(`/api/routes/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
})

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: string) => {
  const response = await fetch(`/api/routes/products/${id}`, {
    method: "DELETE",
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return id
})

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
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create product"
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex((product) => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update product"
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter((product) => product.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete product"
      })
  },
})

export const { setCurrentProduct, clearError } = productSlice.actions
export default productSlice.reducer
