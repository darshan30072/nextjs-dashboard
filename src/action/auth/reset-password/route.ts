// /app/api/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password: newpassword } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const response = await fetch(`${baseUrl}/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newpassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data)
      return NextResponse.json(data, { status: response.status });
    }

    const res = NextResponse.json({ message: "Reset-password successful", token: data.token });

    return res;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
