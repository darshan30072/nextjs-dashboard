// src/models/auth.model.ts

// ---- Login ----
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

// ---- Send otp ----
export interface SendOtpPayload {
  email: string;
}

export interface SendOtpResponse {
  statusCode: number;
  message: string;
}

// ---- Verification ----
export interface VerifyOtpPayload {
    email: string;
    otp: number;
}

export interface VerifyOtpResponse {
    statusCode: number;
    message: string;
}

// ---- Reset Passwrod ----
export interface ResetPasswordPayload {
    email: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    statusCode: number;
    message: string;
    token?: string;
}
