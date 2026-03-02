<p align="center">
  <h1 align="center">📋 DailyDocket</h1>
  <p align="center">A modern business management web application for tracking sales, orders, expenses, and users — powered by AI assistance.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/AI_Chatbot-MiniMax_M2.1-7C3AED?style=for-the-badge&logo=openai&logoColor=white" alt="AI Chatbot" />
  <img src="https://img.shields.io/badge/NVIDIA-Inference_API-76B900?style=for-the-badge&logo=nvidia&logoColor=white" alt="NVIDIA" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [AI Chatbot System](#-ai-chatbot-system)
- [Application Sections](#-application-sections)
  - [Dashboard](#1-dashboard)
  - [Sales](#2-sales)
  - [Orders](#3-orders)
  - [Expenses](#4-expenses)
  - [User Management](#5-user-management)
- [Financial Terms Glossary](#-financial-terms-glossary)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**DailyDocket** is a full-featured business management platform designed for small-to-medium businesses to efficiently track daily sales, manage orders, log expenses, and control user access — all from a sleek, dark-themed dashboard.

The application includes a built-in **AI-powered chatbot** that acts as a business advisor, helping users understand their financial data, navigate features, and get actionable business insights in real-time.

---

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Real-time overview of revenue, sales, expenses, and items sold with trend indicators |
| 💰 **Sales Management** | Record daily sales with opening/closing balance tracking |
| 📦 **Order Tracking** | Manage orders with status tracking, delivery dates, and bill uploads |
| 💸 **Expense Logging** | Categorized expense tracking with payment status and receipts |
| 👥 **User Management** | Role-based user system (Administrator, Staff, Accountant) |
| 🤖 **AI Chatbot** | Embedded business assistant powered by NVIDIA inference |

### UI/UX Features
| Feature | Description |
|---------|-------------|
| 🌙 **Dark Theme** | Premium dark purple aesthetic with accent colors |
| 📱 **Fully Responsive** | Mobile-first design with card layouts for small screens |
| 📤 **Data Export** | Export to Excel (.xlsx) or PDF from any data table |
| 🔍 **Sorting & Filtering** | Column sorting and category/status filtering |
| ⬆️ **Drag & Drop Upload** | File uploads with drag-and-drop support |
| 💀 **Skeleton Loading** | Smooth loading states that match the data layout |
| 🎨 **Glassmorphism UI** | Modern glassmorphic chatbot panel with animations |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 15.5.4 |
| **UI Library** | React | 19.1.0 |
| **Styling** | Tailwind CSS | 4.1.14 |
| **Font** | Figtree (Google Fonts) | — |
| **Icons** | react-icons | 5.5.0 |
| **Date Picker** | react-datepicker | 8.7.0 |
| **AI SDK** | OpenAI SDK (NVIDIA endpoint) | latest |
| **AI Model** | MiniMax M2.1 (via NVIDIA) | — |
| **Build Tool** | Turbopack | — |

---

## 📁 Project Structure

```
DailyDocket/
├── .env.local                          # Environment variables (API keys)
├── package.json                        # Dependencies and scripts
├── next.config.mjs                     # Next.js configuration
├── tailwind.config.js                  # Tailwind CSS theme configuration
├── postcss.config.mjs                  # PostCSS configuration
├── public/                             # Static assets
│
└── src/
    ├── app/
    │   ├── layout.jsx                  # Root layout (Figtree font, providers)
    │   ├── page.jsx                    # Dashboard page
    │   ├── globals.css                 # Global styles & theme variables
    │   ├── loading.jsx                 # Root loading state
    │   │
    │   ├── api/
    │   │   └── chat/
    │   │       ├── route.js            # AI chatbot API endpoint (POST)
    │   │       └── systemPrompt.js     # AI system prompt & training data
    │   │
    │   └── (main)/
    │       ├── sales/
    │       │   ├── page.jsx            # Sales list page
    │       │   ├── add-sales/page.jsx  # Add sale form
    │       │   └── edit/[id]/page.jsx  # Edit sale form
    │       │
    │       ├── orders/
    │       │   ├── page.jsx            # Orders list page
    │       │   ├── add-orders/page.jsx # Add order form
    │       │   └── edit/[id]/page.jsx  # Edit order form
    │       │
    │       ├── expenses/
    │       │   ├── page.jsx            # Expenses list page
    │       │   └── add-expenses/page.jsx
    │       │
    │       ├── manage-categories/
    │       │   └── page.jsx            # Category management
    │       │
    │       └── user-management/
    │           ├── page.jsx            # Users list page
    │           ├── add-new-user/page.jsx
    │           └── edit/[id]/page.jsx
    │
    ├── components/
    │   ├── chatbot/
    │   │   └── ChatWidget.jsx          # Floating AI chatbot widget
    │   ├── layout/
    │   │   └── MainLayout.jsx          # Main layout with sidebar + navbar
    │   ├── shared/
    │   │   ├── navbar.jsx              # Top navigation bar
    │   │   └── sidebar.jsx             # Collapsible sidebar
    │   ├── ui/
    │   │   ├── CustomDatePicker.jsx    # Themed date picker
    │   │   ├── CustomDropdown.jsx      # Themed dropdown
    │   │   ├── dashboardCard.jsx       # Dashboard metric card
    │   │   ├── DashboardCardSkeleton.jsx
    │   │   └── Skeleton.jsx            # Base skeleton component
    │   ├── sales/
    │   │   ├── SalesTable.jsx          # Sales data table
    │   │   ├── SalesMobileCard.jsx     # Mobile card layout
    │   │   └── SalesTableSkeleton.jsx
    │   ├── orders/
    │   │   ├── OrdersTable.jsx         # Orders data table
    │   │   ├── OrderMobileCard.jsx
    │   │   ├── OrdersTableSkeleton.jsx
    │   │   └── StatusFilter.jsx        # Order status filter
    │   ├── expenses/
    │   │   ├── ExpensesTable.jsx        # Expenses data table
    │   │   ├── ExpensesMobileCard.jsx
    │   │   ├── ExpensesTableSkeleton.jsx
    │   │   ├── CategoryFilter.jsx
    │   │   └── PaymentStatusFilter.jsx
    │   └── user-management/
    │       ├── UsersTable.jsx           # Users data table
    │       ├── UserMobileCard.jsx
    │       ├── UsersTableSkeleton.jsx
    │       └── RoleFilter.jsx           # Role-based filter
    │
    ├── contexts/
    │   └── SidebarContext.jsx           # Sidebar expand/collapse state
    │
    ├── hooks/                           # Custom React hooks
    │
    └── styles/
        ├── layout.css                   # Layout-specific styles
        └── chatbot.css                  # AI chatbot widget styles
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- An **NVIDIA API key** for the AI chatbot (optional — app works without it)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/DailyDocket.git
cd DailyDocket
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:

```env
# NVIDIA Inference API Key (server-side only — never prefix with NEXT_PUBLIC_)
NVIDIA_API_KEY=your_nvidia_api_key_here
```

> ⚠️ **Important:** Do NOT prefix the API key with `NEXT_PUBLIC_`. This ensures it stays server-side and is never exposed to the browser.

4. **Start the development server**

```bash
npm run dev
```

5. **Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start dev server with Turbopack |
| **Build** | `npm run build` | Create production build |
| **Start** | `npm start` | Start production server |
| **Lint** | `npm run lint` | Run ESLint checks |

---

## 🤖 AI Chatbot System

### Overview

DailyDocket includes a production-ready AI chatbot that appears as a floating widget in the bottom-right corner of every page. It serves as a business advisor and app guide.

### Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐         ┌─────────────────────┐
│   Browser (Client)  │  POST   │  Next.js Route Handler   │  HTTPS  │  NVIDIA Inference    │
│                     │────────▶│  /api/chat               │────────▶│  API Endpoint        │
│   ChatWidget.jsx    │         │  (Server-Side Only)      │         │  (MiniMax M2.1)      │
│                     │◀────────│                          │◀────────│                      │
│                     │   SSE   │  API Key stays here ✅    │  Stream │                      │
└─────────────────────┘  Stream └──────────────────────────┘         └─────────────────────┘
```

### Security Model

| Aspect | Implementation |
|--------|---------------|
| **API Key Storage** | `.env.local` (server-side only, never in client bundle) |
| **Key Prefix** | No `NEXT_PUBLIC_` prefix — Next.js excludes from client |
| **Client Communication** | Frontend calls `/api/chat` → server proxies to NVIDIA |
| **Streaming** | Server-Sent Events (SSE) for real-time token streaming |

### Model Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | `minimaxai/minimax-m2.1` | High-quality reasoning for business insights |
| **Temperature** | `0.4` | Low creativity → factual, consistent answers |
| **Top P** | `0.9` | Balanced token diversity for natural language |
| **Max Tokens** | `2048` | Sufficient for detailed guides, caps response cost |

### What the Chatbot Can Do

| Capability | Example |
|-----------|---------|
| 📊 **Analyze Sales Data** | "My sales are ₹2,50,000 and expenses ₹1,80,000. Analyze." |
| 📈 **Calculate Profit** | Auto-computes profit, margins, and per-item revenue |
| 📝 **Step-by-Step Guides** | "How do I add a new sale?" → numbered steps with exact button names |
| 📖 **Explain Financial Terms** | "What is Opening Balance?" → definition + example |
| 🔍 **Navigate Features** | "How do I export my data?" → exact steps with format options |
| 💡 **Business Suggestions** | Proactive cost-saving and revenue optimization tips |
| 🚫 **Scope Guard** | Politely declines off-topic questions |

### Chatbot Files

| File | Purpose |
|------|---------|
| `src/app/api/chat/route.js` | API endpoint — handles POST, streams SSE |
| `src/app/api/chat/systemPrompt.js` | System prompt with training data, examples, guardrails |
| `src/components/chatbot/ChatWidget.jsx` | React widget — UI, state, streaming renderer |
| `src/styles/chatbot.css` | Glassmorphism panel, animations, responsive styles |

---

## 📋 Application Sections

### 1. Dashboard

The landing page showing four key business KPIs:

| Metric | Description | Trend Indicator |
|--------|-------------|-----------------|
| Total Revenue | Overall income generated | ▲/▼ year-over-year |
| Total Sales | Sales transactions value (monthly) | ▲/▼ comparison |
| Total Expenses | Categorized expenses (30-day) | ▲/▼ comparison |
| Total Items Sold | Unit count sold | ▲/▼ year-over-year |

### 2. Sales

Track daily sales with full cash-flow accounting.

**Table Columns:** Date • Opening Cash • Purchase Cash • Online Cash • Physical Cash • Cash Transferred • Closing Cash • Total Sale

**Add Sale Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker (dd/MM/yyyy) | ✅ |
| Opening Cash | Number (₹) | ✅ |
| Purchase Cash | Number (₹) | ✅ |
| Online Cash | Number (₹) | ✅ |
| Physical Cash | Number (₹) | ✅ |
| Cash Transferred | Number (₹) | ✅ |
| Closing Cash | Number (₹) | ✅ |
| Total Sale | Number (₹) | ✅ |
| File Upload | PDF/Word/PNG/JPG (10MB max) | ❌ |

### 3. Orders

Manage customer orders with status tracking and document attachments.

**Table Columns:** Date • Order ID • Customer Name • Amount • Payment Mode • Delivery Date • Status • Bill

**Add Order Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker | ✅ |
| Delivery Date | Date picker (future dates only) | ✅ |
| Order ID | Text | ✅ |
| Customer Name | Text | ✅ |
| Amount | Number (₹) | ❌ |
| Payment Mode | Dropdown: Online, Cash | ✅ |
| Order Status | Dropdown: Order Received, Out for Delivery, Completed, Cancelled | ✅ |
| Bill Attachment | PDF/Excel (12MB max) | ❌ |
| Payment Attachment | PDF/Excel (12MB max) | ❌ |

**Order Statuses:**
| Status | Badge Color | Meaning |
|--------|------------|---------|
| Order Received | 🔵 Blue | Order placed, awaiting processing |
| Out for Delivery | 🟡 Yellow | Dispatched, in transit |
| Completed | 🟢 Green | Successfully delivered |
| Cancelled | 🔴 Red | Order cancelled |

### 4. Expenses

Log and categorize business expenses with payment tracking.

**Table Columns:** Date • Category • Subcategory • Amount • Payment Mode • Status • Bill

**Expense Statuses:**
| Status | Badge Color | Meaning |
|--------|------------|---------|
| Paid | 🟢 Green | Payment completed |
| Pending | 🟡 Yellow | Payment pending |

### 5. User Management

Manage team members with role-based access control.

**User Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | ✅ |
| Email Address | Email | ✅ |
| Password | Password (with show/hide toggle) | ✅ |
| Role | Dropdown: Administrator, Staff, Accountant | ✅ |
| Profile Picture | PNG/JPG/PDF/Excel (12MB max) | ❌ |

**User Roles:**
| Role | Badge Color | Access Level |
|------|------------|-------------|
| Administrator | 🔴 Red | Full system access |
| Staff | 🔵 Blue | Operational access |
| Accountant | 🟡 Yellow | Financial data access |

---

## 📚 Financial Terms Glossary

| Term | Definition |
|------|-----------|
| **Opening Cash** | Cash in register at start of day (= previous day's Closing Cash) |
| **Closing Cash** | Cash remaining at end of day |
| **Purchase Cash** | Cost of goods/materials bought (outflow) |
| **Online Cash** | Revenue via UPI, cards, digital wallets |
| **Physical Cash** | Revenue received as physical currency |
| **Cash Transferred** | Cash removed from register (bank deposit, withdrawals) |
| **Total Sale** | Day's total revenue = Online Cash + Physical Cash |
| **Total Revenue** | Cumulative income over a period |
| **Total Expenses** | Cumulative logged expenses over a period |
| **Profit** | Revenue − Expenses |
| **Profit Margin** | (Profit / Revenue) × 100 |

**Cash Register Formula:**
```
Closing Cash = Opening Cash + Physical Cash − Cash Transferred − Purchase Cash
```

---

## 📡 API Reference

### POST `/api/chat`

AI chatbot endpoint with streaming response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "How do I add a new sale?" }
  ]
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"content":"Here's"}
data: {"content":" how"}
data: {"content":" to"}
data: {"content":" add..."}
data: [DONE]
```

**Error Response:**
```json
{
  "error": "An error occurred while processing your request."
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | Array | ✅ | Array of message objects with `role` and `content` |

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NVIDIA_API_KEY` | For chatbot | NVIDIA inference API key for MiniMax M2.1 model |

> **Security Note:** The `NVIDIA_API_KEY` is stored in `.env.local` and is ONLY accessible server-side. It is never included in the client-side JavaScript bundle.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by the   Cortex IT Team
</p>
