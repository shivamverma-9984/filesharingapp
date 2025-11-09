'use client';
import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-600">ShareIt</h1>
          <p className="mt-2 md:mt-0 text-lg text-gray-600">Secure. Fast. Effortless file sharing.</p>
        </div>
      </header>

      {/* Upload Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Upload a File</h2>
          <form className="flex flex-col gap-4">
            <input
              type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <Link href="/upload" className="text-blue-600 hover:underline">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Upload
            </button>
          </Link>
          </form>
        </div>
      </section>

      {/* Recent Files */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-semibold mb-4">Recent Files</h2>
        <ul className="space-y-4">
          {/* Example file item */}
          <li className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="font-medium">Project_Plan.pdf</p>
              <p className="text-sm text-gray-500">Uploaded 2 hours ago</p>
            </div>
            <button className="text-blue-600 hover:underline">Download</button>
          </li>
          {/* Add more file items dynamically */}
        </ul>
      </section>
    </div>
  );
};

export default Home;