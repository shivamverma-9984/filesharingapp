"use client";
import { useAuth } from "../../_context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function login() {
  const router = useRouter();
  const { login } = useAuth();

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const data = await login(formdata);
      if (data.success) {
        setStatus("Login successful!");
        setFormdata({ email: "", password: "" });
        
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('from') || '/dashboard';
        
        setTimeout(() => {
          router.push(returnTo);
        }, 100);
      } else {
        setStatus(data.message);
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center mt-8 mb-6">
      <div style={{ minWidth: "30%" }}>
        <div className="flex min-h-full shadow-lg flex-1 flex-col justify-center px-6 py-10  bg-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center">
              <Image src="/next.svg" height={100} width={100} />
            </div>
            <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              sign In with credentials
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              className="space-y-4"
              action="#"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-0.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="px-2 block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset sm:text-sm sm:leading-6"
                    value={formdata.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-0.5">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="px-2 block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset sm:text-sm sm:leading-6"
                    value={formdata.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  sign In
                </button>
              </div>
            </form>

            {status && (
              <p className="mt-3 bg-green-100 text-green-900">{status}</p>
            )}

            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => {
                  router.push("/register");
                }}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
