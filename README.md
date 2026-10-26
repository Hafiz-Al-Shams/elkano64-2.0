# Elkano64 - Elite Restaurant Management Website

![Elkano64 Screenshot](https://i.ibb.co.com/Z5G36gZ/Screenshot-6646.png)  

## Live Project  
🔗 [Elkano64 Live](https://elkano64.netlify.app/)

## Overview  
Elkano64 is a modern restaurant management platform built to streamline restaurant operations, enhance customer experience, and improve digital engagement. This platform enables efficient order management, seamless food listing, and real-time user interaction.

## Technologies Used  
- **Frontend:** React, React Router, React Helmet Async, Yet Another React Lightbox, React Snowfall  
- **Backend & Database:** Express.js, MongoDB  
- **State Management & Utilities:** LocalForage, Match Sorter  
- **Authentication:** Firebase  
- **UI Enhancements:** SweetAlert2, React Tooltip  

## Key Features  
✅ **Firebase Authentication System:** Supports Email-Password login and Google authentication.  

✅ **Food Management System:** Users can add food items, which are stored in the database.  

✅ **Order Management:** Users can make purchases, which are stored in the database for tracking.  

✅ **Real-time Food Listings:** Displays food cards dynamically from the database via the server API.  

✅ **User-Specific Data Filtering:** Shows only the food items and orders added by the logged-in user using email-based queries.  

✅ **Sorted & Limited Food Display:** Homepage displays the most purchased food items in descending order.  

✅ **Search Functionality:** Users can search for food items on the "All Foods" page by food name.  

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
  "react-router-dom": "^7.1.0",
  "react-snowfall": "^2.2.0",
  "react-tooltip": "^5.28.0",
  "sort-by": "^1.2.0",
  "sweetalert2": "^11.15.3",
  "yet-another-react-lightbox": "^3.21.7"
}
```

## Installation & Running Locally  
Follow these steps to run the project locally:

1. **Clone the repository:**  
   ```sh
   git clone https://github.com/Hafiz-Al-Shams/elkano64-client.git
   cd elkano64
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
   ```

4. **Start the development server:**  
   ```sh
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the app in action.

## Additional Resources  
- [MongoDB Documentation](https://www.mongodb.com/docs/)  
- [Express.js Documentation](https://expressjs.com/)  
- [Firebase Documentation](https://firebase.google.com/docs)  

---

🚀 **Developed by Hafiz Al Shams**  

