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
export const fetchServices = createAsyncThunk("services/fetchServices", async () => {
  const response = await fetch("/api/routes/services")
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
})

export const createService = createAsyncThunk("services/createService", async (serviceData: Omit<Service, "id">) => {
  const response = await fetch("/api/routes/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
})

export const updateService = createAsyncThunk("services/updateService", async ({ id, ...serviceData }: Service) => {
  const response = await fetch(`/api/routes/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
})

export const deleteService = createAsyncThunk("services/deleteService", async (id: string) => {
  const response = await fetch(`/api/routes/services/${id}`, {
    method: "DELETE",
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return id
})

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
      // Fetch services
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
        state.error = action.error.message || "Failed to fetch services"
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
        state.error = action.error.message || "Failed to create service"
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
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update service"
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false
        state.services = state.services.filter((service) => service.id !== action.payload)
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete service"
      })
  },
})

export const { setCurrentService, clearError } = serviceSlice.actions
export default serviceSlice.reducer
