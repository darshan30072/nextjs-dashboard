// src/viewmodels/auth/verification.vm.ts

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { verifyOtpService, resendOtpService } from "@/services/authService";

export function useVerificationVM() {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No email found. Please start again.");
      router.push("/forgot-password");
    }
  }, [router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      value.split("").forEach((char, i) => {
        if (i < 6) {
          newCode[i] = char;
          inputsRef.current[i]!.value = char;
        }
      });
      setCode(newCode);
      inputsRef.current[5]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index]) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setTimer(60);
    setResendDisabled(true);
    setLoading(true);

    try {
      const data = await resendOtpService(email);
      if (data.statusCode === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Resend failed");
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email) return;
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtpService({ email, otp: Number(fullCode) });
      if (data.statusCode === 200) {
        router.push("/new-password");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
