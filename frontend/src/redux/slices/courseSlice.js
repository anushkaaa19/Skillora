// stores/useCourseStore.js
import { create } from "zustand";
import axios from "axios";

export const useCourseStore = create((set) => ({
  courses: [],
  filteredCourses: [],
  
  setCourses: (courses) => set({ courses, filteredCourses: courses }),

  filterCourses: (filterFn) =>
    set((state) => ({
      filteredCourses: state.courses.filter(filterFn),
    })),

  // ✅ Corrected endpoint
  getCourses: async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/course/getAllCourses`);
      const data = res.data?.data || [];
      set({ courses: data, filteredCourses: data });
    } catch (error) {
      console.error("❌ Failed to fetch courses:", error);
    }
  },
}));
