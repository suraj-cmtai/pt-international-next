import { configureStore } from '@reduxjs/toolkit'
import galleryReducer from "./features/gallerySlice";
import authReducer from "./features/authSlice";
import blogReducer from "./features/blogSlice";
import courseReducer from "./features/courseSlice";
import subscriberReducer from "./features/subscriberSlice";
import contactReducer from "./features/contactSlice";
import testReducer from "./features/testSlice";


export const store = configureStore({
  reducer: {
    gallery: galleryReducer,
    auth: authReducer,
    blog: blogReducer,
    course: courseReducer,
    subscriber: subscriberReducer,
    contact: contactReducer,
    test: testReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;