"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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

export default function ForgetPassword() {
  const router = useRouter();

  // 3 steps: "email" → "otp" → "reset"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [formdata, setFormdata] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(formdata.password));
  const strength = getStrength(formdata.password);

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/forget-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
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
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ────────────────────────────────────────
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

  // ── Step 2: Verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otpValue,
          type: "reset",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Email verified!");
        setStep("reset");
        setPasswordFocused(true);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/forget-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("New OTP sent!");
        setOtp(["", "", "", "", "", ""]);
        setResendCountdown(60);
        otpRefs.current[0]?.focus();
      } else {
        toast.error(data.error || "Failed to resend");
      }
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ───────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!allRulesPassed) {
      toast.error("Please create a stronger password");
      return;
    }
    if (formdata.password !== formdata.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: formdata.password,
          confirmPassword: formdata.confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
        router.push("/login");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared card wrapper ──────────────────────────────────────
  const Card = ({ children }) => (
    <div className="flex justify-center items-center min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[420px] w-full p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        {children}
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────────────
  // STEP 1 — Email input
  // ────────────────────────────────────────────────────────────
  if (step === "email") {
    return (
      <Card>
        <div className="flex flex-col items-center gap-1 mb-8">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-2">
            <Mail className="w-6 h-6 text-[#1c76eb]" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-1">
            Enter your registered email and we'll send you a verification OTP.
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-[#1c76eb] focus-within:ring-1 focus-within:ring-[#1c76eb] transition-all">
            <Mail
              size={18}
              className="text-gray-400 group-focus-within:text-[#1c76eb]"
            />
            <input
              className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your registered email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c76eb] hover:bg-[#1c76eb]/80 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
              "Send OTP"
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-500 dark:text-gray-400">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1c76eb] hover:text-blue-500 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </Card>
    );
  }

  // ────────────────────────────────────────────────────────────
  // STEP 2 — OTP verification
  // ────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <Card>
        <div className="flex flex-col items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Enter OTP
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
            We sent a 6-digit OTP to{" "}
            <span className="font-semibold text-[#1c76eb]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp}>
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
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            onClick={handleResend}
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
              setStep("email");
              setOtp(["", "", "", "", "", ""]);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← Change email
          </button>
        </div>
      </Card>
    );
  }

  // ────────────────────────────────────────────────────────────
  // STEP 3 — New password
  // ────────────────────────────────────────────────────────────
  return (
    <Card>
      <div className="flex flex-col items-center gap-1 mb-8">
        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full mb-2">
          <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Set New Password
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-1">
          Create a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-3">
        {/* New password */}
        <div>
          <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-[#1c76eb] focus-within:ring-1 focus-within:ring-[#1c76eb] transition-all">
            <Lock
              size={18}
              className="text-gray-400 group-focus-within:text-[#1c76eb]"
            />
            <input
              className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              type={showPassword ? "text" : "password"}
              value={formdata.password}
              onChange={(e) =>
                setFormdata({ ...formdata, password: e.target.value })
              }
              onFocus={() => setPasswordFocused(true)}
              placeholder="New Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-[#1c76eb]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength bar */}
          {formdata.password.length > 0 && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Password strength</span>
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
                      className={`text-xs transition-colors ${passed ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                    >
                      {rule.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="group flex items-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 focus-within:border-[#1c76eb] focus-within:ring-1 focus-within:ring-[#1c76eb] transition-all">
          <Lock
            size={18}
            className="text-gray-400 group-focus-within:text-[#1c76eb]"
          />
          <input
            className="w-full bg-transparent p-3 outline-none text-gray-900 dark:text-white placeholder-gray-400"
            type={showConfirm ? "text" : "password"}
            value={formdata.confirmPassword}
            onChange={(e) =>
              setFormdata({ ...formdata, confirmPassword: e.target.value })
            }
            placeholder="Confirm New Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="text-gray-400 hover:text-[#1c76eb]"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Match indicator */}
        {formdata.confirmPassword.length > 0 && (
          <p
            className={`text-xs flex items-center gap-1 ${formdata.password === formdata.confirmPassword ? "text-green-600" : "text-red-500"}`}
          >
            {formdata.password === formdata.confirmPassword ? (
              <>
                <CheckCircle2 size={13} /> Passwords match
              </>
            ) : (
              <>
                <XCircle size={13} /> Passwords do not match
              </>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[#1c76eb] hover:bg-[#1c76eb]/80 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
              Updating Password...
            </span>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </Card>
  );
}
