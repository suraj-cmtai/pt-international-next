import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/authSlice"
import blogReducer from "./features/blogSlice"
import contactReducer from "./features/contactSlice"
import courseReducer from "./features/courseSlice"
import galleryReducer from "./features/gallerySlice"
import subscriberReducer from "./features/subscriberSlice"
import testReducer from "./features/testSlice"
import serviceReducer from "./features/serviceSlice"
import productReducer from "./features/productSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    contact: contactReducer,
    course: courseReducer,
    gallery: galleryReducer,
    subscriber: subscriberReducer,
    test: testReducer,
    services: serviceReducer,
    products: productReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
