import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems, carts, cartItems, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";

export const runtime = "nodejs";

// GET user orders
export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create order from cart
export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get user cart
    const userCart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);

    if (userCart.length === 0) {
      console.log(`Order failed: No cart found for user ${userId}`);
      return NextResponse.json({ error: "Votre panier est vide (pas de panier trouvé)" }, { status: 400 });
    }
    
    const cartId = userCart[0].id;

    // 2. Get cart items with product details to check stock and price
    const items = await db
      .select({
        cartItemId: cartItems.id,
        quantity: cartItems.quantity,
        productId: products.id,
        price: products.price,
        stock: products.stock,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId));

    if (items.length === 0) {
      console.log(`Order failed: Cart ${cartId} is empty for user ${userId}`);
      return NextResponse.json({ error: "Votre panier est vide" }, { status: 400 });
    }

    // 3. Verify stock
    for (const item of items) {
      if (item.quantity > item.stock) {
        return NextResponse.json(
          { error: `Not enough stock for product ID: ${item.productId}` },
          { status: 400 }
        );
      }
    }

    // 4. Calculate total price
    const totalPrice = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + (price * qty);
    }, 0);

    if (isNaN(totalPrice) || totalPrice <= 0) {
      console.error("Invalid total price:", totalPrice);
      return NextResponse.json({ error: "Prix total invalide" }, { status: 400 });
    }

    // Parse body for phone and address
    let phone = null;
    let address = null;
    try {
      const body = await request.json();
      phone = body.phone;
      address = body.address;
    } catch(e) {
      // Body might be empty
    }

    if (!phone || !address) {
       console.log("Missing phone or address:", { phone, address });
       return NextResponse.json({ error: "Le téléphone et l'adresse sont requis" }, { status: 400 });
    }

    // 5. Create Order
    console.log(`Creating order for user ${userId} with total ${totalPrice}, phone ${phone}, address ${address}`);
    
    const [result] = await db.insert(orders).values({
      userId,
      totalPrice,
      status: "pending",
      phone,
      address
    });
    
    const orderId = result.insertId;

    // 6. Create Order Items & Deduct Stock
    // Using transaction would be better here for atomicity (if DB supports it via Drizzle)
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });

      // Deduct stock
      await db
        .update(products)
        .set({ stock: item.stock - item.quantity })
        .where(eq(products.id, item.productId));
    }

    // 7. Clear/Delete Cart
    // Since cartItems has onDelete: "cascade", deleting cart will delete its items
    await db.delete(carts).where(eq(carts.id, cartId));

    return NextResponse.json(
      { message: "Order created successfully", orderId },
      { status: 201 }
    );
  } catch (error) {
    console.error("CRITICAL ERROR in POST /api/orders:", error);
    return NextResponse.json({ 
      error: "Erreur interne du serveur lors de la commande",
      details: error.message
    }, { status: 500 });
  }
}
