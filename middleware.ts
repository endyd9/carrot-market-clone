import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const ua = userAgent(req);
  if (ua.isBot) {
    return new NextResponse("봇 금지", { status: 403 });
  }
  if (!req.url.includes("/api")) {
    if (!req.cookies.has("carrotsession") && !req.url.includes("/enter")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"],
};
