"use client";

import axiosInstance from "@/utils/services/axiosInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Verification() {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No email found, please start the reset process again.");
      router.push("/forgot-password");
    }
  }, [router]);

  // Start countdown on mount and resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  // Handle change: supports typing + pasting
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newCode = [...code];

    if (value.length > 1) {
      // Handle paste (e.g., user pastes 123456)
      value.split("").forEach((char, i) => {
        if (i < 6) {
          newCode[i] = char;
          if (inputsRef.current[i]) {
            inputsRef.current[i]!.value = char;
          }
        }
      });
      setCode(newCode);
      inputsRef.current[5]?.focus(); // focus last
    } else {
      // Handle normal input
      newCode[index] = value;
      setCode(newCode);
      if (value && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // Optional: handle backspace to focus previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!email) return;

    setTimer(60);
    setResendDisabled(true);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/v1/send-otp", { email });
      const data = response.data;

      if (data.statusCode === 200) {
        toast.success(data.message || `Verification code resent to ${email}`);
      } else {
        toast.error(data.message || "Failed to resend code.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Something went wrong while resending code.");
      // Reset resendDisabled so user can try again
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };


  // Handle OTP verification submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const fullCode = code.join("");
    if (fullCode.length < 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/v1/verify-otp", { email, otp: Number(fullCode) });

      const data = response.data;

      if (data.statusCode === 200) {
        router.push("/new-password");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Invalid verification code.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-screen h-screen bg-white">
      {/* Splash image (hidden on mobile/tablet) */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-4">
        <Image
          src={"/images/Splash-screen.jpg"}
          alt="Splash Screen"
          width={500}
          height={500}
          className="shadow-2xl shadow-cyan-300 rounded-3xl max-w-full h-auto"
          priority
        />
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-tr from-blue-900 to-blue-950 p-6 h-screen">
        <div className="w-full max-w-md bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <div className="text-center text-blue-900 mb-6">
            <h1 className="text-xl lg:text-3xl font-bold">Verification</h1>
            <p className="text-xs lg:text-sm">We have sent a code to your email</p>
            <p className="text-xs lg:text-sm font-bold">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              {[0, 1, 2, 3, 4, 5].map((_, index) => (
                <input
                  key={index}
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={code[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => {handleKeyDown(index, e)}}
                  className="w-1/6 py-3 text-center font-bold border-none rounded-lg focus:outline-none text-gray-700 bg-gray-100"
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
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
