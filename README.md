# FlowTask Frontend

**Backend Repository:** `https://github.com/LUC1f3R-0/newnop-FlowTask-management-system-be.git`

FlowTask is a role-based task management frontend built with React. It connects to the FlowTask backend API and supports two main user roles: normal users and admin users.

Normal users can register, verify their email with OTP, log in, view their dashboard summary, manage their tasks, assign tasks to available users, and soft delete tasks. Admin users have extra privileges such as viewing all tasks, viewing users, accessing deleted tasks, editing deleted tasks, and restoring deleted tasks.

---

## Demo Login Details

### Normal User

```txt
Email: gamil.com
Password: 42575642184710
```

> Note: This is the demo user login information provided for testing. Make sure the backend database already has this user before trying to log in.

### Admin User

Admin login depends on the backend seeded admin account. Use the admin credentials created by the backend seed or database administrator.

---

## Project Overview

This frontend is connected to the FlowTask backend API. It uses protected routes, cookie-based authentication, API key headers, and role-based navigation.

The app has two main role flows:

1. **Normal User**
   - Can register and verify email.
   - Can log in after verification.
   - Can view the user dashboard.
   - Can view, create, edit, show, assign, and soft delete visible tasks.
   - Can only access user-side pages.

2. **Admin**
   - Can log in as admin.
   - Can view the admin dashboard.
   - Can view all tasks.
   - Can view users.
   - Can access the deleted tasks page.
   - Can edit deleted tasks.
   - Can restore deleted tasks so they appear again in the normal task list.
   - Can access admin-only sidebar items.

---

## Technical Overview

The frontend is built using:

- **React** for building the user interface.
- **TypeScript** for type-safe frontend development.
- **Vite** for fast development and production builds.
- **TanStack Router** for route handling and protected routing.
- **Axios** for API requests and backend communication.
- **Tailwind CSS** for styling.
- **shadcn/ui components** for reusable UI elements.
- **Formik** for form state handling.
- **Yup** for form validation.
- **Sonner** for toast notifications.
- **Lucide React** for icons.

The frontend communicates with the backend using Axios. API requests include the backend base URL, the `/api/v1` prefix, the required API key header, and cookies for authentication.

---

## Main Features

### Authentication

The frontend supports account registration, login, logout, and email OTP verification.

When a new user does not have an account, they can go to the register page and create an account. After registration, the system sends an OTP to the user's email. The user must enter that OTP to verify the email address. After the email is verified, the user can log in normally.

If the user tries to log in before verifying the email, the system opens the OTP verification flow again and allows the user to verify the email.

### Default User Role

Newly registered users are created as normal users by default.

That means after registration and login, the user will be redirected to the user-side area of the system, not the admin area.

---

## User Flow

### 1. Register a New Account

Go to:

```txt
/register
```

Fill in the required information:

- Full name
- Email
- Password
- Confirm password

After submitting the form, the system sends an OTP to the user's email address.

The user must check their email, get the OTP, and enter it in the OTP verification modal. After successful verification, the user can log in.

### 2. Login

Go to:

```txt
/login
```

Enter the registered email and password.

If the account is verified, the user will be logged in and redirected to the correct dashboard based on their role.

If the account is not verified, the system will ask the user to verify the email using OTP.

### 3. Password Reset Note

The current frontend code does not include a completed forgot-password/reset-password page. If password reset is required, it should be added as a separate feature with matching backend API endpoints.

---

## User Pages

### User Dashboard

Path:

```txt
/user/dashboard
```

The user dashboard shows a summary of the user's task activity. It displays task counts and task progress, helping the user understand their current workload.

The dashboard is only available for logged-in normal users.

### User Tasks

Path:

```txt
/user/tasks
```

This page shows all tasks that are visible to the logged-in user. A normal user can see tasks that they created or tasks assigned to them.

From this page, the user can:

- View tasks
- Search tasks
- Filter tasks by status
- Filter tasks by priority
- Switch between table/card view
- Create a new task
- Edit a task
- View task details
- Soft delete a task
- Assign tasks to available users
- Use pagination to move through task records

When a user deletes a task, it is not immediately removed from the database. It is soft deleted. That means the task gets a deleted date and disappears from the normal task list.

---

## Admin Pages and Privileges

Admin users have more permissions than normal users. Admin-only pages are protected and cannot be accessed by normal users.

### Admin Dashboard

Path:

```txt
/admin/dashboard
```

