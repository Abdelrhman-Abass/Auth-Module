import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    // Extract URL and pathname
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Access cookies to check authentication
    // We use the standard Next.js Request cookies API
    const token = req.cookies.get("userData");
    const isUserLoggedIn = Boolean(token);

    // Define private (restricted) paths
    // We use startsWith to match sub-paths (e.g. /profile/123)
    const privatePaths = ["/profile"];

    const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path));

    // If user is NOT logged in and trying to access a private path
    if (isPrivatePath && !isUserLoggedIn) {
        console.log(
            `Unauthenticated user attempted to access private path ${pathname}, redirecting to login`
        );
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Exclude: API, Next internals, and static files
        "/((?!api|_next/static|_next/image|assets|images|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
