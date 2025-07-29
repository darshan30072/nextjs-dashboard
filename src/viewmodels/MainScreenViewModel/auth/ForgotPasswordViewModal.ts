'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sendOtpService } from "@/services/authService";

export function useForgotPasswordVM() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
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
    return isValid;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await sendOtpService({ email });

      if (data.statusCode === 200) {
        localStorage.setItem("resetEmail", email);
        router.push("/verification");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error("Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    emailError,
    loading,
    handleSendOtp
  };
}
