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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if( email !== "admin@gmail.com" || password !== "admin@123") {
      alert("Access Denied: Only Admin can log in.")
      return;
    }
    try {
      const res = await fetch("https://food-admin.wappzo.com/api/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data)

      if (res.ok) {
        console.log("Login successful:", data);
        setCookie("token", data.token, 24)
        toast.success("Login Successful!");
        // router.push("/dashboard");
        location.pathname = "/dashboard"
      } else {
        toast.error("Login Failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login Failed...!");
    }
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="text-xs lg:text-sm text-gray-700 font-medium">PASSWORD</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none pr-12 text-sm lg:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-5 top-11 text-md text-blue-600 hover:text-blue-800 font-semibold select-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiShowAlt /> : <BiHide />}
              </button>
            </div>
            <div className="text-right text-xs lg:text-sm text-gray-600 hover:underline">
              <Link href="/forgot-password" className="text-blue-500 font-semibold">
                Forgot Password?
              </Link>
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
