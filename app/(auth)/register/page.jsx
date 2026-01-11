"use client";
import { Mail, User, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [formdata, setFormdata] = useState({
    name: "",
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
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
       <div className="flex flex-col items-center gap-1 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Create Account
          </h2>
          <p>Create a new account to get started</p>
        </div>
        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <User size={18} />
          <input
            className="w-full outline-none bg-transparent py-2.5"
            type="name"
            name="name"
            value={formdata.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
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

        <button
          type="submit"
          disabled={loading}
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 transition py-2.5 rounded text-white font-medium"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 underline"
          >
            Log In{" "}
          </Link>
        </p>
      </form>
    </div>
  );
}
