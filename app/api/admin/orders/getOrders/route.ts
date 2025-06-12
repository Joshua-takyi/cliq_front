import { auth } from "@/auth";
import client from "@/libs/connect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userRole = session?.user?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access. Only admins can view orders.",
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const searchParams = new URL(request.url).searchParams;
    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      page = 1;
      limit = 10;
    }
    await client.connect();
    const db = client.db("shop");

    const data = await db
      .collection("orders")
      .find({})
      .project({
        _id: 1,
        amount: 1,
        email: 1,
        userId: 1,
        items: 1,
        createdAt: 1,
        deliveryStatus: 1,
        "payment.method": 1,
        "payment.status": 1,
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json(
        {
          success: true,
          message: "No orders found.",
          data: [],
        },
        { status: 204 }
      );
    }

    const count = data.length;
    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully.",
      data: data,
      count: count,
      page: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching orders.",
        eorror: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
