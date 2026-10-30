// Shared helper: decides where a user goes right after login / registration.
//
// "from" is the location object saved by PrivateRoute (or by a page that sent the
// visitor to /signIn). If it is missing or unsafe, the default page is used.
// Default = Home page, so a simple login (no saved page) lands on "/".

const DEFAULT_REDIRECT = "/";
const AUTH_PAGES = ["/signIn", "/register"];

export const getRedirectPath = (from, fallback = DEFAULT_REDIRECT) => {
    if (!from || typeof from !== "object") return fallback;

    const { pathname, search, hash } = from;

    // only internal paths are allowed (blocks things like "//evil.com")
    if (typeof pathname !== "string") return fallback;
    if (!pathname.startsWith("/") || pathname.startsWith("//") || pathname.startsWith("/\\")) return fallback;

    // never send the user back to a login / register page (would look like a loop)
    if (AUTH_PAGES.includes(pathname)) return fallback;

    return `${pathname}${typeof search === "string" ? search : ""}${typeof hash === "string" ? hash : ""}`;
};