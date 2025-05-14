import { NextResponse } from "next/server";
import client from "@/libs/connect";
import { hash } from "bcrypt";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const { name, email, password, role = "user" } = await request.json();

    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation (at least 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState != 1) {
      await client.connect();
    }
    const db = client.db();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Only allow specific roles
    const validRoles = ["user", "admin", "editor"];
    const userRole = validRoles.includes(role) ? role : "user";

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      createdAt: new Date(),
    });

    // Return success response without exposing sensitive data
    return NextResponse.json(
      {
        message: "Registration successful",
        userId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Server error during registration" },
      { status: 500 }
    );
  }
}
