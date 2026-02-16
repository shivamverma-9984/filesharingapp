"use client";
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../_context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { googleLogin } = useAuth();

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      console.log("Registration response:", data);

      if (res.ok) {
        toast.success(data.message);
        setFormdata({ name: "", email: "", password: "" });
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[400px] w-full p-8 text-left text-sm shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-2">
            <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Join thousands of users sharing files securely
          </p>
        </div>

        <div className="space-y-3 -mt-3">
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <User
              size={18}
              className="text-gray-400 group-focus-within:text-indigo-500"
            />
            <input
              className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              type="text"
              name="name"
              value={formdata.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
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
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <Lock
              size={18}
              className="text-gray-400 group-focus-within:text-indigo-500"
            />
            <input
              className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formdata.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-indigo-500 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="flex items-center my-3.5">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <div className="flex justify-center w-full mb-6">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setLoading(true);
              try {
                // We can use googleLogin from AuthContext even on register page
                // because the backend endpoint handles creation if user doesn't exist.
                const data = await googleLogin(credentialResponse.credential);
                if (data.success) {
                  toast.success("Account created successfully!");
                  setFormdata({ name: "", email: "", password: "" });
                  router.push("/dashboard");
                } else {
                  toast.error(data.message || "Google Signup Failed");
                }
              } catch (err) {
                console.error(err);
                toast.error("Something went wrong with Google Signup!");
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              toast.error("Google Signup connection failed");
            }}
            theme="filled_blue"
            shape="rectangular"
            text="signup_with"
            locale="en_US"
            width="330"
          />
        </div>

        <p className="text-center -mt-2 text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
          >
            Log In{" "}
          </Link>
        </p>
      </form>
    </div>
  );
}
