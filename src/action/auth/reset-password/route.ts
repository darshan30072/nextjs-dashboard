import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosInstance from "@/utils/services/axiosInstance";

export async function POST(req: NextRequest) {
  try {
    const { email, password: newPassword } = await req.json();

    const response = await axiosInstance.post("/v1/reset-password", { email, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    return NextResponse.json(
      { message: "Reset-password successful", token: data.token, statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset-password API error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
