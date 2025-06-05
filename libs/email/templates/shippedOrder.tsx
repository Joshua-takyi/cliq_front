import { CalculateDeliveryFee, ConfirmOrderParams, EmailTemplate, formatCurrency, formatOrderDate, formatShippingAddress, generateOrderItemsHTML } from "./processingOrder";

export function ShippedOrderTemplate({
  orderId,
  customerName,
  orderDate,
  items,
  total,
  shippingInfo,
  currency,
}: ConfirmOrderParams): EmailTemplate {
  return {
    subject: `Your order #${orderId} has been shipped!`,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Shipped</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 40px 20px; color: #333; line-height: 1.6;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
            <h1 style="font-size: 24px; font-weight: normal; margin: 0 0 20px; color: #333;">Your order is on its way!</h1>

            <p>Hi ${customerName || "Customer"},</p>

            <p>Good news! Your order <strong>#${orderId}</strong> placed on ${formatOrderDate(orderDate)} has been shipped and is on its way to you.</p>

            <div style="margin: 20px 0;">
              <div><strong>Order ID:</strong> ${orderId}</div>
              <div><strong>Date:</strong> ${formatOrderDate(orderDate)}</div>
              <div><strong>Total:</strong> ${formatCurrency(total, currency)}</div>
              <div><strong>Delivery Fee:</strong> ${CalculateDeliveryFee(shippingInfo.region || " ")}</div>
            </div>

            <div style="margin: 20px 0;">
              <div style="font-weight: 600; margin-bottom: 10px;">Items:</div>
              ${generateOrderItemsHTML(items)}
            </div>

            <div style="margin: 20px 0;">
              <div style="font-weight: 600; margin-bottom: 10px;">Shipping to:</div>
              <div>${shippingInfo.name || "Name not provided"}</div>
              <div>${formatShippingAddress(shippingInfo)}</div>
              <div>${shippingInfo.phone || "Phone not provided"}</div>
            </div>

            <p style="margin: 20px 0; font-size: 14px; color: #666;">
              Your order is now on the way. Depending on your location, delivery may take 1–3 business days. We'll notify you again once it's been delivered.
            </p>

            <p style="margin: 0;">Thank you for shopping with us,<br>Your Store Team</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              <div>Need help? Email us at <a href="mailto:support@yourstore.com" style="color: #666;">support@yourstore.com</a></div>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
