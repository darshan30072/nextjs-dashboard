import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { email, password: newpassword } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const response = await axios.post(
      `${baseUrl}/v1/auth/reset-password`,
      { email, newpassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    return NextResponse.json(
      { message: "Reset-password successful", token: data.token },
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
