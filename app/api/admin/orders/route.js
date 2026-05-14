import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const role = request.headers.get("x-user-role");

    // Safety check
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allOrders = await db
      .select({
        id: orders.id,
        totalPrice: orders.totalPrice,
        status: orders.status,
        createdAt: orders.createdAt,
        phone: orders.phone,
        address: orders.address,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    // Fetch items for these orders
    if (allOrders.length > 0) {
      const { orderItems, products } = await import("@/lib/db/schema");
      const { inArray } = await import("drizzle-orm");
      
      const orderIds = allOrders.map((o) => o.id);
      
      const allItems = await db
        .select({
          orderId: orderItems.orderId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          productName: products.name,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(inArray(orderItems.orderId, orderIds));

      // Attach items to orders
      for (const order of allOrders) {
        order.items = allItems.filter((item) => item.orderId === order.id);
      }
    }

    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
