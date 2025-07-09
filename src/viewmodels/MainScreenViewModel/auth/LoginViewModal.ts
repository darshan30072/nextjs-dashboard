// src/viewmodels/auth/login.vm.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginService } from "@/services/authService";
import setCookie from "@/constant/cookie";

export function useLoginVM() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

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

  const handleLogin = async () => {
    if (!validateForm()) return;

    if (email !== "admin@gmail.com" || password !== "admin@123") {
      toast.error("Access Denied: Only Admin can log in.");
      return;
    }

    try {
      const data = await loginService({ email, password });

      if (data.token) {
        setCookie("token", data.token, rememberMe ? 24 * 7 : 24);
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error("Login Failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login Failed!");
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    emailError,
    passwordError,
    handleLogin
  };
}
