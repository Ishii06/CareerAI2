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
}

export const generateResume = async (formData: ResumeData): Promise<void> => {
  const response = await axios.post(
    "http://localhost:5000/api/resume/generate",
    formData,
    {
      withCredentials: true,
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "resume.pdf");
  document.body.appendChild(link);
  link.click();
};
