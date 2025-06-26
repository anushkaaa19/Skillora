import { create } from 'zustand'
import axios from '../utils/axiosInstance' // your configured axios with credentials

export const useInstructorStore = create((set) => ({
  instructorCourses: [],
  loading: false,
  error: null,

  fetchInstructorCourses: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get('/api/course/instructor-courses'); // adjust route
      set({ instructorCourses: response.data.data });
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      set({ error: error.response?.data?.message || 'Failed to load courses' });
    } finally {
      set({ loading: false });
    }
  },
}));
