'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Upload failed');
      }
      toast.success('File uploaded successfully!');
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload File
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            disabled={!file || uploading}
            className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm
              ${!file || uploading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500'}`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </form>
  );
}