import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carts, cartItems, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

// GET user cart
export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the cart for the user
    let userCart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);

    if (userCart.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const cartId = userCart[0].id;

    // Get items with product details
    const items = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image: products.image,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId));

    return NextResponse.json({ cartId, items });
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST add item to cart
export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId;
    const { productId, quantity = 1 } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 1. Get or create cart
    let userCart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
    let cartId;

    if (userCart.length === 0) {
      cartId = crypto.randomUUID();
      await db.insert(carts).values({ id: cartId, userId });
    } else {
      cartId = userCart[0].id;
    }

    // 2. Check if product already in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cartItems.id, existingItem[0].id));
    } else {
      // Add new item
      await db.insert(cartItems).values({
        id: crypto.randomUUID(),
        cartId,
        productId,
        quantity,
      });
    }

    return NextResponse.json({ message: "Item added to cart" }, { status: 201 });
  } catch (error) {
    console.error("Failed to update cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update item quantity
export async function PUT(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId;
    const { productId, quantity } = await request.json();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userCart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
    if (userCart.length === 0) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    if (quantity <= 0) {
      await db.delete(cartItems).where(and(eq(cartItems.cartId, userCart[0].id), eq(cartItems.productId, productId)));
    } else {
      await db.update(cartItems)
        .set({ quantity })
        .where(and(eq(cartItems.cartId, userCart[0].id), eq(cartItems.productId, productId)));
    }

    return NextResponse.json({ message: "Quantity updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE remove item from cart
export async function DELETE(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userCart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
    if (userCart.length === 0) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    await db.delete(cartItems)
      .where(and(eq(cartItems.cartId, userCart[0].id), eq(cartItems.productId, productId)));

    return NextResponse.json({ message: "Item removed" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

