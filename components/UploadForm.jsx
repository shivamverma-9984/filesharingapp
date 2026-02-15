"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UploadForm({ onUploadSuccess }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.error || "Upload failed");
      }
      toast.success("File uploaded successfully!");
      setFile(null);
      e.target.reset();
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <label className="relative flex-1 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-8 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all w-full md:w-auto">
          <div className="text-center">
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Click to upload
              </span>{" "}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Any file up to 10MB
            </p>
          </div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 z-50 h-full w-full opacity-0 cursor-pointer"
          />
        </label>

        {file && (
          <div className="flex flex-col items-start gap-2 w-full md:w-auto">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg truncate max-w-[200px]">
              {file.name}
            </div>
            <button
              type="submit"
              disabled={uploading}
              className={`inline-flex justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all
                  ${
                    uploading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30"
                  }`}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Selected File"
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
