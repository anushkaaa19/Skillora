// stores/useCourseStore.js
import { create } from "zustand";
import axios from "axios";

export const useCourseStore = create((set) => ({
  courses: [],
  filteredCourses: [],
  totalCourses: 0,
  totalPages: 0,
  
  setCourses: (courses) => set({ courses, filteredCourses: courses }),

  filterCourses: (filterFn) =>
    set((state) => ({
      filteredCourses: state.courses.filter(filterFn),
    })),
    // ✅ Fetch paginated courses
    getCourses: async (page = 1, limit = 9) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/course/getAllCourses?page=${page}&limit=${limit}`
        );
  
        const data = res.data?.data || [];
        const total = res.data?.totalCourses || 0;
        const pages = res.data?.totalPages || 1;
  
        set({
          courses: data,
          filteredCourses: data,
          totalCourses: total,
          totalPages: pages,
        });
      } catch (error) {
        console.error("❌ Failed to fetch courses:", error);
      }
    },
  
    
}));
