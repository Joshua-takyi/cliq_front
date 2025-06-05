import { NextResponse } from "next/server";
import crypto from "crypto";
import { GenerateOrderConfirmationEmail, OrderProps } from "@/libs/email/templates/confirmOrder";
import client from "@/libs/connect";
import { ItemsProp } from "@/libs/email/templates/confirmOrder";
import nodemailer from "nodemailer";
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

          //  DEBUGGING LOGS
          console.log(`Order created: ${order.orderId}`);
          console.log(`Customer: ${metadata.shippingInfo.name}`);
          console.log(`Amount: ${order.currency} ${order.amount}`);

          await client.close();



          // SEND AN ORDER CONFIRMATION EMAIL
          if (!order.orderId || !order.amount || !order.items || !order.shippingInfo || !order.shippingInfo.email) {
            console.error("Missing required order details for email");
            return NextResponse.json(
              { success: false, message: "Missing order details for email" },
              { status: 400 }
            );
          }

          const formattedOrderDetails: OrderProps = {
            orderId: order.orderId || "",
            email: order.email,
            status: order.status,
            deliveryStatus: order.deliveryStatus || "pending",
            amount: order.amount,
            currency: order.currency,
            items: order.items.map((item: ItemsProp) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              color: item.color // Include color if it exists
            })),
            shippingInfo: {
              name: order.shippingInfo.name || "",
              email: order.shippingInfo.email || "",
              phone: order.shippingInfo.phone || "",
              region: order.shippingInfo.region || "",
              street: order.shippingInfo.street || "",
              city: order.shippingInfo.city || "",
              ghana_post: order.shippingInfo.ghanaPostCode || "", // Fixed property name
              notes: order.shippingInfo.note || "", // Fixed property name
            },
            createdAt: new Date(order.createdAt),
            // Add the missing payment property
            // TODO implemnt pay on delivery
            payment: {
              method: order.payment.method,
              status: order.payment.status,
              reference: order.payment.reference
            }
          };

          if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Email credentials are not set in environment variables");
          }

          // CREATE A TRANSPORTER FOR THE EMAIL
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            secure: true,
          });

          const emailTemplate = GenerateOrderConfirmationEmail(formattedOrderDetails);



          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: order.shippingInfo.email,
            subject: emailTemplate.subject,
            html: emailTemplate.body,
          })

          return NextResponse.json({
            message: "Order created and email sent successfully",
          }, { status: 201 });
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
