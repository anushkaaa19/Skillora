import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bio: '',
  location: '',
  website: '',
  education: [],
  experience: [],
  skills: [],
  socialLinks: {},
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setProfile: (state, action) => {
      return { ...state, ...action.payload, loading: false, error: null };
    },
    updateBio: (state, action) => {
      state.bio = action.payload;
    },
    addEducation: (state, action) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action) => {
      const index = state.education.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = action.payload;
      }
    },
    removeEducation: (state, action) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
    },
    addExperience: (state, action) => {
      state.experience.push(action.payload);
    },
    updateExperience: (state, action) => {
      const index = state.experience.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experience[index] = action.payload;
      }
    },
    removeExperience: (state, action) => {
      state.experience = state.experience.filter(exp => exp.id !== action.payload);
    },
    addSkill: (state, action) => {
      state.skills.push(action.payload);
    },
    updateSkill: (state, action) => {
      const index = state.skills.findIndex(skill => skill.id === action.payload.id);
      if (index !== -1) {
        state.skills[index] = action.payload;
      }
    },
    removeSkill: (state, action) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
    },
    updateSocialLinks: (state, action) => {
      state.socialLinks = { ...state.socialLinks, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  updateBio,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
  addSkill,
  updateSkill,
  removeSkill,
  updateSocialLinks,
} = profileSlice.actions;

export default profileSlice.reducer;
