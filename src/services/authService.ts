import {
    LoginPayload, LoginResponse,
    ResetPasswordPayload, ResetPasswordResponse,
    SendOtpPayload, SendOtpResponse,
    VerifyOtpPayload, VerifyOtpResponse
    } from "@/models/authModel";
import axiosInstance from "@/utils/services/axiosInstance";

// ---- Login ----
export async function loginService(payload: LoginPayload): Promise<LoginResponse> {
    const response = await axiosInstance.post("/v1/restaurant/login", payload);
    return response.data.data;
}

// ---- Send  otp ----
export async function sendOtpService(payload: SendOtpPayload): Promise<SendOtpResponse> {
    const response = await axiosInstance.post("/v1/send-otp", payload);
    return response.data;
}

// ---- Verification ----
export async function verifyOtpService(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const response = await axiosInstance.post("/v1/verify-otp", payload);
    return response.data;
}

export async function resendOtpService(email: string): Promise<VerifyOtpResponse> {
    const response = await axiosInstance.post("/v1/send-otp", { email });
    return response.data;
}

// ---- Reset Password ----
export async function resetPasswordService(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
    const response = await axiosInstance.post("/v1/reset-password", payload);
    return response.data;
}