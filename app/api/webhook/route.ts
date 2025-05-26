import { NextResponse } from "next/server";
import crypto from "crypto";
import client from "@/libs/connect";

// Simple function to generate order ID
function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
}

export async function POST(req: Request) {
  console.log("Webhook endpoint called");

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error("Missing Paystack secret key");
      return NextResponse.json(
        { success: false, message: "Secret key missing" },
        { status: 500 }
      );
    }

    // Verify signature
    const computedSignature = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (!signature || signature !== computedSignature) {
      console.error("Invalid signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook data
    const webhookData = JSON.parse(rawBody);
    console.log("Event:", webhookData.event);

    // Only handle successful payments
    if (webhookData.event === "charge.success") {
      const { data } = webhookData;
      const { amount, metadata, reference } = data;

      // Basic validation
      if (!amount || !metadata?.shippingInfo?.email) {
        return NextResponse.json(
          { success: false, message: "Missing required data" },
          { status: 400 }
        );
      }

      try {
        await client.connect();
        const db = client.db();

        // Check if order already exists (prevent duplicates)
        const existingOrder = await db.collection("orders").findOne({
          "payment.reference": reference,
        });

        if (existingOrder) {
          console.log(`Order already exists for reference: ${reference}`);
          return NextResponse.json({
            success: true,
            message: "Order already processed",
          });
        }

        // Find user by email
        const user = await db.collection("users").findOne({
          email: metadata.shippingInfo.email.toLowerCase(),
        });

        if (!user) {
          console.error(`User not found: ${metadata.shippingInfo.email}`);
          return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
          );
        }

        // Create simple order object
        const order = {
          orderId: generateOrderId(),
          userId: user._id,
          email: metadata.shippingInfo.email.toLowerCase(),

          // Order status (production-ready delivery statuses)
          status: "confirmed", // confirmed -> processing -> shipped -> delivered -> cancelled
          deliveryStatus: "pending", // pending -> preparing -> shipped -> out_for_delivery -> delivered

          // Financial info
          amount: amount / 100, // Convert from kobo/pesewas
          currency: data.currency || "GHS",

          // Items from cart
          items: metadata.cartItems || [],

          // Shipping info
          shippingInfo: metadata.shippingInfo,

          // Payment info
          payment: {
            method: data.channel, // mobile_money, card, etc.
            status: "completed",
            provider: "paystack",
            reference: reference,
            paystackId: data.id,
            paidAt: new Date(data.paid_at),
          },

          // Delivery tracking
          delivery: {
            estimatedDate: null, // Set when order moves to processing
            actualDate: null, // Set when delivered
            trackingNumber: null, // Set when shipped
            carrier: null, // Set when shipped (e.g., "DHL", "UPS")
            notes: [],
          },

          // Timestamps
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Save order
        const result = await db.collection("orders").insertOne(order);

        if (result.acknowledged) {
          console.log(`Order created: ${order.orderId}`);
          console.log(`Customer: ${metadata.shippingInfo.name}`);
          console.log(`Amount: ${order.currency} ${order.amount}`);

          await client.close();

          return NextResponse.json({
            success: true,
            orderId: result.insertedId,
            orderNumber: order.orderId,
            status: order.status,
            deliveryStatus: order.deliveryStatus,
            message: "Payment processed successfully",
          });
        } else {
          throw new Error("Failed to create order");
        }
      } catch (error) {
        console.error("Database error:", error);
        try {
          await client.close();
        } catch (closeError) {
          console.error("Error closing connection:", closeError);
        }
        return NextResponse.json(
          { success: false, message: "Database error" },
          { status: 500 }
        );
      }
    } else {
      // Handle other events
      console.log(`Unhandled event: ${webhookData.event}`);
      return NextResponse.json({ success: true, message: "Event received" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/* 
DELIVERY STATUS FLOW (Production Ready):

Order Status:
- confirmed: Payment successful, order confirmed
- processing: Order being prepared/packed
- shipped: Order shipped to customer
- delivered: Order delivered successfully
- cancelled: Order cancelled

Delivery Status:
- pending: Waiting to be processed
- preparing: Being packed/prepared
- shipped: In transit to customer
- out_for_delivery: Out for final delivery
- delivered: Successfully delivered

Usage Example for updating status:
// Move order to processing
await db.collection("orders").updateOne(
  { orderId: "ORD-12345" },
  { 
    $set: { 
      status: "processing",
      deliveryStatus: "preparing",
      updatedAt: new Date()
    }
  }
);

// Ship order
await db.collection("orders").updateOne(
  { orderId: "ORD-12345" },
  { 
    $set: { 
      status: "shipped",
      deliveryStatus: "shipped",
      "delivery.trackingNumber": "TRK123456",
      "delivery.carrier": "DHL",
      "delivery.estimatedDate": new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      updatedAt: new Date()
    }
  }
);

// Deliver order
await db.collection("orders").updateOne(
  { orderId: "ORD-12345" },
  { 
    $set: { 
      status: "delivered",
      deliveryStatus: "delivered",
      "delivery.actualDate": new Date(),
      updatedAt: new Date()
    }
  }
);
*/
