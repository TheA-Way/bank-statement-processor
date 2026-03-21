// lib/api.ts
import axios from "axios";
import { ProcessedStatement } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});


export async function uploadBankStatement(
  file: File
): Promise<ProcessedStatement> {
  const formData = new FormData();
  
  formData.append("file", file);

  const response = await apiClient.post<ProcessedStatement>(
    "/process-statement",
    formData
  );

  return response.data;
}