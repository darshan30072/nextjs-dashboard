import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosInstance from "@/utils/services/axiosInstance";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const response = await axiosInstance.post("/v1/send-otp", { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Send-OTP API error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    }

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