The admin dashboard shows an overview of task activity across the whole system.

### All Tasks

Path:

```txt
/admin/tasks
```

The admin can see all active tasks in the system, not only tasks created by or assigned to the admin.

From this page, the admin can:

- View all active tasks
- Search tasks
- Filter tasks by status
- Filter tasks by priority
- Create tasks
- Edit tasks
- View task details
- Soft delete tasks
- Use pagination

### User Management

Path:

```txt
/admin/users
```

The admin can view users and their task activity.

### Deleted Tasks

Path:

```txt
/admin/deleted
```

This is an admin-only page. Normal users cannot see this page in their sidebar and cannot access this route.

When a user or admin soft deletes a task, the task is removed from the normal task list and appears in the deleted tasks page for admin users.

From the deleted tasks page, the admin can:

- View soft-deleted tasks
- See when each task was deleted
- Edit deleted tasks
- Restore deleted tasks

When the admin restores a deleted task, the task's `deletedAt` value becomes empty/null again. After that, the task becomes visible again in the normal All Tasks page.

This makes sure user-deleted tasks are not lost immediately and can be recovered by the admin.

---

## Route Summary

### Public Routes

```txt
/
 /login
 /register
```

### User Routes

```txt
/user/dashboard
/user/tasks
/profile
/tasks/create
/tasks/:id
/tasks/:id/edit
```

### Admin Routes

```txt
/admin/dashboard
/admin/tasks
/admin/users
/admin/deleted
/profile
/tasks/create
/tasks/:id
/tasks/:id/edit
```

---

## Environment Variables

Create a `.env` file in the frontend root.

Example:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_X_API_KEY=your_backend_x_api_key
```

The frontend automatically appends `/api/v1` to the API base URL if it is not already included.

Example:

```txt
VITE_API_BASE_URL=http://localhost:3000
```

will call:

```txt
http://localhost:3000/api/v1
```

---

## API Communication

The frontend uses Axios for all backend API requests.

Axios is configured to:

- Use the backend base URL from environment variables.
- Automatically include `/api/v1`.
- Send the `x-api-key` header.
- Send cookies with requests for authenticated routes.
- Capture and display backend errors using toast notifications.

This means logged-in users stay authenticated through backend cookies, and protected pages can request user/task data securely.

---

## Routing and Protection

The frontend uses TanStack Router for routing.

Routes are separated into:

- Public routes
- User-only routes
- Admin-only routes
- Shared authenticated routes

Normal users cannot access admin-only pages. Admin-only links, such as the deleted tasks page, are shown only in the admin sidebar.

If a user tries to access a route without the correct permission, the app redirects them or blocks access.

---

## UI and Styling

The UI is built using Tailwind CSS and shadcn/ui components.

Main UI features include:

- Responsive sidebar layout
- Role-based navigation
- Table and card task views
- Search and filter bars
- Pagination controls
- Confirmation modals
- Toast notifications
- Status and priority badges
- Dashboard summary cards

---

## Installation

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Frontend Technology Stack

- React
- TypeScript
- Vite
- TanStack Router
- Axios
- Tailwind CSS
- shadcn/ui components
- Sonner toast notifications
- Formik and Yup validation
- Lucide React icons

---

## Important Notes

- Normal users cannot see admin-only sidebar links.
- Normal users cannot open the deleted tasks page.
- Deleted tasks are soft deleted first.
- Admin can restore soft-deleted tasks.
- Admin can edit soft-deleted tasks before restoring them.
- New users are normal users by default.
- Email verification is required before normal login.
- Password reset is not included in the current frontend unless it is added later with matching backend support.
- The frontend requires the backend API to be running before protected pages can load data.

---

## Recommended Test Flow

1. Start the backend.
2. Start the frontend.
3. Open the frontend in the browser.
4. Register a new user.
5. Check email for OTP.
6. Verify the OTP.
7. Log in as the user.
8. Go to `/user/dashboard`.
9. Go to `/user/tasks`.
10. Create a task.
11. Edit the task.
12. Delete the task.
13. Log in as admin.
14. Go to `/admin/deleted`.
15. Edit or restore the deleted task.
16. Go to `/admin/tasks` and confirm the restored task is visible again.

---

## Project Purpose

This frontend was created for a role-based task management system. It demonstrates user authentication, OTP verification, task CRUD operations, task assignment, soft delete handling, admin-only recovery features, protected route navigation, API integration, and modern React frontend development.
