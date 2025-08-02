import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Service } from "@/lib/data"

interface ServiceState {
  services: Service[]
  loading: boolean
  error: string | null
  currentService: Service | null
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
  currentService: null,
}

// Async thunks

// Fetch all services
export const fetchServices = createAsyncThunk<Service[], void, { rejectValue: string }>(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/routes/services", {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch services")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch services")
    }
  }
)

// Create a new service (expects FormData for file upload)
export const createService = createAsyncThunk<Service, FormData, { rejectValue: string }>(
  "services/createService",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/routes/services", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.statusCode !== 201) {
        return rejectWithValue(data.errorMessage || "Failed to create service")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create service")
    }
  }
)

// Update a service (expects FormData for file upload)
export const updateService = createAsyncThunk<Service, { id: string; formData: FormData }, { rejectValue: string }>(
  "services/updateService",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/services/${id}`, {
        method: "PUT",
        body: formData,
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to update service")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update service")
    }
  }
)

// Delete a service
export const deleteService = createAsyncThunk<string, string, { rejectValue: string }>(
  "services/deleteService",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/services/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to delete service")
      }
      return id
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete service")
    }
  }
)

// Fetch a single service by id or slug
export const fetchServiceById = createAsyncThunk<Service, string, { rejectValue: string }>(
  "services/fetchServiceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/routes/services/${id}`, {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch service")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch service")
    }
  }
)

// Fetch active services only
export const fetchActiveServices = createAsyncThunk<Service[], void, { rejectValue: string }>(
  "services/fetchActiveServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/routes/services?isActive=true", {
        method: "GET",
      })
      const data = await response.json()
      if (data.statusCode !== 200) {
        return rejectWithValue(data.errorMessage || "Failed to fetch active services")
      }
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch active services")
    }
  }
)

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message || "Failed to fetch services"
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false
        state.services.push(action.payload)
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message || "Failed to create service"
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false
        const index = state.services.findIndex((service) => service.id === action.payload.id)
        if (index !== -1) {
          state.services[index] = action.payload
        }
        // If the updated service is the currentService, update it as well
        if (state.currentService && state.currentService.id === action.payload.id) {
          state.currentService = action.payload
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message || "Failed to update service"
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false
        state.services = state.services.filter((service) => service.id !== action.payload)
        // If the deleted service was the currentService, clear it
        if (state.currentService && state.currentService.id === action.payload) {
          state.currentService = null
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message || "Failed to delete service"
      })
      // Fetch single service by id/slug
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false
        state.currentService = action.payload
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message || "Failed to fetch service"
      })
      // Fetch active services
      .addCase(fetchActiveServices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveServices.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(fetchActiveServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message || "Failed to fetch active services"
      })
  },
})

export const { setCurrentService, clearError } = serviceSlice.actions
export default serviceSlice.reducer
