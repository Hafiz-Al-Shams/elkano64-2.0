# Elkano64 - Elite Restaurant Management Website

![Elkano64 Screenshot](/src/assets/elkano64_homepage.webp)

## Live Project  
🔗 [Elkano64 Live](https://elkano64.vercel.app/)

## Overview  
Elkano64 is a modern restaurant website and customer self-service platform built to streamline restaurant operations, enhance customer experience, and improve digital engagement. Visitors can explore the restaurant and its menu, while signed-in users can place food orders, manage their own food listings, book tables, and track their orders and reservations. This repository contains the **React frontend**, which connects to a separately hosted REST API (Express.js & MongoDB) at `elkano64-server.vercel.app` for food, orders, bookings, and notifications.

## Technologies Used  
- **Frontend:** React, Vite, React Router, React Helmet Async, React Icons, Yet Another React Lightbox
- **Styling:** Tailwind CSS, DaisyUI  
- **Backend & Database:** Express.js, MongoDB (hosted separately, not included in this repository)  
- **State Management & Utilities:** React Context API, LocalForage, Match Sorter, Sort By  
- **Authentication:** Firebase Authentication  
- **UI Enhancements:** SweetAlert2, React Tooltip  
- **Contact Form:** Formspree  

## Key Features  
✅ **Firebase Authentication System:** Supports Email-Password registration and login, plus Google authentication. Registration collects name, photo URL, email, and a password of at least six characters.  

✅ **Protected Routes with Smart Redirects:** Food creation and editing, purchases, and personal order/booking pages require login. Visitors sent to sign-in are returned to the page they originally requested.  

✅ **Restaurant Landing Page:** Rotating image banner, food category shortcuts (Biryani, Pizza, Indian Curry, Chinese, BBQ & Grill, Seafood), top-selling foods, services, restaurant story, customer reviews, table reservation section, and upcoming events.  

✅ **Food Management System:** Signed-in users can add food items (name, category, description, price, quantity, photo URL, origin), which are stored in the database through the server API.  

✅ **My Foods & Listing Updates:** Users can view their own listings with client-side search and sorting by recency or price, and edit them through a form with a live preview. Updates are allowed only for the listing's owner.  

✅ **Real-time Food Listings:** Displays food cards dynamically from the database via the server API, including photos, categories, prices, purchase counts, and stock quantities.  

✅ **Food Details Page:** Shows image, category, price, description, origin, purchase count, and available stock, with suggestions for other dishes and a direct link to purchase.  

✅ **Order Management:** Users can choose a quantity, see the calculated subtotal, and place an order. The frontend checks stock and quantity, and blocks purchasing one's own listing. Orders are stored in the database for tracking.  

✅ **My Orders:** Lists the signed-in user's orders with summary totals, food-name search, price sorting, pagination, and order deletion.  

✅ **Table Reservations:** A booking modal and a home page reservation form let signed-in users book a table for today or a future date, with 30-minute time slots from 10:00 AM to 9:30 PM and 1–10 guests.  

✅ **My Bookings:** Displays reservations with upcoming/past status, summary counts, search, sorting, and pagination. Users can cancel a booking after confirmation or make a new reservation.  

✅ **Notifications:** Signed-in users get a notification dropdown with an unread-count badge for order, booking, and food activity. It polls the API periodically, refreshes when the browser regains focus, and supports marking all notifications as read.  

✅ **User-Specific Data Filtering:** Shows only the food items, orders, bookings, and notifications belonging to the logged-in user using email-based queries.  

✅ **Sorted & Limited Food Display:** Homepage displays the most purchased food items in descending order.  

✅ **Advanced Search & Filtering:** Users can search food by name from the home banner, the navbar search modal (with popular search suggestions), or the "All Foods" page. The "All Foods" page also supports debounced search, category chips, price sorting, and pagination with 15, 30, or 50 items per page.  

✅ **Gallery with Lightbox:** Displays food photos from the API and opens them in a full-screen lightbox.  

✅ **About, Contact & Events:** The About page presents the restaurant story, values, and team, while the Contact page sends messages through Formspree for logged-in users. Event cards are shown with dates calculated relative to the visitor's current date.  

✅ **Light & Dark Theme:** A theme toggle switches between two themes and saves the choice in browser storage.  

✅ **Responsive Design & Polished UI:** Fully responsive navbar with a mobile menu and account dropdown, theme-aware SweetAlert2 dialogs, and an error page for failed route loaders.  

## Dependencies  
The following dependencies are used in the project:  

```json
{
  "firebase": "^11.1.0",
  "localforage": "^1.10.0",
  "match-sorter": "^8.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-helmet-async": "^2.0.5",
  "react-icons": "^5.4.0",
  "react-router-dom": "^7.1.0",
  "react-tooltip": "^5.28.0",
  "sort-by": "^1.2.0",
  "sweetalert2": "^11.15.3",
  "yet-another-react-lightbox": "^3.21.7"
}
```

The following dev dependencies are used for development and tooling:  

```json
{
  "@eslint/js": "^9.17.0",
  "@types/react": "^18.3.17",
  "@types/react-dom": "^18.3.5",
  "@vitejs/plugin-react": "^4.3.4",
  "autoprefixer": "^10.4.20",
  "daisyui": "^4.12.22",
  "eslint": "^9.17.0",
  "eslint-plugin-react": "^7.37.2",
  "eslint-plugin-react-hooks": "^5.0.0",
  "eslint-plugin-react-refresh": "^0.4.16",
  "globals": "^15.13.0",
  "postcss": "^8.4.49",
  "tailwindcss": "^3.4.17",
  "vite": "^6.0.3"
}
```

## Installation & Running Locally  
Follow these steps to run the project locally:

1. **Clone the repository:**  
   ```sh
   git clone https://github.com/Hafiz-Al-Shams/elkano64-2.0.git
   cd elkano64-2.0
   ```

2. **Install dependencies:**  
   ```sh
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env.local` file in the root directory and add the following variables:

   ```sh
   VITE_apiKey=YOUR_FIREBASE_API_KEY
   VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
   VITE_projectId=YOUR_FIREBASE_PROJECT_ID
   VITE_storageBucket=YOUR_FIREBASE_STORAGE_BUCKET
   VITE_messagingSenderId=YOUR_FIREBASE_MESSAGING_SENDER_ID
   VITE_appId=YOUR_FIREBASE_APP_ID
   VITE_FORMSPREE_ID=YOUR_FORMSPREE_FORM_ID
   ```

   > `VITE_FORMSPREE_ID` is required for the Contact page form to send messages.

4. **Start the development server:**  
   ```sh
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the app in action.

## Additional Resources  
- [MongoDB Documentation](https://www.mongodb.com/docs/)  
- [Express.js Documentation](https://expressjs.com/)  
- [Firebase Documentation](https://firebase.google.com/docs)  
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)  
- [DaisyUI Documentation](https://daisyui.com/docs/)  
- [Formspree Documentation](https://help.formspree.io/)  

---

🚀 **Developed by Hafiz Al Shams**