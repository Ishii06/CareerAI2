import { create } from "zustand";

export const useSkillsStore = create((set) => ({
  career: "",
  suggestedSkills: [],
  roadmap: [],
  videos: {},

  setCareer: (career) => set({ career }),
  setSuggestedSkills: (skills) => set({ suggestedSkills: skills }),
  setRoadmap: (roadmap) => set({ roadmap }),
  setVideos: (videos) => set({ videos }),

}))