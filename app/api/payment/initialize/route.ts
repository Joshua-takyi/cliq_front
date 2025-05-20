import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency, callback_url, email, metadata } =
      await req.json();
    if (!amount || !email) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Please provide all required fields",
        },
        { status: 400 }
      );
    }
    const reqBody = {
      amount,
      email,
    };
    const res = await axios.post(
      `https://api.paystack.co/transaction/initialize`,
      reqBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.data) {
      return NextResponse.json(
        {
          error: "No data returned from checkout API",
          message: "Error during checkout",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      data: res.data,
      message: "Checkout initialized successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        message: "Error during checkout",
      },
      { status: 500 }
    );
  }
}
