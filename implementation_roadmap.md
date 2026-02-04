# Implementation Roadmap - Frontend Developer Intern Assignment

## Phase 1: Project Initialization & Architecture
- [ ] **Root Setup**: Initialize `package.json` with `concurrently` to run client and server.
- [ ] **Server Setup**: Initialize `node-express-ts` project in `/server`.
- [ ] **Client Setup**: Initialize `vite-react-ts` project in `/client` with TailwindCSS.

## Phase 2: Backend Development (Node + Express + MongoDB)
- [ ] **Configuration**: Setup MongoDB connection and Environment variables.
- [ ] **Models**: Define Mongoose schemas for `User` and `Note`.
- [ ] **Auth Module**: Implement Register, Login (JWT), and `authMiddleware`.
- [ ] **Notes Module**: Implement CRUD operations for Notes.
- [ ] **API Testing**: Verify endpoints with curl/tests.

## Phase 3: Frontend Development (React + Tailwind)
- [ ] **Foundation**: Setup Tailwind, Axios instance, and Routing (React Router).
- [ ] **Authentication**: Build Login and Signup forms (React Hook Form + Zod).
- [ ] **Dashboard Layout**: Create Sidebar, Responsive Layout, and Protected Route wrapper.
- [ ] **Notes Features**: Implement UI for Listing, Creating, Editing, and Deleting notes.
- [ ] **Polish**: Add Toasts (Sonner) and ensure responsiveness.

## Phase 4: Verification & Deliverables
- [ ] **Integration Test**: Verify entire flow (Auth -> Dashboard -> CRUD).
- [ ] **Documentation**: Write `README.md` with setup and scalability notes.
- [ ] **Postman Collection**: Generate `request_collection.json`.
