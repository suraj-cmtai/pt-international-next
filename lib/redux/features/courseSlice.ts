import { createSlice, createAsyncThunk, PayloadAction, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/utils";

// Define interfaces
interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  status: 'active' | 'draft' | 'archived';  
  description: string;
  instructor: string;
  enrollmentCount: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  // Additional fields
  learningHours?: string;
  modeOfDelivery?: 'Online' | 'On-campus' | 'Hybrid' | 'Self-paced';
  modeOfAssessment?: string;
  modules?: string[];
  prerequisites?: string[];
  careerOpportunities?: string[];
}

interface CourseState {
  courses: Course[];
  activeCourses: Course[]; // Separate state for active courses
  loading: boolean;
  hasFetched: boolean;
  error: string | null;
  selectedCourse: Course | null;
  filters: {
    category: string;
    level: string;
    priceRange: [number, number];
    modeOfDelivery: string;
  };
  searchQuery: string;
}

const initialState: CourseState = {
  courses: [],
  activeCourses: [], // Initialize as empty array
  loading: false,
  hasFetched: false,
  error: null,
  selectedCourse: null,
  filters: {
    category: '',
    level: '',
    priceRange: [0, 10000],
    modeOfDelivery: '',
  },
  searchQuery: '',
};

// Fetch all courses
export const fetchCourses = createAsyncThunk<Course[]>(
  "course/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/routes/course");
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch course by ID
export const fetchCourseById = createAsyncThunk<Course, string>(
  "course/fetchCourseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/routes/course/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create a new course
export const createCourse = createAsyncThunk<Course, FormData>(
  "course/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/routes/course", courseData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update a course
export const updateCourse = createAsyncThunk<Course, { id: string; data: FormData }>(
  "course/updateCourse",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/routes/course/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete a course
export const deleteCourse = createAsyncThunk<string, string>(
  "course/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/routes/course/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch all active courses
export const fetchActiveCourses = createAsyncThunk<Course[]>(
  "course/fetchActiveCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/routes/course/active");
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    setSelectedCourse: (state, action: PayloadAction<Course>) => {
      state.selectedCourse = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CourseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.courses = action.payload;
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasFetched = true;
      })

      // Fetch Course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.selectedCourse = action.payload;
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasFetched = true;
      })

      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.courses.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        // Update selected course if it's the same one
        if (state.selectedCourse?.id === action.payload.id) {
          state.selectedCourse = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
        // Clear selected course if it's the deleted one
        if (state.selectedCourse?.id === action.payload) {
          state.selectedCourse = null;
        }
        state.loading = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch active Courses
      .addCase(fetchActiveCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.activeCourses = action.payload;
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(fetchActiveCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasFetched = true;
      });
  },
});

export const { 
  clearSelectedCourse, 
  setSelectedCourse, 
  setSearchQuery, 
  setFilters, 
  clearFilters,
  clearError 
} = courseSlice.actions;

// Selectors
export const selectCourses = (state: RootState) => state.course.courses;
export const selectActiveCourses = (state: RootState) => state.course.activeCourses;
export const selectCourseLoading = (state: RootState) => state.course.loading;
export const selectCourseError = (state: RootState) => state.course.error;
export const selectSelectedCourse = (state: RootState) => state.course.selectedCourse;
export const selectSearchQuery = (state: RootState) => state.course.searchQuery;
export const selectFilters = (state: RootState) => state.course.filters;
export const selectCourseHasFetched = (state: RootState) => state.course.hasFetched;

// Advanced selectors with filtering and searching
export const selectFilteredCourses = (state: RootState) => {
  const { courses, searchQuery, filters } = state.course;
  
  return courses.filter(course => {
    // Text search
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = !filters.category || course.category === filters.category;
    
    // Level filter
    const matchesLevel = !filters.level || course.level === filters.level;
    
    // Price range filter
    const matchesPrice = course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1];
    
    // Mode of delivery filter
    const matchesDelivery = !filters.modeOfDelivery || course.modeOfDelivery === filters.modeOfDelivery;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice && matchesDelivery;
  });
};

export const selectActiveCoursesList = (state: RootState) => state.course.activeCourses;

export const selectCoursesByCategory = (state: RootState) => {
  const courses = state.course.courses;
  return courses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);
};

export const selectCoursesByLevel = (state: RootState) => {
  const courses = state.course.courses;
  return courses.reduce((acc, course) => {
    if (!acc[course.level]) {
      acc[course.level] = [];
    }
    acc[course.level].push(course);
    return acc;
  }, {} as Record<string, Course[]>);
};

export default courseSlice.reducer;