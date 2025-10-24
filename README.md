# 🏡 Wonderlust

**Wonderlust** is a full-stack web application inspired by **Airbnb**, allowing property owners to list and manage their properties while users can explore, book, and review them.  
It features full **authentication and authorization**, **property management**, **booking system**, and **review functionality** — all within a modern, responsive UI.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Secure user registration and login.
  - Password hashing for security.
  - Role-based access (Owner / User).

- 🏠 **Property Management**
  - Owners can add, edit, and delete listings.
  - Each property includes images, location, description, and pricing.
  - Users can browse and search by location or price.

- 💳 **Booking System**
  - Users can book available properties for specific dates.
  - Prevents double-booking with date validation.
  - Booking management for both owners and users.

- 💬 **Reviews & Ratings**
  - Users can leave reviews and rate properties.
  - Average rating displayed on property pages.

- 🖼️ **Image Uploads**
  - Multiple images per property.
  - Cloud-based image storage (Cloudinary / AWS S3).

- 🧭 **Additional Features**
  - Responsive design for all devices.
  - Integrated error handling and form validation.
  - Optional dark/light mode.

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React / Next.js / Tailwind CSS |
| **Backend** | Node.js / Express.js |
| **Database** | MongoDB / PostgreSQL |
| **Authentication** | JWT / Passport.js / NextAuth |
| **Storage** | Cloudinary / AWS S3 |
| **Deployment** | Vercel / Render / Railway |
| **Version Control** | Git & GitHub |

---

## ⚙️ Installation and Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Steps to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/wonderlust.git
   cd wonderlust
