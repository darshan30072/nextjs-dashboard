// /app/api/verify/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { otp,  email } = await req.json();

    const response = await fetch("https://food-admin.wappzo.com/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Verify-OTP API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
