
# 🧩 TaskFlow

**TaskFlow** is a full-stack project and sprint management application — inspired by tools like **Jira** — built using **Next.js** (App Router), **ShadCN UI**, **Prisma**, and **Clerk** for authentication and role-based access (Auth & RBAC). It offers a smooth, modern UI with intuitive workflows for project-based teams.

🌐 **Live Demo:** [task-flow.vercel.app](https://task-flow-three-opal.vercel.app/)

---

## 📸 Screenshots

![Landing Page Screenshot](./public/LandingPage.png)

![Dashboard Screenshot](./public/Dashboard.png)

![Project Issues Page Screenshot](./public/ViewProjectIssues.png)

![Edit/View Issue Dialog Screenshot](./public/EditIssues.png)

![Create Issue Screenshot](./public/CreateIssue.png)

---

## 🚀 Features

- 🔐 **Authentication & RBAC** – Secure login and scoped access via Clerk  
- 🗂️ **Project Management** – Create, configure, and manage multiple projects  
- 📆 **Sprint Management** – Create sprints inside projects with clear timelines  
- 🐛 **Issue Tracking** – Create, update, prioritize, and manage issues  
- 🧲 **Drag & Drop Board** – Effortless drag-and-drop to move issues across “To Do”, “In Progress”, “In Review”, and “Done”  
- 👥 **Organization View** – Manage users -> issues at the org level

---

## 🧱 Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Frontend    | Next.js (App Router) |
| UI Library  | ShadCN / Radix / Tailwind |
| ORM         | Prisma               |
| Auth        | Clerk                |
| Database    | PostgreSQL (NeonDB) via Prisma |
| Hosting     | Vercel               |

---

## 🧩 Folder Structure

```

.
├── actions           # Server actions (issues, projects, sprints, orgs)
├── app               # Next.js App Router pages & layouts
│   ├── (auth)        # Sign in / Sign up flows
│   └── (main)        # Main app – onboarding, projects, orgs, boards
├── components        # Shared UI components (cards, dialogs, header, etc.)
├── hooks             # Custom hooks (e.g. useFetch)
├── lib               # Utils, validators, Prisma client
├── prisma            # Schema & migrations
├── public            # Logos & static assets
└── middleware.js     # Auth protection

````

---

## 🔧 Getting Started

> Ensure you have **Node.js** and **npm** installed

### 1. Clone the repo

```bash
git clone https://github.com/RESTfulAyush/task-flow.git
cd task-flow
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your environment

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/taskflow
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run dev
```

Access the app on [http://localhost:3000](http://localhost:3000)

---

## 🛣️ Roadmap

* 📦 Containerization with Docker
* 🚀 CI/CD setup
* 📊 Analytics Dashboard
* 🏷️ Issue labels & tagging
* 🔕 Real-time notifications
* 💬 Comments & activity logs
* 📱 Mobile-responsive enhancements
