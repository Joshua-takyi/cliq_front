import { auth } from "@/auth";
import client from "@/libs/connect";
import { NextResponse } from "next/server";

// Endpoint to retrieve all users (admin only)
export async function GET() {
  try {
    // Check if the current user is an admin
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db();
    const users = db.collection("users");

    // Find all users, but don't return passwords
    const allUsers = await users.find({}).project({ password: 0 }).toArray();

    // Format users to match the expected structure
    const formattedUsers = allUsers.map((user) => ({
      id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      image: user.image || null,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Server error while fetching users" },
      { status: 500 }
    );
  }
}
