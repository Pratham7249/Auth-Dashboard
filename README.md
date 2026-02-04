# Full Stack Note Application

## High Level Architecture
This application follows a client-server architecture:
- **Client**: React (Vite) Single Page Application served on port 5173 (dev).
- **Server**: Node.js + Express REST API served on port 5000.
- **Database**: MongoDB (Local or Atlas).

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS (Utility-first)
- **State/Auth**: Context API + Axios Interceptors
- **Forms**: React Hook Form + Zod Validation
- **Routing**: React Router v6
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Auth**: JWT (JSON Web Tokens) + BCrypt (Password Hashing)
- **Validation**: Manual / Mongoose

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on default port 27017)

### Installation
1. Clone the repository.
2. Install dependencies for both client and server from root:
   ```bash
   npm run install:all
   ```
   *Note: If `npm run install:all` fails, install in each folder manually.*
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Environment Configuration:
   - **Server**:
     - Navigate to `server/` directory.
     - Copy the example environment file:
       ```bash
       cp .env.example .env
       ```
     - **Database Setup**:
       - By default, the app tries to connect to a local MongoDB instance at `mongodb://localhost:27017/intern_assignment`.
       - If you have MongoDB installed locally, just ensure it's running.
       - To use MongoDB Atlas (Cloud), update the `MONGO_URI` in `.env` with your connection string.
   - **Client**: Uses default settings. No configuration needed for local dev.

### Running the App
Run both backend and frontend concurrently:
```bash
npm start
```
- Client: http://localhost:5173
- Server: http://localhost:5000

## 📈 Scalability for Production

To scale this application for a production environment like High Traffic Intern Assignment Reviewers:

1. **Database Scaling**:
   - **Redis Caching**: Implement Redis to cache frequent GET requests (e.g., /notes) to reduce DB load.
   - **Replica Sets**: Use MongoDB Replica Sets for high availability and read scaling.

2. **Backend Scaling**:
   - **PM2**: Use PM2 process manager to cluster the Node.js application, utilizing all CPU cores.
   - **Load Balancing**: Place Nginx in front of multiple Node.js instances to distribute traffic.
   - **Statelessness**: The API is stateless (JWT), making it easy to scale horizontally.

3. **Frontend Optimization**:
   - **CDN**: Serve static assets (JS/CSS) via a CDN (Cloudflare/AWS CloudFront).
   - **Code Splitting**: Vite handles this, but further optimization can be done with lazy loading routes.

## API Documentation (Postman)
Import `request_collection.json` into Postman to test the API endpoints.
