import { mysqlTable, varchar, int, timestamp, text, float, boolean, decimal } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  nom: varchar("nom", { length: 255 }),
});

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  adresse: text("adresse"),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: float("price").notNull(),
  description: text("description"),
  stock: int("stock").notNull().default(0),
  image: varchar("image", { length: 1024 }),
  categorieId: int("categorie_id").references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carts = mysqlTable("carts", {
  id: varchar("id", { length: 36 }).primaryKey(), // Apparemment carts utilise encore des UUID dans le pull ? 
  // Attendez, vérifions carts dans drizzle/schema.ts
  userId: int("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = mysqlTable("cart_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  cartId: varchar("cart_id", { length: 36 }).notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: int("product_id").notNull().references(() => products.id),
  quantity: int("quantity").notNull().default(1),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  totalPrice: float("total_price").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: int("product_id").notNull().references(() => products.id),
  quantity: int("quantity").notNull(),
  price: float("price").notNull(),
});
