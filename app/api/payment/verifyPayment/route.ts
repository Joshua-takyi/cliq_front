import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
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

    const { reference } = await request.json();
    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data.",
          message: "Please provide a valid payment reference.",
        },
        { status: 400 }
      );
    }

    const baseUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const res = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.data || res.data.status !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed.",
          message:
            res.data.message ||
            "An error occurred while processing your request.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: res.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message:
          "An error occurred while processing your request. Please try again later or contact support if the issue persists.",
      },
      { status: 500 }
    );
  }
}
