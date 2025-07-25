import {
  CalculateDeliveryFee,
  ConfirmOrderParams,
  EmailTemplate,
  formatCurrency,
  formatOrderDate,
  formatShippingAddress,
  generateOrderItemsHTML,
} from "./processingOrder";

export function CancelledOrderTemplate({
  orderId,
  customerName,
  orderDate,
  items,
  total,
  shippingInfo,
  currency,
}: ConfirmOrderParams): EmailTemplate {
  return {
    subject: `Your order #${orderId} has been cancelled`,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Cancelled</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 40px 20px; color: #333; line-height: 1.6;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
            <h1 style="font-size: 24px; font-weight: normal; margin: 0 0 20px; color: #333;">Order Cancelled</h1>

            <p>Hi ${customerName || "Customer"},</p>

            <p>We’re writing to let you know that your order <strong>#${orderId}</strong> placed on ${formatOrderDate(
      orderDate
    )} has been cancelled.</p>

            <p>If this was a mistake or if you have any questions, feel free to reach out to us. Below are the details of the cancelled order:</p>

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
              <div style="font-weight: 600; margin-bottom: 10px;">Items Ordered:</div>
              ${generateOrderItemsHTML(items)}
            </div>

            <div style="margin: 20px 0;">
              <div style="font-weight: 600; margin-bottom: 10px;">Shipping Info:</div>
              <div>${shippingInfo.name || "Name not provided"}</div>
              <div>${formatShippingAddress(shippingInfo)}</div>
              <div>${shippingInfo.phone || "Phone not provided"}</div>
            </div>

            <p style="margin: 20px 0; font-size: 14px; color: #666;">
              If you’ve already been charged, a refund will be processed based on your original payment method. Please allow 5–7 business days for the refund to reflect.
            </p>

            <p style="margin: 0;">We’re here to help anytime,<br>Your Store Team</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              <div>Contact us at <a href="mailto:support@OhCase!.com" style="color: #666;">support@OhCase!.com</a> for further assistance.</div>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
