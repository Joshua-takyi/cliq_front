import {
  CalculateDeliveryFee,
  ConfirmOrderParams,
  EmailTemplate,
  formatCurrency,
  formatOrderDate,
  formatShippingAddress,
  generateOrderItemsHTML,
} from "./processingOrder";

export function DeliveredOrderTemplate({
  orderId,
  customerName,
  orderDate,
  items,
  total,
  shippingInfo,
  currency,
}: ConfirmOrderParams): EmailTemplate {
  return {
    subject: `Your order #${orderId} has been delivered!`,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Delivered</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 40px 20px; color: #333; line-height: 1.6;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
            <h1 style="font-size: 24px; font-weight: normal; margin: 0 0 20px; color: #333;">Your order has arrived!</h1>

            <p>Hi ${customerName || "Customer"},</p>

            <p>We're happy to let you know that your order <strong>#${orderId}</strong> placed on ${formatOrderDate(
      orderDate
    )} has been successfully delivered.</p>

            <div style="margin: 20px 0;">
              <div><strong>Order ID:</strong> ${orderId}</div>
              <div><strong>Date:</strong> ${formatOrderDate(orderDate)}</div>
              <div><strong>Total:</strong> ${formatCurrency(
                total,
                currency
              )}</div>
              <div><strong>Delivery Fee:</strong> ${CalculateDeliveryFee(
                shippingInfo.region || " "
              )}</div>
            </div>

            <div style="margin: 20px 0;">
              <div style="font-weight: 600; margin-bottom: 10px;">Items Delivered:</div>
              ${generateOrderItemsHTML(items)}
            </div>

            <div style="margin: 20px 0;">
              <div style="font-weight: 600; margin-bottom: 10px;">Delivered to:</div>
              <div>${shippingInfo.name || "Name not provided"}</div>
              <div>${formatShippingAddress(shippingInfo)}</div>
              <div>${shippingInfo.phone || "Phone not provided"}</div>
            </div>

            <p style="margin: 20px 0; font-size: 14px; color: #666;">
              We hope everything arrived in perfect condition. If you have any issues, feedback, or questions, please don't hesitate to reach out to us.
            </p>

            <p style="margin: 0;">Thank you for shopping with us,<br>Your Store Team</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              <div>Need support? Contact us at <a href="mailto:support@OhCase!.com" style="color: #666;">support@OhCase!.com</a></div>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
