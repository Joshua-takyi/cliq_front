import client from "@/libs/connect";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Unwrap the params Promise for Next.js compatibility
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Valid slug is required" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("shop");

    const projection = {
      orderId: 1,
      items: 1,
      status: 1,
      createdAt: 1,
    };

    const order = await db.collection("orders").findOne(
      { orderId: slug.trim() },
      { projection } // Remove this line if you want all fields
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.length === 0) {
      return NextResponse.json(
        { message: "no items found in the order " },
        { status: 204 }
      );
    }
    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Always close the connection
    try {
      await client.close();
    } catch (closeError) {
      console.error("Error closing database connection:", closeError);
    }
  }
}
