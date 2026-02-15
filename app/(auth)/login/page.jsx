"use client";
import Link from "next/link";
import { useAuth } from "../../_context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formdata);
      if (data.success) {
        toast.success("Login successful!");
        setFormdata({ email: "", password: "" });
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[400px] w-full p-8 text-left text-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-2">
            <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Please sign in to continue accessing your files
          </p>
        </div>

        <div className="space-y-4">
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <Mail
              size={18}
              className="text-gray-400 group-focus-within:text-indigo-500"
            />
            <input
              className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>

          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <Lock
              size={18}
              className="text-gray-400 group-focus-within:text-indigo-500"
            />
            <input
              className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              type="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              id="checkbox"
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
              Remember me
            </span>
          </label>
          <a
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            href="/forgetpassword"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
