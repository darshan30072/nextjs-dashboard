// src/viewmodels/auth/newPassword.vm.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { resetPasswordService } from "@/services/authService";

export function useNewPasswordVM() {
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
      toast.error("No email found. Please restart the reset process.");
      router.push("/forgot-password");
    }
  }, [router]);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async () => {
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
      const data = await resetPasswordService({ email, newPassword: password });
      if (data.statusCode === 200) {
        toast.success(data.message || "Password changed successfully");
        console.log("Redirecting to login page...");  // Debug
        router.push("/login");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    loading,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleSubmit
  };
}
