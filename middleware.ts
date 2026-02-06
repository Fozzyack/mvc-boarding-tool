import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/auth/auth";
import { tokenName } from "./constants/auth";

export const middleware = async (req: NextRequest) => {
    const token = req.cookies.get(tokenName)?.value;

    const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const payload = await verifyToken(token);
        if (!payload) {
            const res = NextResponse.redirect(new URL("/login", req.url));
            res.cookies.delete(tokenName);
            return res;
        }
    }

    if (
        token &&
        (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/")
    ) {
        const payload = await verifyToken(token);
        if (payload) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }
    return NextResponse.next();
};

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
