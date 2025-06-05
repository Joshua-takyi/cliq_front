import { auth } from "@/auth";
import client from "@/libs/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { ProcessingOrderTemplate } from "@/libs/email/templates/processingOrder";
import { ShippedOrderTemplate } from "@/libs/email/templates/shippedOrder";
import { DeliveredOrderTemplate } from "@/libs/email/templates/deliveredOrder";
import { CancelledOrderTemplate } from "@/libs/email/templates/cencelOrder";
import { title } from "process";

export async function PATCH(req: Request) {
  try {
    const { id, deliveryStatus } = await req.json();

    if (!id || !deliveryStatus) {
      return NextResponse.json({ error: 'Order ID and delivery status are required' }, { status: 400 });
    }

    // Use a union type for deliveryStatus
    type DeliveryStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    const validStatuses: DeliveryStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(deliveryStatus)) {
      return NextResponse.json({ error: 'Invalid delivery status' }, { status: 400 });
    }

    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // Use non-deprecated ObjectId creation
    const convertedId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!convertedId) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'Email configuration is missing' }, { status: 500 });
    }

    const db = client.db();
    const orders = db.collection('orders');

    const existingOrder = await orders.findOne({ _id: convertedId });
    if (!existingOrder || !existingOrder.shippingInfo || !existingOrder.items) {
      return NextResponse.json({ error: 'Order not found or incomplete' }, { status: 404 });
    }

    await orders.updateOne({ _id: convertedId }, { $set: { deliveryStatus } });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      secure: true,
    });

    const sendEmail = (to: string, subject: string, html: string, from: string) =>
      transporter.sendMail({ to, subject, html, from });

    const statusMessages: Record<DeliveryStatus, string> = {
      processing: 'Order status updated to processing and email sent successfully',
      shipped: 'Order status updated to shipped and email sent successfully',
      delivered: 'Order status updated to delivered and email sent successfully',
      cancelled: 'Order status updated to cancelled and email sent successfully',
      pending: 'Order status updated to pending' // No email for pending
    };


    /**
     * If the delivery status is not 'pending' and the order has a shipping email,
     * send a status update email to the customer using the appropriate template.
     * 
     * - Maps the current delivery status to its corresponding email template function.
     * - Generates the email content with order details.
     * - Sends the email to the customer's shipping email address.
     */
    if (deliveryStatus !== 'pending' && existingOrder.shippingInfo?.email) {
      // Map deliveryStatus to template function
      const templates: Record<Exclude<DeliveryStatus, 'pending'>, any> = {
        processing: ProcessingOrderTemplate,
        shipped: ShippedOrderTemplate,
        delivered: DeliveredOrderTemplate,
        cancelled: CancelledOrderTemplate,
      };

      const templateFn = templates[deliveryStatus as Exclude<DeliveryStatus, 'pending'>];
      if (templateFn) {
        const emailTemplate = templateFn({
          orderId: existingOrder.orderId || "",
          customerName: existingOrder.shippingInfo?.name || "",
          orderDate: new Date(existingOrder.createdAt),
          items: existingOrder.items.map((item: any) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            image: item.image || undefined,
          })),
          currency: existingOrder.currency || 'GHS',
          shippingInfo: existingOrder.shippingInfo,
          total: existingOrder.amount,
        });

        await sendEmail(
          existingOrder.shippingInfo.email,
          emailTemplate.subject,
          emailTemplate.body,
          process.env.EMAIL_USER as string
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: statusMessages[deliveryStatus as DeliveryStatus],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }, { status: 500 });
  }
}
