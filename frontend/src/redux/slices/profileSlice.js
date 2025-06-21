import { create } from "zustand";

export const useProfileStore = create((set) => ({
  gender: "",
  dateOfBirth: "",
  about: "",
  contactNumber: "",
  loading: false,
  error: null,

  setProfile: (data) =>
    set({
      gender: data.gender || "",
      dateOfBirth: data.dateOfBirth || "",
      about: data.about || "",
      contactNumber: data.contactNumber || "",
    }),

  updateField: (field, value) =>
    set((state) => ({ ...state, [field]: value })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
