interface ItemsProp {
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingInfoProps {
  name?: string;
  phone?: string;
  email?: string;
  region?: string;
  street?: string;
  ghana_post?: string;
  city?: string;
  notes?: string;
}

export interface ConfirmOrderParams {
  orderId: string;
  customerName: string;
  orderDate: Date;
  items: ItemsProp[];
  total: number;
  shippingInfo: ShippingInfoProps;
  currency: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export function formatOrderDate(date: Date) {
  return new Date(date).toUTCString();
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function generateOrderItemsHTML(items: ItemsProp[]) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; max-width: 600px; font-family: Arial, Helvetica, sans-serif;">
      ${items
      .map(
        (item) => `
            <tr>
              <td style="padding: 10px 0; vertical-align: middle;">
                <img src="${item.image || 'https://via.placeholder.com/40'}" alt="${item.title}" width="40" height="40" style="display: block; border: 0; border-radius: 4px; margin: 0;" />
              </td>
              <td style="padding: 10px 0 10px 5px; vertical-align: middle; font-size: 14px; line-height: 1.4; margin: 0;">
                ${item.title} (${item.quantity} x ${formatCurrency(item.price, 'GHS')})
              </td>
            </tr>
          `
      )
      .join('')}
    </table>
  `;
}

export function formatShippingAddress(info: ShippingInfoProps) {
  return [info.street, info.city, info.region, info.ghana_post]
    .filter(Boolean)
    .join(', ');
}

export function CalculateDeliveryFee(region: string) {
  return region.toLowerCase() === "accra" || region.toLowerCase() === "greater accra" ? "GHS 30.00" : "GHS 50.00";
}

export function ProcessingOrderTemplate({
  orderId,
  customerName,
  orderDate,
  items,
  total,
  shippingInfo,
  currency,
}: ConfirmOrderParams): EmailTemplate {
  return {
    subject: `Your order #${orderId} is being processed`,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Processing</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 40px 20px; color: #333; line-height: 1.6;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
            <h1 style="font-size: 24px; font-weight: normal; margin: 0 0 20px; color: #333;">Your order is being processed!</h1>
            
            <p>Hi ${customerName || "Customer"},</p>
            
            <p>Thank you for your order <strong>#${orderId}</strong> placed on ${formatOrderDate(orderDate)}. We're preparing it for shipment and will notify you once it's on the way.</p>
            
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
              You'll receive a notification when your package is out for delivery. If you have any questions, feel free to reach out.
            </p>
            
            <p style="margin: 0;">Thank you for shopping with us,<br>Your Store Team</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              <div>Questions? Email us at <a href="mailto:support@yourstore.com" style="color: #666;">support@yourstore.com</a></div>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
