import { signIn } from "@/auth";
import client from "@/libs/connect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    if (mongoose.connection.readyState != 1) {
      await client.connect();
    }

    //use auth js

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    if (res?.error) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Sign-in successful",
      user: res?.user,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "Server error during sign-in" },
      { status: 500 }
    );
  }
}
