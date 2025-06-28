"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BiHide, BiShowAlt } from "react-icons/bi";
import setCookie from "@/constant/cookie";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (email !== "admin@gmail.com" || password !== "admin@123") {
      toast.error("Access Denied: Only Admin can log in.")
      return;
    }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

      const res = await fetch(`${baseUrl}/v1/restaurant/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data)

      console.log("Received token:", data.data.token);

      if (res.ok && data?.data?.token) {
        console.log("Login successful:", data);
        setCookie("token", data.data.token, rememberMe ? 24 * 7 : 24);
        toast.success("Login Successful!");
        location.pathname = "/dashboard"
      } else {
        toast.error("Login Failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login Failed...!");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };


  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-screen h-screen bg-white">
      {/* Left: Image (hidden on small screens) */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-4">
        <Image
          src="/Splash-screen2.jpg"
          alt="Splash Screen"
          width={500}
          height={500}
          className="shadow-2xl shadow-cyan-300 rounded-3xl max-w-full h-auto"
          priority
        />
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-tr from-blue-900 to-blue-950 p-6 h-screen">
        <div className="w-full max-w-md bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <div className="text-center text-blue-900 mb-6">
            <h1 className="text-xl lg:text-3xl font-bold">Log In</h1>
            <p className="text-xs lg:text-sm text-gray-600 font-medium">Please sign in to your existing account</p>
          </div>
          <form className="space-y-4">
            <div>
              <label className="text-xs lg:text-sm text-gray-700 font-medium">EMAIL</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none text-sm lg:text-base"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              {emailError && <span className="text-red-500 text-xs font-medium mt-1">{emailError}</span>}

            </div>
            <div className="relative">
              <label className="text-xs lg:text-sm text-gray-700 font-medium">PASSWORD</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none pr-12 text-sm lg:text-base"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />
              {passwordError && <span className="text-red-500 text-xs font-medium mt-1">{passwordError}</span>}
              <button
                type="button"
                className="absolute right-5 top-11 text-md text-blue-600 hover:text-blue-800 font-semibold select-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiShowAlt /> : <BiHide />}
              </button>
            </div>
            <div className="flex justify-between mb-8">
              <div className="flex items-center gap-2 text-xs lg:text-sm">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(prev => !prev)}
                  className="w-4 h-4"
                />
                <label htmlFor="remember" className="text-gray-600 font-medium">
                  Remember me
                </label>
              </div>
              <div className="text-right text-xs lg:text-sm text-gray-600 hover:underline">
                <Link href="/forgot-password" className="text-blue-500 font-semibold">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-400 transition text-sm lg:text-base"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
