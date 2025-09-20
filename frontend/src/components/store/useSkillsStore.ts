import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSkillsStore = create(
  persist(
    (set) => ({
      career: "",
      suggestedSkills: [],
      roadmap: [],
      videos: {},

      setCareer: (career) => set({ career }),
      setSuggestedSkills: (skills) => set({ suggestedSkills: skills }),
      setRoadmap: (roadmap) => set({ roadmap }),
      setVideos: (videos) => set({ videos }),

      reset: () =>
        set({
          career: "",
          suggestedSkills: [],
          roadmap: [],
          videos: {},
        }),
    }),
    {
      name: "skills-storage", // key in localStorage
    }
  )
);
