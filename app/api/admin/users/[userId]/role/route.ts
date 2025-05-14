import { NextResponse } from "next/server";
import client from "@/libs/connect";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";

// Endpoint to update a user's role (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if the current user is an admin
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body for the new role
    const { role } = await request.json();
    if (!role) {
      return NextResponse.json(
        { message: "Role is required" },
        { status: 400 }
      );
    }

    // Validate the role
    const validRoles = ["user", "admin", "editor"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db();
    const users = db.collection("users");

    // Check if the user exists
    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await users.findOne({ _id: objectId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update the user's role
    const result = await users.updateOne({ _id: objectId }, { $set: { role } });

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 200 });
    }

    return NextResponse.json({
      message: "User role updated successfully",
      userId,
      role,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: "Server error while updating user role" },
      { status: 500 }
    );
  }
}
