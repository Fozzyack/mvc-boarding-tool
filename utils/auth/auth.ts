import { tokenName } from "@/constants/auth";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const getSecret = () => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT_SECRET_KEY environment variable not set");
    }
    return new TextEncoder().encode(secret);
};

export const createToken = async (payload: any) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(getSecret());
};

export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload;
    } catch (error) {
        console.error(error);
    }
    return null;
};

export const getSession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(tokenName)?.value;

    if (!token) return null;

    return await verifyToken(token);
};
