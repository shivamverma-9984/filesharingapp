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
        router.push('/dashboard');
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
    <div className="flex justify-center items-center h-screen ">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Sign In
          </h2>
          <p>Welcome back! Please sign in to continue</p>
        </div>
        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <Mail size={18} />
          <input
            className="w-full outline-none bg-transparent py-2.5"
            type="email"
            name="email"
            value={formdata.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="flex items-center mt-2 mb-4 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <Lock size={18} />
          <input
            className="w-full outline-none bg-transparent py-2.5"
            type="password"
            name="password"
            value={formdata.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <input id="checkbox" type="checkbox" />
            <label htmlFor="checkbox">Remember me</label>
          </div>
          <a className="text-blue-600 underline" href="/forgetpassword">
            Forgot Password
          </a>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 transition py-2.5 rounded text-white font-medium"
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-500 underline"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
