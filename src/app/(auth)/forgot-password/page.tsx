"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // if (email !== "admin@gmail.com") {
    //   toast.error("Email not found.")
    //   return;
    // }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const res = await fetch(`${baseUrl}/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log(data)

      if (res.ok) {
        // Save email to localStorage so you can access it in verification page
        localStorage.setItem("resetEmail", email);
        router.push("/verification");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-screen h-screen bg-white">
      {/* Left: Splash Image (hidden on mobile/tablet) */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-4">
        <Image
          src={"/Splash-screen2.jpg"}
          alt="Splash Screen"
          width={500}
          height={500}
          className="shadow-2xl shadow-cyan-300 rounded-3xl max-w-full h-auto"
          priority
        />
      </div>

      {/* Right: Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-tr from-blue-900 to-blue-950 p-6 h-screen">
        <div className="w-full max-w-md bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <div className="text-center text-blue-900 mb-6">
            <h1 className="text-xl lg:text-3xl font-bold">Forgot Password</h1>
            <p className="text-xs lg:text-sm text-gray-600 font-medium">Please enter your email to receive a code</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-10">
              <label className="text-xs lg:text-sm text-gray-700 font-medium">EMAIL</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none text-sm lg:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-400 transition text-sm lg:text-base disabled:opacity-50"
            >
              {loading ? "Sending..." : "SEND CODE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
