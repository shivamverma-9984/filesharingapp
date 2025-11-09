'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Upload failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Choose a file to upload
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100
              dark:file:bg-violet-900 dark:file:text-violet-200
              dark:text-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={uploading || !file}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${
              uploading
                ? 'bg-violet-400 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded-md text-sm">
          <p>Upload successful!</p>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 underline break-all"
          >
            {result.url}
          </a>
        </div>
      )}
    </div>
  );
}