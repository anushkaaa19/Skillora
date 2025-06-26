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
      const res = await axios.get("http://localhost:4000/api/v1/course/getAllCourses");
      const data = res.data?.data || [];
      console.log("📦 Courses fetched from backend:", data);
      set({ courses: data, filteredCourses: data });
    } catch (error) {
      console.error("❌ Failed to fetch courses:", error);
    }
  },
}));
