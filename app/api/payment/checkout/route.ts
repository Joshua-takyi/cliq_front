// USE DETAILED ERROR HANDLING

import axios from "axios";
import { NextResponse } from "next/server";

interface PaymentBody {
  amount: number;
  email: string;
  callback_url?: string;
  currency?: string;
  metadata?: {
    shippingInfo?: {
      name: string;
      phone: string;
      email?: string;
      region: string;
      street: string;
      ghana_post?: string;
      city?: string;
      notes?: string;
    };
    cartItems?: any[];
  };
}

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error(
        "Paystack secret key is not configured in environment variables"
      );
      return NextResponse.json(
        {
          success: false,
          error: "Secret key is not defined.",
          message:
            "An error occurred while processing your request. Please try again later or contact support if the issue persists.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { amount, email, shippingInfo } = body;

    // Enhanced validation with specific error messages
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      console.error("Invalid payment amount:", amount);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
          message: "Amount must be a valid number greater than zero.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      console.error("Payment request missing email:", body);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data: email is required.",
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin");
    const finalCallbackUrl = `${origin}/payment/verify`;

    if (!finalCallbackUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "callback URL could not be determined.",
          message: "Please include a callback_url or ensure origin is set.",
        },
        { status: 400 }
      );
    }

    const amountInPesewas = Math.round(amount * 100);

    const httpReqBody: PaymentBody = {
      email,
      amount: amountInPesewas,
      callback_url: finalCallbackUrl,
      currency: "GHS",
      metadata: {
        ...(shippingInfo && { shippingInfo }),
        ...(body.cartItems && { cartItems: body.cartItems }),
      },
    };
    // console.log("Sending to Paystack:", httpReqBody);
    const baseUrl = "https://api.paystack.co/transaction/initialize";
    const res = await axios.post(baseUrl, httpReqBody, {
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.data || res.data.status !== true) {
      console.error("Paystack initialization failed:", res.data);
      return NextResponse.json(
        {
          success: false,
          error: "Payment initialization failed.",
          message:
            (res.data && res.data.message) ||
            "An error occurred while initializing payment.",
          details: res.data,
        },
        { status: 500 }
      );
    }

    // console.log("Payment initialized successfully:", res.data);
    return NextResponse.json({
      success: true,
      message: "Payment initialized successfully",
      data: res.data,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return NextResponse.json(
        {
          success: false,
          error: error.response?.data?.message || error.message,
          message: "Payment service failed. Please try again.",
        },
        { status: error.response?.status || 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
