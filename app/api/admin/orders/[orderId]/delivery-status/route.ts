import { NextRequest, NextResponse } from "next/server";
import { DeliveryStatus, DeliveryStatusUpdate } from "@/types/order_types";
import { z } from "zod"; // Assuming you use zod for validation

/**
 * Request body validation schema for delivery status updates
 * This ensures we receive valid data for status updates
 */
const deliveryStatusSchema = z.object({
  status: z.nativeEnum(DeliveryStatus, {
    errorMap: () => ({ message: "Invalid delivery status value" }),
  }),
  notes: z.string().optional(),
});

/**
 * GET endpoint to retrieve the current delivery status of an order
 * @param request - The incoming request
 * @param params - URL parameters containing orderId
 * @returns NextResponse with delivery status data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: Order ID is required",
          message: "Order ID is missing in the request parameters",
        },
        { status: 400 }
      );
    }

    // TODO: Implement database fetch for order delivery status
    // Example:
    // const order = await db.orders.findUnique({
    //   where: { id: orderId },
    //   select: { deliveryStatus: true, updatedAt: true }
    // });

    // Mock response for now
    const mockOrder = {
      deliveryStatus: DeliveryStatus.PROCESSING,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Delivery status retrieved successfully",
      data: {
        orderId,
        status: mockOrder.deliveryStatus,
        lastUpdated: mockOrder.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching delivery status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message:
          "Failed to retrieve delivery status. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH endpoint to update the delivery status of an order
 * This endpoint is typically used by admin or logistics personnel
 * @param request - The incoming request with delivery status update
 * @param params - URL parameters containing orderId
 * @returns NextResponse with updated status or error
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: Order ID is required",
          message: "Order ID is missing in the request parameters",
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = deliveryStatusSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      console.error("Validation error:", errorMessage);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          message: `Validation failed: ${errorMessage}`,
        },
        { status: 400 }
      );
    }

    const updateData: DeliveryStatusUpdate = validationResult.data;

    // TODO: Implement database update with prisma or your DB client
    // Example:
    // const updatedOrder = await db.order.update({
    //   where: { id: orderId },
    //   data: {
    //     deliveryStatus: updateData.status,
    //     ...(updateData.notes && { statusNotes: updateData.notes })
    //   },
    //   select: { id: true, deliveryStatus: true, updatedAt: true }
    // });

    // For now, return a mock response
    const mockUpdated = {
      id: orderId,
      deliveryStatus: updateData.status,
      updatedAt: new Date().toISOString(),
    };

    // Log the status change
    console.log(
      `Order ${orderId} delivery status updated to ${updateData.status}`,
      updateData.notes ? `Notes: ${updateData.notes}` : ""
    );

    // TODO: Send notification to customer about status change
    // Example: await notifyCustomer(orderId, updateData.status);

    return NextResponse.json({
      success: true,
      message: `Delivery status updated successfully to ${updateData.status}`,
      data: {
        orderId,
        status: mockUpdated.deliveryStatus,
        lastUpdated: mockUpdated.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error updating delivery status:", error);

    if (error.code === "P2025") {
      // Prisma error for record not found
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
          message: `No order exists with ID: ${params.orderId}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message:
          "Failed to update delivery status. Please try again or contact support.",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
