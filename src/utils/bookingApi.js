// All booking-related server calls live here, so ReserveTable and BookingModal
// share one piece of code instead of repeating fetch logic.

// Deployed Elkano64 server (same server your AddFood page already uses)
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

// POST: book a table  ->  { name, email, date, time, guests }
export const createBooking = async (booking) => {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
    });
    return handleResponse(res);
};

// GET: all bookings of one user (will be used by the future "My Bookings" UI)
export const getUserBookings = async (email) => {
    const res = await fetch(`${API_BASE}/bookings?email=${encodeURIComponent(email)}`);
    return handleResponse(res);
};

// DELETE: one booking of one user (will be used by the future delete button)
export const deleteBooking = async (id, email) => {
    const res = await fetch(`${API_BASE}/bookings/${id}?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
    });
    return handleResponse(res);
};