// All notification-related server calls live here, so the NotificationDropdown
// does not need to repeat fetch logic (same style as bookingApi.js).

// Deployed Elkano64 server (same server bookingApi.js and your other pages use)
const API_BASE = "https://elkano64-server.vercel.app";

// shared response handler: returns the JSON, or throws an Error with the server's message
const handleResponse = async (res) => {
    let data = null;
    try {
        data = await res.json();
    } catch {
        /* response had no JSON body */
    }

    if (!res.ok) {
        throw new Error(data?.message || "Something went wrong. Please try again.");
    }
    return data;
};

// GET: the newest notifications of one user (the server keeps only the last 7 days)
export const getNotifications = async (email) => {
    const res = await fetch(`${API_BASE}/notifications?email=${encodeURIComponent(email)}`);
    return handleResponse(res);
};

// PATCH: mark ALL notifications of one user as read
export const markAllNotificationsRead = async (email) => {
    const res = await fetch(`${API_BASE}/notifications/read-all?email=${encodeURIComponent(email)}`, {
        method: "PATCH",
    });
    return handleResponse(res);
};