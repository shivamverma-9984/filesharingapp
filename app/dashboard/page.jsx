"use client";
import { useEffect, useState } from "react";
import UploadForm from "../../components/UploadForm";
import toast from "react-hot-toast";
import { File, Download, Trash2, Clock, HardDrive } from "lucide-react";

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  else return (bytes / 1073741824).toFixed(1) + " GB";
}

export default function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl, filename) => {
    const urlParts = fileUrl.split("/");
    const fileKey = urlParts.slice(3).join("/");
    const downloadUrl = `/api/download?key=${encodeURIComponent(fileKey)}&filename=${encodeURIComponent(filename)}`;
    window.open(downloadUrl, "_blank");
  };

  const handleDelete = async (fileId, fileUrl) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId, fileUrl }),
      });

      const result = await response.json();

      if (response.ok) {
        setFiles(files.filter((file) => file.id !== fileId));
        toast.success("File deleted successfully");
      } else {
        console.error("Delete failed:", result);
        toast.error(
          `Failed to delete file: ${result.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file: Network error");
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="grow container mx-auto px-4 py-8 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Files
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage and share your secure files
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <HardDrive className="text-indigo-500 w-5 h-5" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {files.length} {files.length === 1 ? "file" : "files"}
              </span>
            </div>
          </div>

          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Upload New File
              </h2>
              <UploadForm onUploadSuccess={fetchUserFiles} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <File className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No files uploaded yet
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Upload your first file to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="p-5 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <File className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Quick actions that appear on hover */}
                      </div>
                    </div>

                    <h3
                      className="font-semibold text-gray-900 dark:text-white mb-1 truncate"
                      title={file.filename}
                    >
                      {file.filename}
                    </h3>

                    <div className="space-y-1 mt-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                        <HardDrive className="w-3 h-3" />
                        {formatFileSize(parseInt(file.size))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    <button
                      onClick={() => handleDownload(file.url, file.filename)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file.id, file.url)}
                      className="inline-flex justify-center items-center p-2 text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-all shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
