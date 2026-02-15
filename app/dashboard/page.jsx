'use client';
import { useEffect, useState } from 'react';
import UploadForm from '../../components/UploadForm';
import toast from 'react-hot-toast';

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
}

export default function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserFiles = async () => {
    try {
      const response = await fetch('/api/files');   
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      } else {
        console.error('Failed to fetch files');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl, filename) => {
    const urlParts = fileUrl.split('/');
    const fileKey = urlParts.slice(3).join('/');
    const downloadUrl = `/api/download?key=${encodeURIComponent(fileKey)}&filename=${encodeURIComponent(filename)}`;
    window.open(downloadUrl, '_blank');
  };

  const handleDelete = async (fileId, fileUrl) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, fileUrl }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId));
        toast.success('File deleted successfully');
      } else {
        console.error('Delete failed:', result);
        toast.error(`Failed to delete file: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file: Network error');
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Files</h1>
            <div className="text-sm text-gray-500">
              Total files: {files.length}
            </div>
          </div>

          <div className="mb-8">
            <UploadForm onUploadSuccess={fetchUserFiles} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 "></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12  rounded-lg shadow-sm">
              <p className="text-gray-500">No files uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div key={file.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate flex-1">
                        {file.filename}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {formatFileSize(parseInt(file.size))}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(file.url, file.filename)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 cursor-pointer"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file.id, file.url)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
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