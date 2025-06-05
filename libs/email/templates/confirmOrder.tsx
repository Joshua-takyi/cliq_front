export interface OrderProps {
  orderId: string;
  amount: number;
  email: string;
  status: string;
  deliveryStatus?: string;
  currency: string;
  items: ItemsProp[];
  shippingInfo: ShippingInfoProps;
  createdAt: Date
  payment: PaymentProps;
}

export interface PaymentProps {
  method: string;
  status: string;
  reference: string;
}

export interface ItemsProp {
  id: string;
  image: string;
  slug: string;
  title: string;
  quantity: number;
  price: string;
  color?: string;
}

export interface ShippingInfoProps {
  name: string;
  phone?: string;
  email?: string;
  region?: string;
  street?: string;
  ghana_post?: string;
  city?: string;
  notes?: string;
}

function formatOrderDate(date: Date) {
  return new Date(date).toUTCString()
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function generateOrderItemsHTML(items: ItemsProp[]) {
  return items
    .map(
      (item) => `
        <div style="margin-bottom: 10px; display:flex; flex-direction: row; gap: 0.5rem; align-items: center;">
          <img src="${item.image}" alt="${item.title}" cid:logo width="40" height="40" style="object-fit: cover; border-radius: 4px;"/>
          <span>${item.title} (${item.quantity} x ${item.price})</span>
        </div>
      `
    )
    .join('');
}

function formatShippingAddress(info: ShippingInfoProps) {
  return [info.street, info.city, info.region, info.ghana_post]
    .filter(Boolean)
    .join(', ');
}


function CalculateDeliveryFee(region: string) {
  return region.toLowerCase() === "accra" || "Greater Accra" ? "GHS 30.00" : "GHS 50.00";
}

export const GenerateOrderConfirmationEmail = (orderDetails: OrderProps) => {
  return {
    subject: `Order confirmation #${orderDetails.orderId}`,
    body: `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 40px 20px; color: #333; line-height: 1.6;">
    <div style="max-width: 500px; margin: 0 auto;">
     <h1 style="font-size: 24px; font-weight: normal; margin: 0 0 30px; color: #333;">Thanks for your order!</h1>
      
      <p>Hi ${orderDetails.shippingInfo?.name || "Customer"},</p>
      
      <p>We've received your order and are getting it ready for processing. You'll be notified as soon as it's out for delivery.</p>
      
      <div style="margin: 30px 0;">
        <div><strong>Order ID:</strong> ${orderDetails.orderId}</div>
        <div><strong>Date:</strong> ${formatOrderDate(orderDetails.createdAt)}</div>
        <div><strong>Status:</strong> ${orderDetails.status}</div>
        <div><strong>Total:</strong> ${formatCurrency(orderDetails.amount, orderDetails.currency)}</div>
        <div><strong>DeliveryFee:</strong> ${CalculateDeliveryFee(orderDetails.shippingInfo.region || " ")}</div>
      </div>
      
      <div style="margin: 30px 0;">
        <div style="font-weight: 600; margin-bottom: 15px;">Items:</div>
        ${generateOrderItemsHTML(orderDetails.items)}
      </div>
      
      <div style="margin: 30px 0;">
        <div style="font-weight: 600; margin-bottom: 10px;">Shipping to:</div>
        <div>${orderDetails.shippingInfo?.name || "Name not provided"}</div>
        <div>${formatShippingAddress(orderDetails.shippingInfo)}</div>
        <div>${orderDetails.shippingInfo?.phone || "Phone not provided"}</div>
      </div>
      
      <div style="margin: 30px 0;">
        <div style="font-weight: 600; margin-bottom: 10px;">Payment:</div>
        <div>Method: ${orderDetails.payment.method.replace("_", " ")}</div>
        <div>Status: ${orderDetails.payment.status}</div>
        <div>Reference: ${orderDetails.payment.reference}</div>
      </div>
      
      <!-- 🧾 Clarified message about tracking -->
      <p style="margin-top: 30px;">You'll receive a notification when your package is on the way. No tracking link will be provided, but we're happy to help if you have questions.</p>
      
      <p>Thank you again for shopping with us.<br>Your Store Team</p>
      
      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
        <div>Questions? Email us at <a href="mailto:support@yourstore.com" style="color: #666;">support@yourstore.com</a></div>
      </div>
      
    </div>
  </body>
</html>
    `,
  };
};
