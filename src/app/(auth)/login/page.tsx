"use client";

import Link from "next/link";
import Image from "next/image";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { useLoginVM } from "@/viewmodels/MainScreenViewModel/auth/LoginViewModal";

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    emailError, passwordError,
    handleLogin
  } = useLoginVM();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-screen h-screen bg-white">
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

      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-tr from-blue-900 to-blue-950 p-6 h-screen">
        <div className="w-full max-w-md bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <div className="text-center text-blue-900 mb-6">
            <h1 className="text-xl lg:text-3xl font-bold">Log In</h1>
            <p className="text-xs lg:text-sm text-gray-600 font-medium">Please sign in to your existing account</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
              <label className="text-xs lg:text-sm text-gray-700 font-medium">EMAIL</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none text-sm lg:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <span className="text-red-500 text-xs font-semibold mt-1">{emailError}</span>}
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
              {passwordError && <span className="text-red-500 text-xs font-semibold mt-1">{passwordError}</span>}
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
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="remember" className="text-gray-600 font-medium cursor-pointer">
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
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-400 transition text-sm lg:text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
