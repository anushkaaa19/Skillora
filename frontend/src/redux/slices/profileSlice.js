// src/store/useProfileStore.js
import { create } from 'zustand';

export const useProfileStore = create((set) => ({
  bio: '',
  location: '',
  website: '',
  education: [],
  experience: [],
  skills: [],
  socialLinks: {},
  loading: false,
  error: null,

  setLoading: (value) => set({ loading: value }),
  setError: (error) => set({ error }),

  setProfile: (profile) => set((state) => ({
    ...state,
    ...profile,
    loading: false,
    error: null,
  })),

  updateBio: (bio) => set({ bio }),

  addEducation: (edu) =>
    set((state) => ({ education: [...state.education, edu] })),
  updateEducation: (updatedEdu) =>
    set((state) => ({
      education: state.education.map((edu) =>
        edu.id === updatedEdu.id ? updatedEdu : edu
      ),
    })),
  removeEducation: (id) =>
    set((state) => ({
      education: state.education.filter((edu) => edu.id !== id),
    })),

  addExperience: (exp) =>
    set((state) => ({ experience: [...state.experience, exp] })),
  updateExperience: (updatedExp) =>
    set((state) => ({
      experience: state.experience.map((exp) =>
        exp.id === updatedExp.id ? updatedExp : exp
      ),
    })),
  removeExperience: (id) =>
    set((state) => ({
      experience: state.experience.filter((exp) => exp.id !== id),
    })),

  addSkill: (skill) =>
    set((state) => ({ skills: [...state.skills, skill] })),
  updateSkill: (updatedSkill) =>
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === updatedSkill.id ? updatedSkill : skill
      ),
    })),
  removeSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((skill) => skill.id !== id),
    })),

  updateSocialLinks: (links) =>
    set((state) => ({
      socialLinks: { ...state.socialLinks, ...links },
    })),
}));
