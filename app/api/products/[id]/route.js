import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, price, description, stock, image } = await request.json();
    const normalizedPrice = Number(price);
    const normalizedStock = Number.isFinite(Number(stock)) ? Number(stock) : 0;

    if (!name || !Number.isFinite(normalizedPrice)) {
      return NextResponse.json(
        { error: "Name and valid price are required" },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db
      .update(products)
      .set({
        name,
        price: normalizedPrice,
        description,
        stock: normalizedStock,
        image,
      })
      .where(eq(products.id, id));

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
