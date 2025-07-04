import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosInstance from "@/utils/services/axiosInstance";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const response = await axiosInstance.post(
      "/v1/restaurant/login",
      { email, password },
    );

    const data = response.data;

    const res = NextResponse.json({ message: "Login successful", token: data.token });

    // Set auth token in cookie (server-side)
    res.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login API error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
