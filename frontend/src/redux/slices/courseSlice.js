import { create } from "zustand";

export const useCourseStore = create((set) => ({
  courses: [],
  filteredCourses: [],
  setCourses: (courses) => set({ courses, filteredCourses: courses }),
  filterCourses: (filterFn) =>
    set((state) => ({ filteredCourses: state.courses.filter(filterFn) })),
}));
