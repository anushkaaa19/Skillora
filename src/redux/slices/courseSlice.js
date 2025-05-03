import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  userCourses: [],
  loading: false,
  error: null,
};

export const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
    },
    setUserCourses: (state, action) => {
      state.userCourses = action.payload;
    },
    updateCourseProgress: (state, action) => {
      const { courseId, progress } = action.payload;
      const courseIndex = state.userCourses.findIndex(uc => uc.courseId === courseId);
      
      if (courseIndex !== -1) {
        state.userCourses[courseIndex].progress = progress;
        
        if (progress === 100 && !state.userCourses[courseIndex].completed) {
          state.userCourses[courseIndex].completed = true;
          state.userCourses[courseIndex].dateCompleted = new Date().toISOString();
        }
      }
    },
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
    },
    issueCertificate: (state, action) => {
      const courseId = action.payload;
      const courseIndex = state.userCourses.findIndex(uc => uc.courseId === courseId);
      
      if (courseIndex !== -1 && state.userCourses[courseIndex].completed) {
        state.userCourses[courseIndex].certificateIssued = true;
      }
    }
  },
});

export const { 
  setLoading, 
  setError, 
  setCourses, 
  setUserCourses, 
  updateCourseProgress, 
  addCourse, 
  issueCertificate 
} = courseSlice.actions;

export default courseSlice.reducer;