# TaskFlow

A full-stack project & task management application (Jira/Trello-style) built with the MERN stack. Features a drag-and-drop Kanban board, real-time-style activity logging, team collaboration, and a calendar view — built as a hands-on learning project covering modern full-stack development patterns.

![TaskFlow](./public/dashboard-preview.png)

## Features

### Core
- **Authentication** — JWT-based register/login, forgot/reset password flow, change password
- **Projects** — create, edit, delete, mark as done; owner/member roles
- **Kanban Board** — drag-and-drop task management across To Do / In Progress / Review / Done columns, powered by `dnd-kit` with optimistic UI updates
- **Backlog View** — sortable, filterable data table (status, priority, assignee) built on MUI X Data Grid
- **Task Details** — status, priority, assignee, due date, description, labels/tags — all editable in a modal
- **Comments & Activity Log** — every task change (status, priority, assignee, due date) is automatically logged with a full audit trail; threaded comments per task
- **Calendar** — month view of task activity and due dates across all projects, with a per-day detail panel
- **Notifications** — in-app notification bell with unread badge for assignments and comments
- **Search** — global live search across projects and tasks from the top bar
- **Team Management** — add/remove project members by email
- **Dashboard** — project/task stats, per-project progress bars, recent activity feed
- **Settings** — notification preferences, account deletion
- **Mobile Responsive** — collapsible sidebar drawer, adaptive layouts across all pages

### Under the hood
- Optimistic drag-and-drop state management (instant UI feedback, rollback on failure)
- Automatic activity logging on every meaningful task change
- Complex MongoDB schema relations (Project → Task → Comment / ActivityLog / Notification)
- Redux Toolkit slices with async thunks for projects, tasks, and auth
- Modular component architecture (feature-based folder structure)

## Tech Stack

**Frontend**
- React + TypeScript (Vite)
- Redux Toolkit
- Material UI (MUI) + MUI X Data Grid
- `dnd-kit` (drag-and-drop)
- React Router

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication + bcrypt
- RESTful API

## Project Structure

```
taskflow/
├── taskflow-frontend/
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── app/              # Redux store, typed hooks
│   │   ├── components/       # Reusable components (feature-grouped)
│   │   │   ├── backlog/
│   │   │   ├── board/
│   │   │   ├── dashboard/
│   │   │   ├── task-detail/
│   │   │   └── topbar/
│   │   ├── features/         # Redux slices (auth, projects, tasks, ui)
│   │   ├── pages/             # Route-level pages
│   │   └── utils/             # Shared helpers
│   └── package.json
└── taskflow-backend/
    ├── src/
    │   ├── config/            # DB connection
    │   ├── controllers/       # Route handlers
    │   ├── middleware/        # Auth middleware
    │   ├── models/            # Mongoose schemas
    │   └── routes/            # Express routes
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

```bash
cd taskflow-backend
npm install
```

Create a `.env` file in `taskflow-backend/`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd taskflow-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `/login`, `/forgot-password`, `PUT /reset-password/:token`, `/me`, `/change-password` |
| Projects | `GET/POST /api/projects`, `PUT/DELETE /:id`, member management |
| Tasks | `GET/POST /api/tasks`, `PUT/DELETE /:id`, filtered by project |
| Comments | `GET/POST /api/comments/task/:taskId` |
| Activity | `GET /api/activity/task/:taskId`, `/project/:projectId` |
| Notifications | `GET /api/notifications`, `PUT /:id/read`, `/read-all` |

All protected routes require a `Bearer` JWT token in the `Authorization` header.

## Data Models

```
User        — name, email, password, role, notification preferences
Project     — name, description, owner, members[], status
Task        — title, description, status, priority, assignee, dueDate, labels[], order
Comment     — task, author, message
ActivityLog — task, user, action, oldValue, newValue
Notification — user, message, task, read
```

## Roadmap

- [ ] Subtasks / checklists
- [ ] File attachments
- [ ] Dark mode
- [ ] Bulk actions in Backlog view

## License

This project was built as a personal learning project and portfolio piece.

<!-- webhook test -->
