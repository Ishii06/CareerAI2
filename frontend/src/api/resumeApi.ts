import axios from "axios";

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  role: string;
  company: string;
  years: string;
  details: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  education: Education[];
  skills: string[];
  experience: Experience[];
  template?: string;
}

export const generateResume = async (formData: ResumeData): Promise<Blob> => {
  const response = await axios.post(
    "http://localhost:5000/api/resume/generate",
    formData,
    { responseType: "blob" }
  );

  return new Blob([response.data], { type: "application/pdf" });
};
