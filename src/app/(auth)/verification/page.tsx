"use client";

import Image from "next/image";
import { useVerificationVM } from "@/viewmodels/MainScreenViewModel/auth/VerificationViewModal";

export default function VerificationPage() {
  const {
    email,
    code,
    timer,
    resendDisabled,
    loading,
    inputsRef,
    handleChange,
    handleKeyDown,
    handleResend,
    handleSubmit,
  } = useVerificationVM();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

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
            <h1 className="text-xl lg:text-3xl font-bold">Verification</h1>
            <p className="text-xs lg:text-sm">We have sent a code to your email</p>
            <p className="text-xs lg:text-sm font-bold">{email}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="flex justify-between items-center text-xs lg:text-sm text-gray-700">
              <label className="font-medium">CODE</label>
              {resendDisabled ? (
                <p className="text-gray-400">Resend in {timer}s</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold underline text-blue-500"
                  disabled={loading}
                >
                  Resend
                </button>
              )}
            </div>

            <div className="flex justify-between gap-2">
              {code.map((value, index) => (
                <input
                  key={index}
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-1/6 py-3 text-center font-bold border-none rounded-lg focus:outline-none text-gray-700 bg-gray-100"
                  ref={(el) => {inputsRef.current[index] = el;}}
                  disabled={loading}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white mt-3 py-3 rounded-xl hover:bg-orange-400 transition text-sm lg:text-base disabled:opacity-50"
            >
              {loading ? "Verifying..." : "VERIFY"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
