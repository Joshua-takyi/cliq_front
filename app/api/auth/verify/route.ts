import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get the session using the built-in auth helper
    const session = await auth();

    // If no session or user, return unauthorized
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the user information in a format our Go backend expects
    return NextResponse.json({
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role || "user",
      // Add other fields as needed
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
