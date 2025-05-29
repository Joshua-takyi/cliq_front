import { auth } from "@/auth";
import client from "@/libs/connect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = session.user;
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get query parameters for pagination (optional)
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await client.connect();
    const db = client.db();

    // Convert the userId string to a MongoDB ObjectId
    const userIdToObjectId = new mongoose.Types.ObjectId(id);

    // Find all orders for this user with pagination
    const orders = await db
      .collection("orders")
      .find({ userId: userIdToObjectId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(); // Convert cursor to array

    // Get total count for pagination metadata
    const totalOrders = await db
      .collection("orders")
      .countDocuments({ userId: userIdToObjectId });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user", orders: [] },
        { status: 200 } // Return 200 with empty array instead of 404
      );
    }

    // Return orders with pagination metadata
    return NextResponse.json(
      {
        data: orders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          pages: Math.ceil(totalOrders / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        message: "Failed to retrieve orders. Please try again later.",
      },
      { status: 500 }
    );
  } finally {
    // Ensure connection is closed
    await client.close();
  }
}
