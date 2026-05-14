import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

// GET all products (Public route)
export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new product (Admin only - Protected by middleware)
export async function POST(request) {
  try {
    const { name, price, description, stock, image } = await request.json();
    const normalizedPrice = Number(price);
    const normalizedStock = Number.isFinite(Number(stock)) ? Number(stock) : 0;

    if (!name || !Number.isFinite(normalizedPrice)) {
      return NextResponse.json(
        { error: "Name and valid price are required" },
        { status: 400 }
      );
    }

    const [result] = await db.insert(products).values({
      name,
      price: normalizedPrice,
      description,
      stock: normalizedStock,
      image,
    });

    const productId = result.insertId;

    return NextResponse.json(
      { message: "Product created successfully", productId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
