// store/useCourseCreationStore.js
import { create } from 'zustand';

export const useCourseCreationStore = create((set) => ({
  title: '',
  description: '',
  category: '',
  level: 'Beginner',
  price: '',
  duration: '',
  imageUrl: '',
  modules: [
    {
      title: '',
      description: '',
      lessons: [{ title: '', duration: '', type: 'video' }],
    },
  ],

  setField: (field, value) => set({ [field]: value }),

  updateModule: (index, field, value) =>
    set((state) => {
      const updated = [...state.modules];
      updated[index][field] = value;
      return { modules: updated };
    }),

  removeModule: (index) =>
    set((state) => ({
      modules: state.modules.filter((_, i) => i !== index),
    })),

  addModule: () =>
    set((state) => ({
      modules: [
        ...state.modules,
        {
          title: '',
          description: '',
          lessons: [{ title: '', duration: '', type: 'video' }],
        },
      ],
    })),

  addLesson: (moduleIndex) =>
    set((state) => {
      const modules = [...state.modules];
      modules[moduleIndex].lessons.push({
        title: '',
        duration: '',
        type: 'video',
      });
      return { modules };
    }),

  updateLesson: (moduleIndex, lessonIndex, field, value) =>
    set((state) => {
      const modules = [...state.modules];
      modules[moduleIndex].lessons[lessonIndex][field] = value;
      return { modules };
    }),

  removeLesson: (moduleIndex, lessonIndex) =>
    set((state) => {
      const modules = [...state.modules];
      modules[moduleIndex].lessons = modules[moduleIndex].lessons.filter(
        (_, i) => i !== lessonIndex
      );
      return { modules };
    }),

  resetCourse: () =>
    set({
      title: '',
      description: '',
      category: '',
      level: 'Beginner',
      price: '',
      duration: '',
      imageUrl: '',
      modules: [
        {
          title: '',
          description: '',
          lessons: [{ title: '', duration: '', type: 'video' }],
        },
      ],
    }),
}));
