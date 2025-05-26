// import client from "@/libs/connect";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const orderId = searchParams.get("orderId");

//   if (!orderId) {
//     return new Response("Order ID is required", { status: 400 });
//   }

//   try {
//     await client.connect();
//     const db = client.db();

//     // Fetch the order by ID
//     // Convert the orderId string to an ObjectId before querying the database
//     const order = await db
//       .collection("orders")
//       .findOne({ _id: new ObjectId(orderId) });

//     if (!order) {
//       return new Response("Order not found", { status: 404 });
//     }

//     return new Response(JSON.stringify(order), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   } finally {
//     await client.close();
//   }
// }
