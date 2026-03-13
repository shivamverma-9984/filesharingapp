"use client";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../_context/AuthContext";

// ─── Password strength rules ─────────────────────────────────────
const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  { id: "number", label: "At least one number", test: (p) => /\d/.test(p) },
  {
    id: "special",
    label: "At least one special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

function getStrength(password) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (passed <= 1)
    return { label: "Very Weak", color: "#ef4444", width: "20%" };
  if (passed === 2) return { label: "Weak", color: "#f97316", width: "40%" };
  if (passed === 3) return { label: "Fair", color: "#eab308", width: "60%" };
  if (passed === 4) return { label: "Strong", color: "#22c55e", width: "80%" };
  return { label: "Very Strong", color: "#16a34a", width: "100%" };
}

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
  const [passwordFocused, setPasswordFocused] = useState(false);

  // OTP flow state
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  // Validate all password rules before proceeding
  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(formdata.password));
  const strength = getStrength(formdata.password);

  // Step 1: Validate password strength then send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allRulesPassed) {
      toast.error("Please create a stronger password");
      setPasswordFocused(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formdata.email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email!");
        setStep("otp");
        setResendCountdown(60);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5)
      otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // Step 2: Verify OTP then Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setOtpLoading(true);
    try {
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formdata.email, otp: otpValue }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        toast.error(verifyData.error || "OTP verification failed");
        return;
      }

      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const regData = await regRes.json();
      if (regRes.ok) {
        toast.success("Account created successfully!");
        setFormdata({ name: "", email: "", password: "" });
        router.push("/login");
      } else {
        toast.error(regData.message || regData.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formdata.email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("New OTP sent!");
        setOtp(["", "", "", "", "", ""]);
        setResendCountdown(60);
        otpRefs.current[0]?.focus();
      } else {
        toast.error(data.error || "Failed to resend OTP");
      }
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Step UI ───────────────────────────────────────────────
  if (step === "otp") {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[420px] w-full p-8 text-left text-sm shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Verify Your Email
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
              We sent a 6-digit OTP to{" "}
              <span className="font-semibold text-[#1c76eb]">
                {formdata.email}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerifyAndRegister}>
            <div
              className="flex justify-center gap-3 mb-6"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:border-[#1c76eb] focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  style={{ borderColor: digit ? "#1c76eb" : undefined }}
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={otpLoading || otp.join("").length !== 6}
              className="w-full bg-[#1c76eb] hover:bg-[#1c76eb]/80 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed rounded-sm"
            >
              {otpLoading ? (
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying account
                </span>
              ) : (
                "Verify & Create Account"
              )}
            </button>
          </form>

          <div className="mt-5 flex flex-col items-center gap-2">
            <button
              onClick={handleResendOtp}
              disabled={resendCountdown > 0 || loading}
              className="flex items-center gap-1.5 text-sm text-[#1c76eb] hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              {resendCountdown > 0
                ? `Resend OTP in ${resendCountdown}s`
                : "Resend OTP"}
            </button>
            <button
              onClick={() => {
                setStep("form");
                setOtp(["", "", "", "", "", ""]);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              ← Change email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Registration Form UI ──────────────────────────────────────
  return (
    <div className="flex justify-center items-center min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[400px] w-full p-8 text-left text-sm shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-2">
            <User className="w-6 h-6 text-[#1c76eb] dark:text-[#1c76eb]" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Join thousands of users sharing files securely
          </p>
        </div>

        <div className="space-y-3 -mt-3">
          {/* Name */}
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-[#1c76eb] focus-within:ring-1 focus-within:ring-[#1c76eb] transition-all">
            <User
              size={18}
              className="text-gray-400 group-focus-within:text-[#1c76eb]"
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

          {/* Email */}
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-[#1c76eb] focus-within:ring-1 focus-within:ring-[#1c76eb] transition-all">
            <Mail
              size={18}
              className="text-gray-400 group-focus-within:text-[#1c76eb]"
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

          {/* Password */}
          <div>
            <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-[#1c76eb] focus-within:ring-1 focus-within:ring-[#1c76eb] transition-all">
              <Lock
                size={18}
                className="text-gray-400 group-focus-within:text-[#1c76eb]"
              />
              <input
                className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formdata.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-[#1c76eb] focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength bar */}
            {formdata.password.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Password strength
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: strength.width,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Rules checklist */}
            {(passwordFocused || formdata.password.length > 0) && (
              <div className="mt-3 space-y-1.5 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-100 dark:border-gray-600">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(formdata.password);
                  return (
                    <div key={rule.id} className="flex items-center gap-2">
                      {passed ? (
                        <CheckCircle2
                          size={14}
                          className="text-green-500 flex-shrink-0"
                        />
                      ) : (
                        <XCircle
                          size={14}
                          className="text-gray-300 dark:text-gray-600 flex-shrink-0"
                        />
                      )}
                      <span
                        className={`text-xs transition-colors ${
                          passed
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#1c76eb] hover:bg-[#1c76eb]/80 text-white font-semibold py-3 shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending OTP...
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="flex items-center my-3.5">
          <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="shrink-0 mx-4 text-gray-400 text-sm">
            Or continue with
          </span>
          <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <div className="flex justify-center w-full mb-6">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setLoading(true);
              try {
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
            className="font-semibold text-[#1c76eb] hover:text-blue-500 transition-colors"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
