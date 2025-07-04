"use client";

import axiosInstance from "@/utils/services/axiosInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiHide, BiShowAlt } from "react-icons/bi";

export default function NewPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("No email found, please start the reset process again.");
      router.push("/forgot-password");
    }
  }, [router]);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include a number and a special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError("Email not found. Please restart the reset process.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/v1/reset-password", {
        email,
        newPassword: password
      });

      const data = response.data;

      if (data.status === 200) {
        toast.success(data.message || "Password changed successfully");
        router.push("/login");
      } 
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-screen h-screen bg-white">
      {/* Left: Image */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-4">
        <Image
          src="/images/Splash-screen.jpg"
          alt="Splash Screen"
          width={500}
          height={500}
          className="shadow-2xl shadow-cyan-300 rounded-3xl max-w-full h-auto"
          priority
        />
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-tr from-blue-900 to-blue-950 p-6 h-screen">
        <div className="w-full max-w-md bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <div className="text-center text-blue-900 mb-6">
            <h1 className="text-xl lg:text-3xl font-bold">New Password</h1>
            <p className="text-xs lg:text-sm text-gray-600 font-medium">Reset password for</p>
            <p className="text-xs font-bold text-gray-700">{email}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="text-xs lg:text-sm text-gray-700 font-medium">NEW PASSWORD</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none pr-12 text-sm lg:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-11 text-md text-blue-600 hover:text-blue-800 font-semibold select-none"
              >
                {showPassword ? <BiShowAlt /> : <BiHide />}
              </button>
            </div>

            <div className="relative">
              <label className="text-xs lg:text-sm text-gray-700 font-medium">CONFIRM PASSWORD</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none pr-12 text-sm lg:text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-11 text-md text-blue-600 hover:text-blue-800 font-semibold select-none"
              >
                {showConfirmPassword ? <BiShowAlt /> : <BiHide />}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-xs lg:text-sm font-medium">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-400 transition text-sm lg:text-base disabled:opacity-50"
            >
              {loading ? "Changing..." : "CHANGE PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
