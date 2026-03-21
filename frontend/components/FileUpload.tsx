// components/FileUpload.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react";
import { uploadBankStatement } from "@/lib/api";
import { ProcessedStatement } from "@/types";

interface FileUploadProps {
  onSuccess: (data: ProcessedStatement) => void;
}

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await uploadBankStatement(file);
      onSuccess(result);  
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Failed to process the statement. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag-and-drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();  
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-600 font-medium">Processing your statement...</p>
            <p className="text-gray-400 text-sm">This may take a few seconds</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {selectedFile ? (
              <FileText className="w-12 h-12 text-blue-500" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <p className="text-gray-700 font-semibold text-lg">
                {selectedFile ? selectedFile.name : "Drop your bank statement here"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                or click to browse — PDF files only
              </p>
            </div>
          </div>
        )}
        
        {/* Hidden file input — triggered by clicking the div above */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}