// USE DETAILED ERROR HANDLING
import { NextResponse } from "next/server";
import crypto from "crypto";
import client from "@/libs/connect";

export async function POST(req: Request) {
  console.log("Webhook endpoint called"); // Debug log to confirm route is being hit

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // Check if secret key exists
    if (!secret) {
      console.error("Missing Paystack secret key in environment variables");
      return NextResponse.json(
        {
          success: false,
          error: "Secret key is not defined.",
          message: "secret key is not defined in environment variables",
        },
        { status: 500 }
      );
    }

    // Compute signature from request body
    const computedSignature = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    // Validate signature for security
    // Only proceed if signatures match to ensure request is from Paystack
    try {
      if (
        !signature ||
        !crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(computedSignature)
        )
      ) {
        console.error("Webhook signature verification failed");
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized: Signature verification failed",
          },
          { status: 401 }
        );
      }
    } catch (signatureError) {
      console.error("Error during signature verification:", signatureError);
      return NextResponse.json(
        {
          success: false,
          message: "Signature verification error",
          error:
            signatureError instanceof Error
              ? signatureError.message
              : String(signatureError),
        },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const data = JSON.parse(rawBody);
    console.log("Webhook event received:", data.event); // Log the event type

    // Handle different event types
    if (data.event === "charge.success") {
      const { amount, metadata } = data.data;

      // Enhanced validation for required fields
      if (!amount || !metadata) {
        console.error("Invalid payload: Missing amount or metadata");
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid payload: Required fields (amount, metadata) are missing",
          },
          { status: 400 }
        );
      }

      // Process the payment here
      try {
        // Connect to database
        await client.connect();
        const db = client.db();

        // Start a session for transaction
        const session = client.startSession();
        session.startTransaction();

        try {
          const orders = db.collection("orders");
          const users = db.collection("users");

          // Find user by email from metadata
          const user = await users.findOne(
            { email: metadata.shippingInfo.email },
            { session }
          );

          if (!user) {
            console.error(
              `User not found for email: ${metadata.shippingInfo.email}`
            );
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json(
              {
                success: false,
                message: `User not found for email: ${metadata.email}`,
              },
              { status: 404 }
            );
          } else {
            // Create new order with comprehensive details
            const order = {
              userId: user._id,
              amount,
              status: "paid",
              metadata,
              paymentReference: data.data.reference,
              transactionId: data.data.id,
              paymentChannel: data.data.channel,
              paymentDate: new Date(),
              createdAt: new Date(),
            };

            // Insert order into database
            const result = await orders.insertOne(order, { session });

            if (result.acknowledged) {
              // Update user balance or any other necessary operations
              await users.updateOne(
                { _id: user._id },
                { $inc: { balance: amount } },
                { session }
              );

              // Commit the transaction
              await session.commitTransaction();
              session.endSession();

              console.log(`Order created successfully: ${result.insertedId}`);
              return NextResponse.json({
                success: true,
                orderId: result.insertedId,
                message: "Payment processed successfully",
              });
            } else {
              // Handle failed order creation
              await session.abortTransaction();
              session.endSession();

              console.error(
                "Failed to create order: Database operation not acknowledged"
              );
              return NextResponse.json(
                {
                  success: false,
                  message:
                    "Failed to create order: Database operation not acknowledged",
                },
                { status: 500 }
              );
            }
          }
        } catch (dbError) {
          // Handle database operation errors
          await session.abortTransaction();
          session.endSession();

          console.error("Database operation error:", dbError);
          return NextResponse.json(
            {
              success: false,
              error:
                dbError instanceof Error
                  ? dbError.message
                  : "An unknown database error occurred",
              message: "Failed to process payment due to database error",
            },
            { status: 500 }
          );
        } finally {
          // Ensure client connection is properly handled
          if (client) {
            try {
              await client.close();
            } catch (closeError) {
              console.error("Error closing database connection:", closeError);
            }
          }
        }
      } catch (processError) {
        console.error("Error processing payment:", processError);
        return NextResponse.json(
          {
            success: false,
            error:
              processError instanceof Error
                ? processError.message
                : String(processError),
            message: "Failed to process payment",
          },
          { status: 500 }
        );
      }
    } else {
      // Handle other event types - IMPORTANT: Always return a response
      console.log(`Unhandled event type: ${data.event}`);
      return NextResponse.json({
        success: true,
        message: `Webhook received for event: ${data.event}`,
        info: "Event acknowledged but no specific processing required",
      });
    }
  } catch (error) {
    // Global error handler for unexpected errors
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "An unexpected error occurred while processing the webhook",
      },
      { status: 500 }
    );
  }
}
