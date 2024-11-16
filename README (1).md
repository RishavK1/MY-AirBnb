
# Airbnb Clone: A Full-Stack Web Application

This project is a fully functional Airbnb-like platform, offering users the ability to explore, book, and manage high-end rental properties. Designed with modern web development technologies, this project aims to simulate the core functionalities of Airbnb while incorporating intuitive features for both hosts and guests.

Whether it's a beachfront cottage, a historic villa, or an urban apartment, this application lets users seamlessly browse, search, and interact with property listings. From user authentication to property management and interactive maps, this project encapsulates the essence of a global accommodation platform.
## Features

### 🔒 **User Authentication**
- Secure registration and login system using **Passport.js**.
- Session management with **express-session** ensures users stay logged in seamlessly.

### 🏠 **Property Listings**
- Hosts can create and manage property listings with titles, descriptions, prices, and images.
- Guests can browse, search, and filter properties based on price, location, and ratings.

### ⭐ **User Reviews**
- Guests can leave reviews and ratings for properties they’ve stayed at.

### 🌍 **Geocoding and Maps**
- Interactive map integration using **Mapbox**.
- Convert addresses to geographical coordinates for precise property locations.

### 🖼️ **Image Storage**
- Property images are securely stored and managed using **Cloudinary**.

### 🔗 **Responsive Design**
- Mobile-first, fully responsive interface built with **Bootstrap** and custom **CSS**.
## Tech Stack

### Backend
- **Node.js**: High-performance JavaScript runtime for server-side development.
- **Express.js**: Framework for handling routes, middleware, and server logic.
- **MongoDB**: NoSQL database for scalable data storage with **Mongoose**.

### Frontend
- **EJS (Embedded JavaScript)**: For dynamic templating and rendering server-side data.
- **CSS & Bootstrap**: Ensuring a modern, clean, and responsive user interface.

### Additional Tools
- **Mapbox**: For geocoding and interactive map integration.
- **Cloudinary**: For secure and efficient image storage.

## Installation

### Prerequisites
- **Node.js** and **npm** installed on your system.
- A running **MongoDB** instance (local or cloud-based).
- API keys for **Mapbox** and **Cloudinary**.

### Steps
1. Navigate to the project directory:
  ```bash
   cd airbnb-clone

```
2. Install dependencies:

```bash
cd job-portal

```
3. Create a .env file and add the following:
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MAPBOX_TOKEN=your-mapbox-token

```
4. Start the server:
```bash
npm start
```

 



   
## Folder Structure 


```bash
├── controllers        # Backend logic for handling routes
├── init               # Configuration files for database and app setup
├── models             # Mongoose schemas for database collections
├── public             # Static files like CSS, JS, and images
├── routes             # Routing logic for different endpoints
├── utils              # Utility functions and helpers
├── views              # EJS templates for frontend rendering
│   ├── includes       # Reusable components (header, footer)
│   ├── layouts        # Page layouts
│   ├── listings       # Property listing templates
│   └── users          # User-related pages
└── app.js             # Main application file

```
## Acknowledgements

Special thanks to all contributors, open-source libraries, and resources that made this project possible.

##  Contact

For any questions or feedback, please reach out:

* Email: rishavkamboj75@gmail.com