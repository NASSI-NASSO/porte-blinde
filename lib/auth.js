import { jwtVerify, SignJWT } from "jose";
import { getServerEnv } from "@/lib/serverEnv";

const JWT_SECRET =
  getServerEnv("JWT_SECRET") || "your-super-secret-key-change-in-production";

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secretKey);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}
