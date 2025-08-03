# 🔧 Website14 - Web Development Agency Wireframe

## 🛠️ Tech Stack Overview

| Component      | Stack                                   |
| -------------- | --------------------------------------- |
| Frontend       | Next.js (Static Site Generation - SSG)  |
| Hosting        | Firebase Hosting (No SSR)               |
| Auth           | Firebase Auth (Email/Password + Google) |
| Database       | Firebase Firestore                      |
| Optional Logic | Firebase Functions                      |

### 🔄 Tech Stack Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Side (Browser)                       │
├─────────────────────────────────────────────────────────────────┤
│  📱 Next.js App (SSG)                                        │
│  ├── Static Pages (Home, Services, About, Contact)           │
│  ├── Dynamic Pages (Blog, Project Builder)                   │
│  ├── Client Portal (Protected Routes)                         │
│  └── Admin Portal (Hidden Routes)                             │
│                                                               │
│  🎨 UI Components                                            │
│  ├── Responsive Design (Mobile/Desktop)                      │
│  ├── Accessibility (WCAG 2.1 AA)                             │
│  ├── Multi-language Support (10 Languages)                   │
│  └── Voice Navigation (Speech Recognition)                    │
│                                                               │
│  🔄 PWA Features                                             │
│  ├── Service Worker (Offline Caching)                        │
│  ├── IndexedDB (Local Storage)                               │
│  ├── Background Sync (Data Sync)                             │
│  └── Push Notifications (User Engagement)                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Server Side (Firebase)                      │
├─────────────────────────────────────────────────────────────────┤
│  🔐 Authentication                                            │
│  ├── Firebase Auth (Email/Password)                          │
│  ├── Google Sign-In (OAuth)                                  │
│  ├── Role-based Access (Client/Admin)                        │
│  └── Custom Claims (Admin Verification)                       │
│                                                               │
│  🗄️ Database (Firestore)                                     │
│  ├── Users Collection (Profiles, Subscriptions)              │
│  ├── Leads Collection (Pipeline Management)                   │
│  ├── Projects Collection (Client Work)                        │
│  ├── Invoices Collection (Billing)                           │
│  ├── Subscriptions Collection (Recurring Billing)            │
│  ├── Translations Collection (Multi-language)                 │
│  └── Accessibility Collection (User Preferences)              │
│                                                               │
│  ⚡ Cloud Functions                                           │
│  ├── Payment Processing (Stripe Integration)                 │
│  ├── Email Automation (Notifications)                        │
│  ├── Invoice Generation (Recurring Billing)                  │
│  ├── Translation Services (Google Translate API)             │
│  └── Background Tasks (Data Processing)                      │
│                                                               │
│  🌐 Hosting (Firebase Hosting)                               │
│  ├── Static File Serving (HTML/CSS/JS)                      │
│  ├── CDN Distribution (Global Performance)                   │
│  ├── SSL Certificates (Security)                             │
│  └── Custom Domains (Branding)                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                           │
├─────────────────────────────────────────────────────────────────┤
│  💳 Stripe (Payments)                                        │
│  ├── Subscription Management                                  │
│  ├── Proration Handling                                      │
│  ├── Webhook Processing                                      │
│  └── Invoice Automation                                       │
│                                                               │
│  🌍 Google Translate API (i18n)                              │
│  ├── Automatic Translation                                    │
│  ├── Language Detection                                       │
│  ├── RTL Support (Arabic)                                    │
│  └── Translation Caching                                      │
│                                                               │
│  📍 IP Geolocation (Location Services)                       │
│  ├── Currency Detection                                       │
│  ├── Language Detection                                       │
│  ├── Dynamic Pricing                                          │
│  └── Regional Content                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Deployment Setup

### Public Pages

- Built using `getStaticProps()` to generate fully static HTML.
- Must work **without JavaScript** for SEO-critical content.
- JS-only enhancements are allowed (e.g., dynamic pricing).
- **Blog posts**: Generated at build-time from Firestore, deployed as static HTML.

### Client Portal

- Client-side rendered (CSR) React components.
- Routes protected using Firebase Auth.

### Admin Portal

- Hidden URL route (`/admin`)
- Not linked from UI — must be accessed manually.
- Role-based access (`admin` role via Firestore or custom claim).

### 🔄 Deployment Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Build Process                               │
├─────────────────────────────────────────────────────────────────┤
│  📝 Development                                               │
│  ├── Next.js App Development                                 │
│  ├── Component Creation                                       │
│  ├── API Integration                                         │
│  └── Testing & Optimization                                  │
│                                                               │
│  🔧 Build Time                                               │
│  ├── Static Generation (getStaticProps)                      │
│  ├── Blog Post Generation (from Firestore)                   │
│  ├── Asset Optimization (Images, CSS, JS)                   │
│  └── SEO Optimization (Meta tags, Sitemap)                  │
│                                                               │
│  📦 Deployment                                               │
│  ├── Firebase Hosting (Static Files)                         │
│  ├── CDN Distribution (Global)                               │
│  ├── SSL Certificate (Security)                              │
│  └── Custom Domain (website14.com)                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Page Types & Access                         │
├─────────────────────────────────────────────────────────────────┤
│  🌐 Public Pages (Static + SEO)                              │
│  ├── Home (/), About (/about), Services (/services)          │
│  ├── Contact (/contact), Blog (/blog), FAQ (/faq)           │
│  ├── Project Builder (/builder), Sign Up (/signup)           │
│  └── Login (/login)                                          │
│                                                               │
│  👤 Client Portal (Protected + CSR)                          │
│  ├── Dashboard (/client)                                     │
│  ├── Project Management (/client/project)                    │
│  ├── Communication (/client/chat)                            │
│  ├── Support Tickets (/client/tickets)                       │
│  └── Billing (/client/billing)                               │
│                                                               │
│  🔐 Admin Portal (Hidden + Protected)                        │
│  ├── Admin Dashboard (/admin)                                │
│  ├── Lead Management (/admin/leads)                          │
│  ├── Client Management (/admin/clients)                      │
│  ├── Project Oversight (/admin/projects)                     │
│  ├── Ticket Management (/admin/tickets)                      │
│  ├── Analytics (/admin/stats)                                │
│  └── Pricing Management (/admin/pricing)                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Security & Access Control                   │
├─────────────────────────────────────────────────────────────────┤
│  🔓 Public Access                                            │
│  ├── No Authentication Required                               │
│  ├── SEO Optimized (Static HTML)                             │
│  ├── JavaScript Fallback (Works without JS)                  │
│  └── Performance Optimized (CDN + Caching)                   │
│                                                               │
│  🔐 Client Access                                            │
│  ├── Firebase Auth Required                                  │
│  ├── Role: "client"                                          │
│  ├── Session Management                                       │
│  └── Real-time Updates (Firestore Listeners)                 │
│                                                               │
│  🛡️ Admin Access                                             │
│  ├── Firebase Auth Required                                  │
│  ├── Role: "admin" (Custom Claims)                           │
│  ├── Hidden Routes (Not in Navigation)                       │
│  └── Full System Access                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔓 Public Pages (Static Only)

| Page            | Route            | Features                                                                                 |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| Home            | `/`              | Competitive advantages, unlimited updates, better than DIY                               |
| About           | `/about`         | Agency history, team, values                                                             |
| Services        | `/services`      | Dynamic pricing by location, fallback to USD when JS disabled                            |
| Blog            | `/blog`          | Static HTML generated at build-time from Firestore                                       |
| Contact         | `/contact`       | Lead capture form with reCAPTCHA, consultation booking, cold outreach                    |
| Project Builder | `/builder`       | Comprehensive questionnaire with lead capture, location tracking, package recommendation |
| Order           | `/order`         | Service selection with dynamic pricing and billing cycles                                |
| Order Confirm   | `/order/confirm` | Order review, project details, payment method selection                                  |
| Order Success   | `/order/success` | Payment confirmation, order details, next steps                                          |
| Sign Up         | `/signup`        | Firebase Auth registration with reCAPTCHA                                                |
| Login           | `/login`         | Firebase Auth login with reCAPTCHA                                                       |

⚠️ SEO Note: Ensure HTML contains all essential content at build time. Avoid relying on JS for important info.
⚠️ **JavaScript Fallback**: All public pages must function with JS disabled. Services page shows USD prices by default, updates dynamically when JS loads.

---

## 🔐 Client Portal (CSR + Protected)

| Page               | Route             | Features                                              |
| ------------------ | ----------------- | ----------------------------------------------------- |
| Dashboard          | `/client`         | Project overview, recent activity, quick actions      |
| Project Management | `/client/project` | Phase tracking, deliverables, approvals, timeline     |
| Communication      | `/client/chat`    | Real-time messaging, comments, approvals              |
| Support Tickets    | `/client/tickets` | Create/view/respond to maintenance requests           |
| Billing            | `/client/billing` | Setup fees, monthly hosting, add-ons, payment history |

- All routes require `firebase.auth().currentUser`.
- Unauthorized users are redirected to `/login`.

---

## 🔐 Admin Portal (Hidden + Protected)

| Page               | Route             | Features                                                                                 |
| ------------------ | ----------------- | ---------------------------------------------------------------------------------------- |
| Admin Dashboard    | `/admin`          | Metrics overview, lead pipeline                                                          |
| Lead Management    | `/admin/leads`    | Track by industry, cold calls, follow-ups, conversions                                   |
| Client Management  | `/admin/clients`  | View and manage clients                                                                  |
| Project Oversight  | `/admin/projects` | Update and review all client projects                                                    |
| Ticket Management  | `/admin/tickets`  | View/respond to all support tickets                                                      |
| Analytics          | `/admin/stats`    | Competitive advantages impact, conversion rates, revenue metrics                         |
| Pricing Management | `/admin/pricing`  | Manage prices for all currencies (INR, USD, CAD, EUR, GBP, SAR, AED, QAR, KWD, BHD, OMR) |

⚠️ Admin portal is **not publicly linked**. Must be accessed manually. Requires `role: admin`.

---

## 🔐 Firebase Auth Structure

### 🔑 Clients

```json
{
  "uid": "abc123",
  "email": "client@example.com",
  "role": "client"
}
```

### 🔑 Admins

```json
{
  "uid": "admin123",
  "email": "admin@example.com",
  "role": "admin"
}
```

- Admin flag set manually in Firestore or using custom claims.
- Auth methods: **Email/Password** + **Google Sign-In**

### 🔄 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Authentication Flow                    │
├─────────────────────────────────────────────────────────────────┤
│  🚪 Login Process                                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ 📧 Email/Pass   │ │ 🔍 Google OAuth │ │ 📱 Phone Auth   │ │
│  │ • Email Input   │ │ • Google Sign-In│ │ • SMS Code      │ │
│  │ • Password      │ │ • OAuth Flow    │ │ • Verification  │ │
│  │ • Validation    │ │ • Token Exchange│ │ • Phone Number  │ │
│  │ • Firebase Auth │ │ • User Profile  │ │ • Firebase Auth │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                               │
│  🔐 Authentication Verification                               │
│  ├── Firebase Auth Token Validation                          │
│  ├── Custom Claims Check (Admin Role)                        │
│  ├── Session Management (Local Storage)                      │
│  └── Token Refresh (Auto-renewal)                            │
│                                                               │
│  👤 User Role Assignment                                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ 🔓 Public       │ │ 👤 Client       │ │ 🛡️ Admin        │ │
│  │ • No Auth       │ │ • Role: client  │ │ • Role: admin   │ │
│  │ • Static Pages  │ │ • Client Portal │ │ • Admin Portal  │ │
│  │ • SEO Optimized │ │ • Projects      │ │ • Full Access   │ │
│  │ • Lead Capture  │ │ • Billing       │ │ • Analytics     │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Access Control Matrix                       │
├─────────────────────────────────────────────────────────────────┤
│  🌐 Public Routes (No Auth)                                  │
│  ├── / (Home)                                                │
│  ├── /about (About)                                          │
│  ├── /services (Services)                                    │
│  ├── /contact (Contact)                                      │
│  ├── /blog (Blog)                                            │
│  ├── /builder (Project Builder)                              │
│  ├── /signup (Registration)                                  │
│  └── /login (Login)                                          │
│                                                               │
│  👤 Client Routes (Auth Required)                            │
│  ├── /client (Dashboard)                                     │
│  ├── /client/project (Project Management)                    │
│  ├── /client/chat (Communication)                            │
│  ├── /client/tickets (Support)                               │
│  └── /client/billing (Billing)                               │
│                                                               │
│  🛡️ Admin Routes (Admin Auth Required)                       │
│  ├── /admin (Admin Dashboard)                                │
│  ├── /admin/leads (Lead Management)                          │
│  ├── /admin/clients (Client Management)                      │
│  ├── /admin/projects (Project Oversight)                     │
│  ├── /admin/tickets (Ticket Management)                      │
│  ├── /admin/stats (Analytics)                                │
│  └── /admin/pricing (Pricing Management)                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Security Measures                           │
├─────────────────────────────────────────────────────────────────┤
│  🔒 Authentication Security                                   │
│  ├── Firebase Auth (Google-managed)                          │
│  ├── Custom Claims (Role-based Access)                       │
│  ├── Token Expiration (1 hour)                               │
│  ├── Auto-refresh (Before expiration)                        │
│  └── Rate Limiting (Login attempts)                          │
│                                                               │
│  🛡️ Authorization Security                                   │
│  ├── Route Protection (Client-side)                          │
│  ├── API Protection (Server-side)                            │
│  ├── Firestore Rules (Database-level)                        │
│  ├── Custom Claims Verification                              │
│  └── Session Validation                                      │
│                                                               │
│  🔐 Data Security                                            │
│  ├── HTTPS Only (SSL/TLS)                                    │
│  ├── Input Validation (Client & Server)                      │
│  ├── XSS Prevention (React built-in)                        │
│  ├── CSRF Protection (Tokens)                                │
│  └── Content Security Policy (CSP)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Firestore Collections

```
users/
  uid/
    name, email, role

leads/
  leadId/
    name, email, phone, company, industry, source, status, notes, followUpDate
    ipAddress, country, city, currency, userAgent
    industry: "restaurant" | "retail" | "healthcare" | "real-estate" | "professional-services" | "ecommerce" | "startup" | "other"
    source: "cold-call" | "website-form" | "project-builder" | "referral" | "social"
    status: "new" | "contacted" | "qualified" | "proposal" | "closed" | "lost"

orders/
  orderId/
    userId, orderNumber, status, createdAt, updatedAt
    services: { packages[], addons[] }
    billing: { setupTotal, monthlyTotal, billingCycle, currency }
    project: { businessName, requirements, timeline, budget }
    payment: { method, status, transactionId, amount, currency }
    status: "pending" | "paid" | "processing" | "completed" | "cancelled"

projects/
  projectId/
    orderId, clientId, title, status, industry, phases[], files[], feedback[], timeline[]
    industry: "restaurant" | "retail" | "healthcare" | "real-estate" | "professional-services" | "ecommerce" | "startup" | "other"
    competitiveAdvantages: {
      unlimitedUpdates: true,
      fasterThanDIY: true,
      betterSupport: true,
      customFeatures: [],
      technologyStack: "Next.js + Firebase"
    }
    phases: [
      { name: "Discovery", status: "completed", startDate, endDate, deliverables[] },
      { name: "Design", status: "in-progress", wireframes[], mockups[], approvals[] },
      { name: "Development", status: "pending", frontend[], backend[], integrations[] },
      { name: "Testing", status: "pending", qa[], bugReports[], fixes[] },
      { name: "Launch", status: "pending", deployment[], goLive[], handover[] },
      { name: "Support", status: "ongoing", maintenance[], updates[], monitoring[] }
    ]

tickets/
  ticketId/
    clientId, status, messages[], attachments[], priority, category

invoices/
  invoiceId/
    clientId, amount, status, date, paymentMethod, dueDate, items[]
    billingType: "setup" | "monthly" | "addon"
    planType: "static" | "dynamic" | "ecommerce"
    addons: { extraPages, extraProducts, extraPaymentGateways, emailAccounts }

payments/
  paymentId/
    orderId, userId, amount, currency, method, status, transactionId
    method: "paypal" | "manual" | "bank-transfer" | "cash" | "check"
    status: "pending" | "completed" | "failed" | "cancelled"
    createdAt, completedAt, notes

blog/
  postId/
    title, content, tags[], createdAt

pricing/
  currency/
    static: { setup: 59, monthly: 5 }
    dynamic: { setup: 120, monthly: 7.2 }
    ecommerce: { setup: 180, monthly: 11 }
    addons: { extraPage: 3, extraProduct: 0.2, extraPaymentGateway: 5, emailAccount: 2.4 }
```

### 🔄 Database Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Firestore Collections                       │
├─────────────────────────────────────────────────────────────────┤
│  👤 User Management                                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ users/          │ │ subscriptions/  │ │ accessibility/  │ │
│  │ • Profiles      │ │ • Plans         │ │ • Settings      │ │
│  │ • Roles         │ │ • Billing       │ │ • Preferences   │ │
│  │ • Languages     │ │ • Proration     │ │ • Voice Nav     │ │
│  │ • Auth Data     │ │ • Features      │ │ • Screen Reader │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                               │
│  💼 Business Operations                                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ leads/          │ │ projects/       │ │ tickets/        │ │
│  │ • Contact Info  │ │ • Client Work   │ │ • Support       │ │
│  │ • Industry      │ │ • Phases        │ │ • Messages      │ │
│  │ • Pipeline      │ │ • Files         │ │ • Attachments   │ │
│  │ • Status        │ │ • Feedback      │ │ • Priority      │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                               │
│  💰 Financial Management                                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ invoices/       │ │ pricing/        │ │ billing/        │ │
│  │ • Billing Info  │ │ • Multi-currency│ │ • Auto-renewal  │ │
│  │ • Status        │ │ • Plans         │ │ • Payment       │ │
│  │ • Automation    │ │ • Add-ons       │ │ • History       │ │
│  │ • Subscriptions │ │ • Dynamic       │ │ • Reminders     │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                               │
│  🌍 Content & Localization                                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ blog/           │ │ translations/   │ │ content/        │ │
│  │ • Posts         │ │ • Multi-language│ │ • Static Pages  │ │
│  │ • Tags          │ │ • Common        │ │ • SEO Data      │ │
│  │ • Translations  │ │ • Pages         │ │ • Meta Tags     │ │
│  │ • SEO           │ │ • Errors        │ │ • Sitemap       │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Relationships                          │
├─────────────────────────────────────────────────────────────────┤
│  🔗 Primary Relationships                                     │
│  users/ ←→ subscriptions/ (One-to-One)                       │
│  users/ ←→ projects/ (One-to-Many)                           │
│  users/ ←→ invoices/ (One-to-Many)                           │
│  users/ ←→ tickets/ (One-to-Many)                            │
│  projects/ ←→ phases/ (One-to-Many)                          │
│  invoices/ ←→ subscriptions/ (One-to-One)                    │
│                                                               │
│  🔍 Query Patterns                                            │
│  ├── Get user's projects (users/{uid}/projects)              │
│  ├── Get user's invoices (users/{uid}/invoices)              │
│  ├── Get leads by status (leads?status=new)                  │
│  ├── Get projects by client (projects?clientId={uid})        │
│  ├── Get pricing by currency (pricing/{currency})            │
│  └── Get translations by language (translations/{language})   │
│                                                               │
│  📊 Indexing Strategy                                         │
│  ├── Composite indexes for complex queries                    │
│  ├── Single-field indexes for simple filters                  │
│  ├── Array indexes for tag-based queries                     │
│  ├── Timestamp indexes for date-based queries                │
│  └── Geospatial indexes for location-based queries           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Security Rules                              │
├─────────────────────────────────────────────────────────────────┤
│  🔐 Access Control                                            │
│  users/ - Users can only access their own data               │
│  projects/ - Clients see their projects, admins see all      │
│  invoices/ - Clients see their invoices, admins see all      │
│  leads/ - Only admins can access lead data                   │
│  pricing/ - Public read access, admin write access           │
│  translations/ - Public read access, admin write access      │
│  blog/ - Public read access, admin write access              │
│                                                               │
│  🛡️ Data Validation                                           │
│  ├── Input sanitization (XSS prevention)                     │
│  ├── Type checking (Data integrity)                          │
│  ├── Size limits (Performance)                               │
│  ├── Rate limiting (Security)                                │
│  └── Audit logging (Compliance)                              │
│                                                               │
│  🔄 Real-time Updates                                         │
│  ├── Client-side listeners for live updates                  │
│  ├── Admin-side listeners for monitoring                     │
│  ├── Offline support with sync                               │
│  └── Conflict resolution strategies                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure (Next.js)

```
/pages
  index.tsx
  about.tsx
  services.tsx
  contact.tsx
  login.tsx
  signup.tsx
  builder.tsx
  blog/[slug].tsx

  /client
    index.tsx
    project.tsx
    chat.tsx
    tickets.tsx
    billing.tsx

  /admin
    index.tsx
    leads.tsx
    clients.tsx
    projects.tsx
    tickets.tsx
    stats.tsx
    pricing.tsx

/components
  Header.tsx
  Footer.tsx
  AuthGuard.tsx
  ProjectCard.tsx
  TicketForm.tsx

/firebase
  firebase.ts
  auth.ts
  db.ts

/utils
  authGuard.ts
  formatDate.ts

/public
  logo.svg
  favicon.ico
```

---

## 🧱 Implementation Notes

### Public Pages

- Use `getStaticProps()` & `getStaticPaths()` for all blog and builder pages.
- **Blog Generation**: At build time, fetch all posts from Firestore and generate static HTML files.
- Ensure SEO compliance: `<title>`, `<meta>`, `<link rel="canonical">`, and structured data.
- **Build Process**: Run local script → Save to Firestore → Build site → Deploy static files.
- **JavaScript Fallback**: All pages must function with JS disabled. Services page shows USD prices by default.
- **Dynamic Pricing**: Load user location via ipapi.co API, update prices based on currency.
- **reCAPTCHA Integration**: Contact, signup, and login forms protected with reCAPTCHA v3.

### Auth-Guarded Routes

- Use Firebase Auth client SDK for session management.
- Wrap routes in `<AuthGuard role="client" />` or `<AuthGuard role="admin" />`.
- **Custom Claims Verification**: Verify admin status using Firebase Auth custom claims.
- **Session Validation**: Check token validity and refresh automatically.
- **Rate Limiting**: Implement client-side rate limiting for API calls.

### Project Builder (`/builder`)

#### 🏗️ Core Features

**Multi-Step Questionnaire System:**

- **Step 1**: Lead Information (Name, Email, Phone, Company)
- **Step 2**: Business Type Selection (Autocomplete with 200+ options)
- **Step 3**: Current Website Status (URL input if applicable)
- **Step 4**: Website Requirements (Static/Dynamic/E-commerce)
- **Step 5**: Content Management Needs
- **Step 6**: User Features Requirements
- **Step 7**: E-commerce Specifics (Product count, Payment methods, Shipping)
- **Step 8**: Page Selection (Checkbox list + Custom pages)
- **Step 9**: Special Features (Blog, Portfolio, Testimonials, etc.)
- **Step 10**: Design Preferences (Style, Colors, Branding)
- **Step 11**: Technical Requirements (Mobile, Performance, Integrations)
- **Step 12**: Timeline & Budget
- **Step 13**: Additional Information & Goals
- **Step 14**: Package Recommendation & Quote Generation

#### 📊 Business Type Autocomplete System

**Categories & Options:**

```javascript
const businessTypes = {
  "Food & Beverage": [
    "Restaurant (Fine Dining, Casual, Fast Food, Food Truck)",
    "Café & Coffee Shop",
    "Bakery & Pastry",
    "Catering Services",
    "Food Delivery & Takeout",
    "Brewery & Distillery",
    "Food Manufacturing",
    "Grocery Store & Market",
  ],
  "Retail & E-commerce": [
    "Online Store",
    "Physical Retail Store",
    "Fashion & Apparel",
    "Electronics & Technology",
    "Home & Garden",
    "Sports & Outdoor",
    "Toys & Games",
    "Jewelry & Accessories",
    "Books & Media",
    "Pet Supplies",
    "Art & Crafts",
  ],
  "Healthcare & Medical": [
    "Medical Practice (General, Specialist)",
    "Dental Practice",
    "Veterinary Clinic",
    "Pharmacy",
    "Medical Equipment",
    "Mental Health Services",
    "Physical Therapy",
    "Alternative Medicine",
    "Medical Research",
    "Healthcare Technology",
  ],
  "Education & Training": [
    "Elementary School",
    "Middle School",
    "High School",
    "College & University",
    "Community College",
    "Technical Institute",
    "Vocational School",
    "Online Education",
    "Training & Certification",
    "Tutoring Services",
    "Language Learning",
    "Skills Development",
    "Corporate Training",
    "Educational Technology",
    "Private School",
    "Charter School",
    "International School",
    "Special Education",
    "Adult Education",
    "Continuing Education",
  ],
  // ... 15+ more categories with 200+ total options
};
```

#### 💰 Dynamic Pricing Integration

**Pricing Data Structure:**

```javascript
// Firestore: pricing/{currency}
{
  "USD": {
    "static": { "setup": 59, "monthly": 5 },
    "dynamic": { "setup": 120, "monthly": 7.2 },
    "ecommerce": { "setup": 180, "monthly": 11 },
    "addons": {
      "extraPage": 3,
      "extraProduct": 0.2,
      "extraPaymentGateway": 5,
      "emailAccount": 2.4,
      "prioritySupport": 10
    }
  },
  "INR": {
    "static": { "setup": 4900, "monthly": 415 },
    "dynamic": { "setup": 10000, "monthly": 600 },
    "ecommerce": { "setup": 15000, "monthly": 915 },
    "addons": {
      "extraPage": 250,
      "extraProduct": 17,
      "extraPaymentGateway": 415,
      "emailAccount": 200,
      "prioritySupport": 830
    }
  }
  // ... 10+ currencies supported
}
```

**Pricing Calculation Algorithm:**

```javascript
const calculateQuote = (requirements, userCurrency) => {
  const pricing = getPricingData(userCurrency);
  let basePackage = determineBasePackage(requirements);
  let setupFee = pricing[basePackage].setup;
  let monthlyFee = pricing[basePackage].monthly;

  // Add-ons calculation
  if (requirements.extraPages > 0) {
    setupFee += requirements.extraPages * pricing.addons.extraPage;
  }

  if (requirements.extraProducts > 30) {
    const extraProducts = requirements.extraProducts - 30;
    setupFee += extraProducts * pricing.addons.extraProduct;
  }

  if (requirements.paymentGateways > 1) {
    const extraGateways = requirements.paymentGateways - 1;
    monthlyFee += extraGateways * pricing.addons.extraPaymentGateway;
  }

  return { setupFee, monthlyFee, basePackage };
};
```

#### 🎯 Package Recommendation Engine

**Decision Matrix:**

```javascript
const recommendPackage = (answers) => {
  const score = {
    static: 0,
    dynamic: 0,
    ecommerce: 0,
  };

  // Primary purpose scoring
  if (answers.primaryPurpose === "static") score.static += 10;
  if (answers.primaryPurpose === "dynamic") score.dynamic += 10;
  if (answers.primaryPurpose === "ecommerce") score.ecommerce += 10;

  // Content management scoring
  if (answers.contentManagement === "static") score.static += 5;
  if (answers.contentManagement === "blog") score.dynamic += 5;
  if (answers.contentManagement === "frequent") score.dynamic += 8;
  if (answers.contentManagement === "full-cms") score.dynamic += 10;

  // User features scoring
  if (answers.userFeatures === "none") score.static += 3;
  if (answers.userFeatures === "customer-accounts") score.ecommerce += 8;
  if (answers.userFeatures === "member-areas") score.dynamic += 8;
  if (answers.userFeatures === "dashboard") score.dynamic += 10;

  // Product count scoring
  if (answers.productCount === 1) score.dynamic += 5;
  if (answers.productCount >= 2 && answers.productCount <= 30)
    score.ecommerce += 8;
  if (answers.productCount > 30) score.ecommerce += 10;

  return Object.keys(score).reduce((a, b) => (score[a] > score[b] ? a : b));
};
```

#### 📱 User Experience Features

**Progress Tracking:**

- Progress bar showing completion percentage
- Step navigation with ability to go back/forward
- Auto-save form data to localStorage
- Form validation with real-time feedback

**Smart Form Logic:**

- Conditional questions (E-commerce questions only show if E-commerce selected)
- Dynamic field requirements based on previous answers
- Auto-populate fields based on business type selection
- Real-time price updates as user makes selections

**Mobile Optimization:**

- Touch-friendly interface
- Swipe navigation between steps
- Responsive design for all screen sizes
- Offline capability with localStorage backup

#### 🔄 Data Flow & Integration

**Lead Capture Process:**

```javascript
const submitProjectBuilder = async (formData) => {
  // 1. Capture user location
  const location = await fetchUserLocation();

  // 2. Calculate pricing
  const quote = calculateQuote(formData, location.currency);

  // 3. Generate lead data
  const leadData = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    company: formData.company,
    industry: formData.businessType,
    source: "project-builder",
    status: "new",
    ipAddress: location.ip,
    country: location.country,
    city: location.city,
    currency: location.currency,
    requirements: formData,
    quote: quote,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };

  // 4. Save to Firestore
  await firebase.firestore().collection("leads").add(leadData);

  // 5. Send notification to admin
  await sendAdminNotification(leadData);

  // 6. Send confirmation email to user
  await sendUserConfirmation(formData.email, quote);
};
```

#### 📊 Analytics & Tracking

**User Behavior Tracking:**

- Time spent on each step
- Drop-off points in the questionnaire
- Most selected business types
- Popular feature combinations
- Conversion rates by industry

**Lead Quality Scoring:**

```javascript
const calculateLeadScore = (leadData) => {
  let score = 0;

  // Budget scoring
  if (leadData.budget === "premium") score += 30;
  if (leadData.budget === "standard") score += 20;
  if (leadData.budget === "basic") score += 10;

  // Timeline scoring
  if (leadData.timeline === "urgent") score += 25;
  if (leadData.timeline === "standard") score += 15;
  if (leadData.timeline === "flexible") score += 10;

  // Industry scoring
  const highValueIndustries = [
    "healthcare",
    "real-estate",
    "professional-services",
  ];
  if (highValueIndustries.includes(leadData.industry)) score += 20;

  // Requirements complexity
  if (leadData.requirements.specialFeatures.length > 5) score += 15;
  if (leadData.requirements.pages.length > 10) score += 10;

  return score;
};
```

#### 🎨 UI/UX Components

**Step Navigation:**

```jsx
const StepNavigation = ({ currentStep, totalSteps, onStepChange }) => (
  <div className="step-navigation">
    <div className="progress-bar">
      <div
        className="progress"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
    <div className="step-indicators">
      {Array.from({ length: totalSteps }, (_, i) => (
        <button
          key={i}
          className={`step ${
            i < currentStep ? "completed" : i === currentStep ? "active" : ""
          }`}
          onClick={() => onStepChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </div>
);
```

**Business Type Autocomplete:**

```jsx
const BusinessTypeAutocomplete = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (input) => {
    const filtered = businessTypes.filter((type) =>
      type.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10));
    setShowDropdown(true);
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Start typing your business type..."
        className="business-type-input"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                onChange(suggestion);
                setShowDropdown(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Real-time Quote Display:**

```jsx
const QuoteDisplay = ({ quote, currency }) => (
  <div className="quote-display">
    <h3>Your Custom Quote</h3>
    <div className="quote-breakdown">
      <div className="package-info">
        <h4>{quote.packageName} Package</h4>
        <p>{quote.packageDescription}</p>
      </div>
      <div className="pricing">
        <div className="setup-fee">
          <span>Setup Fee:</span>
          <span>{formatCurrency(quote.setupFee, currency)}</span>
        </div>
        <div className="monthly-fee">
          <span>Monthly Hosting:</span>
          <span>{formatCurrency(quote.monthlyFee, currency)}</span>
        </div>
        {quote.addons.length > 0 && (
          <div className="addons">
            <h5>Add-ons:</h5>
            {quote.addons.map((addon, index) => (
              <div key={index} className="addon-item">
                <span>{addon.name}</span>
                <span>{formatCurrency(addon.cost, currency)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
```

#### 🔧 Technical Implementation

**Form State Management:**

```javascript
const useProjectBuilderForm = () => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  const updateFormData = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
    // Auto-save to localStorage
    localStorage.setItem("projectBuilderData", JSON.stringify(formData));
  };

  const validateStep = (step, data) => {
    const errors = {};
    // Step-specific validation logic
    return errors;
  };

  return {
    formData,
    currentStep,
    validationErrors,
    updateFormData,
    validateStep,
    setCurrentStep,
  };
};
```

**API Integration:**

```javascript
// Location detection
const detectUserLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      ip: data.ip,
      country: data.country_name,
      city: data.city,
      currency: data.currency,
    };
  } catch (error) {
    return { currency: "USD" }; // Fallback
  }
};

// Pricing data fetch
const fetchPricingData = async (currency) => {
  const doc = await firebase
    .firestore()
    .collection("pricing")
    .doc(currency)
    .get();
  return doc.data();
};
```

#### 📈 Advanced Features

**A/B Testing Framework:**

- Test different question orders
- Experiment with pricing displays
- Optimize conversion rates
- Track user preferences

**Lead Nurturing Integration:**

- Automated follow-up emails
- Personalized content based on industry
- Case study recommendations
- Consultation booking integration

**Competitive Analysis:**

- Compare with DIY solutions
- Highlight unlimited updates advantage
- Show technology stack benefits
- Demonstrate ROI calculations

**Export & Reporting:**

- PDF quote generation
- Detailed requirements document
- Project timeline estimation
- Resource allocation planning

---

## 💳 Secure Payment System

### 🛡️ Payment Security Architecture

**Multi-Layer Security:**

- **Client-side**: Input validation, card masking, reCAPTCHA
- **Server-side**: Payment verification, fraud detection, rate limiting
- **Database**: Encrypted payment data, audit logging
- **Firebase Functions**: Secure payment processing endpoints

**Security Measures:**

```javascript
// Payment security configuration
const paymentSecurity = {
  rateLimit: {
    attempts: 5,
    window: 15 * 60 * 1000, // 15 minutes
    blockDuration: 60 * 60 * 1000, // 1 hour
  },
  validation: {
    requireCaptcha: true,
    validateAmount: true,
    checkCurrency: true,
    verifyUserLocation: true,
  },
  encryption: {
    algorithm: "AES-256-GCM",
    keyRotation: "monthly",
    dataRetention: "7 years",
  },
};
```

### 🔐 Order & Payment Flow

**Step 1: Order Review (`/order`)**

- User selects services and sees total
- Shows setup fees + monthly fees with billing cycle options
- User clicks "Place Order" button

**Step 2: Authentication (`/login` or `/signup`)**

- If user not logged in, redirect to login/signup
- New users can register during checkout
- Existing users login to continue
- After authentication, redirect back to order confirmation

**Step 3: Order Confirmation (`/order/confirm`)**

- Show complete order breakdown with user details
- Display selected services with prices
- Show billing cycle chosen
- Ask for project details (business name, requirements)
- Show final total (setup + monthly fees)
- User clicks "Proceed to Payment"

**Step 4: Payment Processing**

- **PayPal Integration** for instant payments
- **Manual Payment** options (bank transfer, cash, check)
- **Payment verification** and confirmation
- **Order creation** in database

**Step 5: Success Page (`/order/success`)**

- Payment confirmation
- Order number and details
- Next steps and contact information
- Redirect to client portal

### 💰 Payment Methods

**PayPal Integration:**

- **Express Checkout** for instant payments
- **PayPal Buttons** for recurring subscriptions
- **Webhook verification** for payment confirmation
- **Sandbox/Production** environment switching

**Manual Payment Processing:**

- **Bank Transfer** instructions
- **Cash/Check** payment tracking
- **Custom payment** method handling
- **Payment verification** by admin

### 🔧 PayPal Configuration

**PayPal Keys (Replace with your actual keys):**

```json
{
  "paypal": {
    "sandbox": {
      "clientId": "YOUR_SANDBOX_CLIENT_ID",
      "clientSecret": "YOUR_SANDBOX_CLIENT_SECRET",
      "webhookId": "YOUR_SANDBOX_WEBHOOK_ID"
    },
    "production": {
      "clientId": "YOUR_PRODUCTION_CLIENT_ID",
      "clientSecret": "YOUR_PRODUCTION_CLIENT_SECRET",
      "webhookId": "YOUR_PRODUCTION_WEBHOOK_ID"
    },
    "settings": {
      "currency": "USD",
      "mode": "sandbox", // Change to "production" for live
      "brandName": "Website14.com",
      "logoUrl": "https://website14.com/logo.png",
      "returnUrl": "https://website14.com/payment/success",
      "cancelUrl": "https://website14.com/payment/cancel"
    }
  }
}
```

**PayPal Webhook Events:**

```javascript
const paypalWebhooks = {
  "PAYMENT.CAPTURE.COMPLETED": "handlePaymentSuccess",
  "PAYMENT.CAPTURE.DENIED": "handlePaymentFailure",
  "PAYMENT.CAPTURE.PENDING": "handlePaymentPending",
  "BILLING.SUBSCRIPTION.CREATED": "handleSubscriptionCreated",
  "BILLING.SUBSCRIPTION.CANCELLED": "handleSubscriptionCancelled",
  "BILLING.SUBSCRIPTION.SUSPENDED": "handleSubscriptionSuspended",
};
```

### 🛒 Checkout Flow

**Step 1: Order Review**

```jsx
const OrderReview = ({ order, onProceed }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="auth-required">
        <h3>Sign In to Continue</h3>
        <p>Please sign in or create an account to complete your order.</p>
        <div className="auth-options">
          <Link href="/login?redirect=/order/confirm" className="btn-primary">
            Sign In
          </Link>
          <Link
            href="/signup?redirect=/order/confirm"
            className="btn-secondary"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-review">
      <h3>Review Your Order</h3>
      <div className="user-info">
        <h4>Account Information</h4>
        <p>Name: {user.displayName || user.email}</p>
        <p>Email: {user.email}</p>
      </div>
      <div className="order-breakdown">
        <div className="services-selected">
          <h4>Selected Services</h4>
          {order.services.packages.map((service) => (
            <div key={service.id} className="service-item">
              <span>{service.name}</span>
              <span>{formatCurrency(service.setupPrice, order.currency)}</span>
            </div>
          ))}
          {order.services.addons.map((addon) => (
            <div key={addon.id} className="addon-item">
              <span>{addon.name}</span>
              <span>{formatCurrency(addon.price, order.currency)}</span>
            </div>
          ))}
        </div>
        <div className="billing-summary">
          <h4>Billing Summary</h4>
          <div className="setup-total">
            <span>Setup Total:</span>
            <span>
              {formatCurrency(order.billing.setupTotal, order.currency)}
            </span>
          </div>
          <div className="monthly-total">
            <span>Monthly Total:</span>
            <span>
              {formatCurrency(order.billing.monthlyTotal, order.currency)}
            </span>
          </div>
          <div className="billing-cycle">
            <span>Billing Cycle:</span>
            <span>{order.billing.billingCycle}</span>
          </div>
        </div>
      </div>
      <button onClick={onProceed} className="proceed-btn">
        Proceed to Payment
      </button>
    </div>
  );
};
```

**Step 2: Project Details Form**

```jsx
const ProjectDetailsForm = ({ order, onUpdate, onProceed }) => {
  const [projectDetails, setProjectDetails] = useState({
    businessName: "",
    industry: "",
    requirements: "",
    timeline: "standard",
    budget: "standard",
    specialFeatures: [],
    contactPhone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...order, project: projectDetails });
    onProceed();
  };

  return (
    <div className="project-details-form">
      <h3>Project Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="businessName">Business Name *</label>
          <input
            type="text"
            id="businessName"
            value={projectDetails.businessName}
            onChange={(e) =>
              setProjectDetails((prev) => ({
                ...prev,
                businessName: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            value={projectDetails.industry}
            onChange={(e) =>
              setProjectDetails((prev) => ({
                ...prev,
                industry: e.target.value,
              }))
            }
          >
            <option value="">Select Industry</option>
            <option value="restaurant">Restaurant & Food Service</option>
            <option value="retail">Retail & E-commerce</option>
            <option value="healthcare">Healthcare & Medical</option>
            <option value="real-estate">Real Estate</option>
            <option value="professional-services">Professional Services</option>
            <option value="startup">Startup & Technology</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Project Requirements *</label>
          <textarea
            id="requirements"
            value={projectDetails.requirements}
            onChange={(e) =>
              setProjectDetails((prev) => ({
                ...prev,
                requirements: e.target.value,
              }))
            }
            placeholder="Describe your website needs, goals, and any specific features you want..."
            rows={4}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="timeline">Timeline</label>
            <select
              id="timeline"
              value={projectDetails.timeline}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  timeline: e.target.value,
                }))
              }
            >
              <option value="urgent">Urgent (1-2 weeks)</option>
              <option value="standard">Standard (3-4 weeks)</option>
              <option value="flexible">Flexible (1-2 months)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget Range</label>
            <select
              id="budget"
              value={projectDetails.budget}
              onChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  budget: e.target.value,
                }))
              }
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone">Contact Phone</label>
          <input
            type="tel"
            id="contactPhone"
            value={projectDetails.contactPhone}
            onChange={(e) =>
              setProjectDetails((prev) => ({
                ...prev,
                contactPhone: e.target.value,
              }))
            }
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <button type="submit" className="proceed-btn">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};
```

**Step 3: Payment Method Selection**

```jsx
const PaymentMethodSelection = ({ onSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay securely with PayPal",
      icon: "paypal-icon",
      instant: true,
    },
    {
      id: "manual",
      name: "Other Payment Methods",
      description: "Bank transfer, cash, or custom payment",
      icon: "manual-icon",
      instant: false,
    },
  ];

  return (
    <div className="payment-methods">
      <h3>Choose Payment Method</h3>
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`payment-method ${
            selectedMethod === method.id ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedMethod(method.id);
            onSelect(method);
          }}
        >
          <div className="method-icon">
            <i className={method.icon}></i>
          </div>
          <div className="method-details">
            <h4>{method.name}</h4>
            <p>{method.description}</p>
            {method.instant && <span className="instant-badge">Instant</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
```

**Step 3: PayPal Checkout**

```jsx
const PayPalCheckout = ({ quote, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const createPayPalOrder = async () => {
    setLoading(true);
    try {
      // Create order on server
      const order = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: quote.totalSetup,
          currency: quote.currency,
          description: `${quote.packageName} Setup Fee`,
          returnUrl: window.location.origin + "/payment/success",
          cancelUrl: window.location.origin + "/payment/cancel",
        }),
      });

      const orderData = await order.json();

      // Initialize PayPal
      paypal
        .Buttons({
          createOrder: () => orderData.id,
          onApprove: async (data, actions) => {
            const capture = await actions.order.capture();
            await onSuccess(capture);
          },
          onCancel: () => onCancel(),
          onError: (err) => {
            console.error("PayPal Error:", err);
            setLoading(false);
          },
        })
        .render("#paypal-button-container");
    } catch (error) {
      console.error("Order creation failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="paypal-checkout">
      <h3>PayPal Checkout</h3>
      <div className="payment-summary">
        <p>Amount: {formatCurrency(quote.totalSetup, quote.currency)}</p>
        <p>Package: {quote.packageName}</p>
      </div>
      <div id="paypal-button-container"></div>
      {loading && <div className="loading">Processing...</div>}
    </div>
  );
};
```

**Step 4: Manual Payment Instructions**

```jsx
const ManualPayment = ({ order, onComplete }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    method: "",
    reference: "",
    notes: "",
  });

  const handleSubmit = async () => {
    try {
      await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          paymentDetails,
          amount: order.billing.setupTotal,
          currency: order.currency,
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Payment submission failed:", error);
    }
  };

  return (
    <div className="manual-payment">
      <h3>Manual Payment</h3>
      <div className="payment-instructions">
        <h4>Payment Instructions:</h4>
        <p>
          Amount: {formatCurrency(order.billing.setupTotal, order.currency)}
        </p>
        <p>Please contact us to arrange payment:</p>
        <ul>
          <li>Email: payments@website14.com</li>
          <li>Phone: +1-XXX-XXX-XXXX</li>
          <li>We'll contact you within 24 hours</li>
        </ul>
      </div>

      <div className="payment-form">
        <h4>Payment Details (Optional):</h4>
        <select
          value={paymentDetails.method}
          onChange={(e) =>
            setPaymentDetails((prev) => ({
              ...prev,
              method: e.target.value,
            }))
          }
        >
          <option value="">Select Payment Method</option>
          <option value="bank-transfer">Bank Transfer</option>
          <option value="cash">Cash</option>
          <option value="check">Check</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Payment Reference (if any)"
          value={paymentDetails.reference}
          onChange={(e) =>
            setPaymentDetails((prev) => ({
              ...prev,
              reference: e.target.value,
            }))
          }
        />

        <textarea
          placeholder="Additional notes..."
          value={paymentDetails.notes}
          onChange={(e) =>
            setPaymentDetails((prev) => ({
              ...prev,
              notes: e.target.value,
            }))
          }
        />

        <button onClick={handleSubmit} className="submit-payment">
          Submit Payment Details
        </button>
      </div>
    </div>
  );
};
```

**Step 5: Order Success Page**

```jsx
const OrderSuccess = ({ order }) => {
  return (
    <div className="order-success">
      <div className="success-header">
        <div className="success-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for choosing Website14. Your order has been received.</p>
      </div>

      <div className="order-details">
        <h3>Order Details</h3>
        <div className="order-info">
          <div className="info-row">
            <span>Order Number:</span>
            <span>{order.orderNumber}</span>
          </div>
          <div className="info-row">
            <span>Order Date:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="info-row">
            <span>Total Amount:</span>
            <span>
              {formatCurrency(order.billing.setupTotal, order.currency)}
            </span>
          </div>
          <div className="info-row">
            <span>Payment Status:</span>
            <span className={`status ${order.payment.status}`}>
              {order.payment.status}
            </span>
          </div>
        </div>

        <div className="project-info">
          <h4>Project Information</h4>
          <p>
            <strong>Business:</strong> {order.project.businessName}
          </p>
          <p>
            <strong>Industry:</strong> {order.project.industry}
          </p>
          <p>
            <strong>Timeline:</strong> {order.project.timeline}
          </p>
        </div>

        <div className="services-summary">
          <h4>Services Ordered</h4>
          {order.services.packages.map((service) => (
            <div key={service.id} className="service-item">
              <span>{service.name}</span>
              <span>{formatCurrency(service.setupPrice, order.currency)}</span>
            </div>
          ))}
          {order.services.addons.map((addon) => (
            <div key={addon.id} className="addon-item">
              <span>{addon.name}</span>
              <span>{formatCurrency(addon.price, order.currency)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="next-steps">
        <h3>What Happens Next?</h3>
        <div className="steps-timeline">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Project Setup</h4>
              <p>
                We'll contact you within 24 hours to discuss your project
                requirements.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Design Phase</h4>
              <p>
                Our team will create wireframes and mockups for your approval.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Development</h4>
              <p>We'll build your website with unlimited revisions included.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Launch & Support</h4>
              <p>
                Your website goes live with ongoing support and unlimited
                updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-info">
        <h3>Need Help?</h3>
        <p>Our team is here to help you every step of the way.</p>
        <div className="contact-methods">
          <div className="contact-method">
            <i className="icon-email"></i>
            <span>support@website14.com</span>
          </div>
          <div className="contact-method">
            <i className="icon-phone"></i>
            <span>+1-XXX-XXX-XXXX</span>
          </div>
          <div className="contact-method">
            <i className="icon-chat"></i>
            <span>Live Chat Available</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <Link href="/client" className="btn-primary">
          Go to Client Portal
        </Link>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
```

### 🔐 Payment Security Implementation

**Firebase Functions for Payment Processing:**

```javascript
// /functions/payments/paypal.js
const functions = require("firebase-functions");
const paypal = require("@paypal/checkout-server-sdk");

const environment = new paypal.core.SandboxEnvironment(
  functions.config().paypal.client_id,
  functions.config().paypal.client_secret
);
const client = new paypal.core.PayPalHttpClient(environment);

exports.createPayPalOrder = functions.https.onCall(async (data, context) => {
  // Verify user authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  // Rate limiting
  const rateLimit = await checkRateLimit(context.auth.uid, "paypal_order");
  if (!rateLimit.allowed) {
    throw new functions.https.HttpsError(
      "resource-exhausted",
      "Rate limit exceeded"
    );
  }

  // Validate payment data
  const validation = validatePaymentData(data);
  if (!validation.valid) {
    throw new functions.https.HttpsError("invalid-argument", validation.error);
  }

  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: data.currency,
            value: data.amount.toString(),
          },
          description: data.description,
        },
      ],
      application_context: {
        return_url: data.returnUrl,
        cancel_url: data.cancelUrl,
        brand_name: "Website14.com",
      },
    });

    const order = await client.execute(request);

    // Log payment attempt
    await logPaymentAttempt({
      userId: context.auth.uid,
      type: "paypal_order_created",
      amount: data.amount,
      currency: data.currency,
      orderId: order.result.id,
    });

    return { id: order.result.id };
  } catch (error) {
    console.error("PayPal order creation failed:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Payment processing failed"
    );
  }
});

exports.capturePayPalPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const request = new paypal.orders.OrdersCaptureRequest(data.orderId);
    const capture = await client.execute(request);

    if (capture.result.status === "COMPLETED") {
      // Update payment status in Firestore
      await updatePaymentStatus(data.orderId, "completed", {
        transactionId: capture.result.purchase_units[0].payments.captures[0].id,
        amount: capture.result.purchase_units[0].amount.value,
        currency: capture.result.purchase_units[0].amount.currency_code,
      });

      // Create project and send confirmation
      await createProjectFromPayment(context.auth.uid, data.quoteId);
      await sendPaymentConfirmation(context.auth.uid, capture.result);
    }

    return { success: true, capture: capture.result };
  } catch (error) {
    console.error("PayPal capture failed:", error);
    throw new functions.https.HttpsError("internal", "Payment capture failed");
  }
});
```

**Payment Webhook Handler:**

```javascript
// /functions/payments/webhooks.js
exports.paypalWebhook = functions.https.onRequest(async (req, res) => {
  // Verify webhook signature
  const isValid = verifyPayPalWebhook(req);
  if (!isValid) {
    res.status(400).send("Invalid webhook signature");
    return;
  }

  const event = req.body;

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED":
      await handlePaymentCompleted(event);
      break;
    case "PAYMENT.CAPTURE.DENIED":
      await handlePaymentDenied(event);
      break;
    case "BILLING.SUBSCRIPTION.CREATED":
      await handleSubscriptionCreated(event);
      break;
    case "BILLING.SUBSCRIPTION.CANCELLED":
      await handleSubscriptionCancelled(event);
      break;
  }

  res.status(200).send("Webhook processed");
});

const handlePaymentCompleted = async (event) => {
  const payment = event.resource;

  // Update payment status
  await firebase.firestore().collection("payments").doc(payment.id).update({
    status: "completed",
    capturedAt: firebase.firestore.FieldValue.serverTimestamp(),
    transactionId: payment.id,
  });

  // Create project
  const paymentDoc = await firebase
    .firestore()
    .collection("payments")
    .doc(payment.id)
    .get();

  if (paymentDoc.exists) {
    const paymentData = paymentDoc.data();
    await createProjectFromPayment(paymentData.userId, paymentData.quoteId);
  }
};
```

### 📊 Payment Management (Admin)

**Payment Status Tracking:**

```javascript
// Firestore: payments/{paymentId}
{
  "id": "payment_123",
  "userId": "user_456",
  "quoteId": "quote_789",
  "amount": 180,
  "currency": "USD",
  "method": "paypal", // "paypal" | "manual"
  "status": "pending", // "pending" | "completed" | "failed" | "cancelled"
  "transactionId": "PAY-123456789",
  "createdAt": "2024-01-01T00:00:00Z",
  "completedAt": "2024-01-01T00:05:00Z",
  "notes": "Payment received via PayPal",
  "adminNotes": "Project started on 2024-01-02"
}
```

**Admin Payment Management Interface:**

```jsx
const AdminPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const updatePaymentStatus = async (paymentId, status, notes) => {
    try {
      await firebase.firestore().collection("payments").doc(paymentId).update({
        status,
        adminNotes: notes,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Send notification to client
      await sendPaymentStatusUpdate(paymentId, status);
    } catch (error) {
      console.error("Payment status update failed:", error);
    }
  };

  return (
    <div className="admin-payment-management">
      <h3>Payment Management</h3>

      <div className="payment-filters">
        <select onChange={(e) => filterPayments(e.target.value)}>
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="payments-list">
        {payments.map((payment) => (
          <div key={payment.id} className="payment-item">
            <div className="payment-info">
              <h4>Payment #{payment.id}</h4>
              <p>Amount: {formatCurrency(payment.amount, payment.currency)}</p>
              <p>Method: {payment.method}</p>
              <p>Status: {payment.status}</p>
              <p>Date: {formatDate(payment.createdAt)}</p>
            </div>

            <div className="payment-actions">
              {payment.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      updatePaymentStatus(
                        payment.id,
                        "completed",
                        "Payment verified"
                      )
                    }
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() =>
                      updatePaymentStatus(
                        payment.id,
                        "failed",
                        "Payment failed"
                      )
                    }
                  >
                    Mark Failed
                  </button>
                </>
              )}

              <button onClick={() => setSelectedPayment(payment)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onUpdate={updatePaymentStatus}
        />
      )}
    </div>
  );
};
```

### 🔒 Security Best Practices

**Input Validation:**

```javascript
const validatePaymentData = (data) => {
  const errors = [];

  // Amount validation
  if (!data.amount || data.amount <= 0) {
    errors.push("Invalid amount");
  }

  // Currency validation
  const validCurrencies = [
    "USD",
    "INR",
    "CAD",
    "EUR",
    "GBP",
    "SAR",
    "AED",
    "QAR",
    "KWD",
    "BHD",
    "OMR",
  ];
  if (!validCurrencies.includes(data.currency)) {
    errors.push("Invalid currency");
  }

  // Amount limits
  if (data.amount > 10000) {
    errors.push("Amount exceeds maximum limit");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
```

**Rate Limiting:**

```javascript
const checkRateLimit = async (userId, action) => {
  const key = `rate_limit:${userId}:${action}`;
  const attempts = await redis.get(key);

  if (attempts && parseInt(attempts) >= 5) {
    return { allowed: false, remaining: 0 };
  }

  await redis.incr(key);
  await redis.expire(key, 900); // 15 minutes

  return { allowed: true, remaining: 5 - (parseInt(attempts || 0) + 1) };
};
```

**Fraud Detection:**

```javascript
const detectFraud = async (paymentData, userLocation) => {
  const riskFactors = [];

  // Location mismatch
  if (paymentData.ipCountry !== userLocation.country) {
    riskFactors.push("location_mismatch");
  }

  // Unusual amount
  if (paymentData.amount > 5000) {
    riskFactors.push("high_amount");
  }

  // Multiple failed attempts
  const failedAttempts = await getFailedAttempts(paymentData.userId);
  if (failedAttempts > 3) {
    riskFactors.push("multiple_failures");
  }

  return {
    risk: riskFactors.length > 0,
    factors: riskFactors,
    requiresReview: riskFactors.length >= 2,
  };
};
```

### Billing & Pricing Model

- **One-time Setup Fee**: Static ($59), Dynamic ($120), E-commerce ($180)
- **Monthly Hosting + Maintenance**: Static ($5), Dynamic ($7.2), E-commerce ($11)
- **Add-ons**: Extra pages, products, payment gateways, email hosting
- **Unlimited Updates**: Included as long as hosting is active
- **30-day Money-back Guarantee**: Risk reversal for new clients

### Dynamic Pricing System

- **Location Detection**: Use ipapi.co API to determine user's country and currency
- **Supported Currencies**: INR, USD, CAD, EUR, GBP, SAR, AED, QAR, KWD, BHD, OMR
- **Admin Control**: Manage prices for all currencies in admin panel
- **Firestore Storage**: Pricing data stored in `pricing/` collection
- **JavaScript Fallback**: Services page shows USD prices when JS is disabled
- **Dynamic Updates**: Prices update automatically based on user location when JS loads

### Competitive Advantages

- **Unlimited Updates**: No per-change fees, unlike traditional agencies
- **Better Than DIY**: Professional quality at DIY prices
- **Faster Delivery**: Optimized development process
- **Superior Support**: Real human support vs. DIY limitations
- **Technology Edge**: Next.js + Firebase for performance and scalability
- **Custom Features**: Tailored solutions for each industry
- **Risk Reversal**: 30-day guarantee reduces client risk

### Blog Management

- **Local Script**: Server-side script for creating/editing blog posts.
- **Firestore Storage**: All posts stored in `blog/` collection.
- **Build-Time Generation**: Posts converted to static HTML during build process.
- **Static Deployment**: All blog pages served as static files for maximum SEO.
- **Workflow**: Write → Save to Firebase → Build → Deploy static files.

---

## 📱 Progressive Web App (PWA) Features

### 🎯 PWA Core Features

**Service Worker Implementation:**

```javascript
// /public/sw.js
const CACHE_NAME = "website14-v1.0.0";
const urlsToCache = [
  "/",
  "/static/css/main.css",
  "/static/js/main.js",
  "/manifest.json",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

**Web App Manifest:**

```json
{
  "name": "Website14 - Web Development Agency",
  "short_name": "Website14",
  "description": "Professional web development services with unlimited updates",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Project Builder",
      "short_name": "Builder",
      "description": "Start building your website",
      "url": "/builder",
      "icons": [
        {
          "src": "/icons/builder-96x96.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Client Portal",
      "short_name": "Portal",
      "description": "Access your projects",
      "url": "/client",
      "icons": [
        {
          "src": "/icons/portal-96x96.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Contact Us",
      "short_name": "Contact",
      "description": "Get in touch",
      "url": "/contact",
      "icons": [
        {
          "src": "/icons/contact-96x96.png",
          "sizes": "96x96"
        }
      ]
    }
  ],
  "categories": ["business", "productivity", "utilities"],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

### 📱 PWA Installation & Engagement

**Installation Prompt:**

```jsx
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  return showInstallPrompt ? (
    <div className="pwa-install-prompt">
      <div className="prompt-content">
        <h3>Install Website14 App</h3>
        <p>Get quick access to your projects and faster loading times</p>
        <div className="prompt-actions">
          <button onClick={handleInstall} className="install-btn">
            Install App
          </button>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="dismiss-btn"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
```

**Offline Support:**

```jsx
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return !isOnline ? (
    <div className="offline-indicator">
      <span>You're offline. Some features may be limited.</span>
    </div>
  ) : null;
};
```

### 🔔 Push Notifications

**Notification Service:**

```javascript
// /utils/notifications.js
export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const subscribeToNotifications = async (userId) => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Save subscription to Firestore
      await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          pushSubscription: subscription.toJSON(),
          notificationPreferences: {
            projectUpdates: true,
            paymentReminders: true,
            marketing: false,
          },
        });

      return subscription;
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error);
      return null;
    }
  }
  return null;
};

export const sendNotification = async (userId, notification) => {
  try {
    await fetch("/api/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        notification: {
          title: notification.title,
          body: notification.body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/badge-72x72.png",
          data: notification.data,
          actions: notification.actions,
        },
      }),
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};
```

**Firebase Functions for Push Notifications:**

```javascript
// /functions/notifications/send.js
const functions = require("firebase-functions");
const webpush = require("web-push");

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:notifications@website14.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const userDoc = await firebase
      .firestore()
      .collection("users")
      .doc(data.userId)
      .get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data();
    const subscription = userData.pushSubscription;

    if (!subscription) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "No push subscription"
      );
    }

    const payload = JSON.stringify({
      title: data.notification.title,
      body: data.notification.body,
      icon: data.notification.icon,
      badge: data.notification.badge,
      data: data.notification.data,
      actions: data.notification.actions,
    });

    await webpush.sendNotification(subscription, payload);

    // Log notification
    await firebase.firestore().collection("notifications").add({
      userId: data.userId,
      title: data.notification.title,
      body: data.notification.body,
      sentAt: firebase.firestore.FieldValue.serverTimestamp(),
      read: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send notification"
    );
  }
});
```

### 📱 Mobile App Features

**App-like Navigation:**

```jsx
const MobileNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="mobile-nav">
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <i className="icon-home"></i>
          <span>Home</span>
        </button>
        <button
          className={`nav-tab ${activeTab === "services" ? "active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          <i className="icon-services"></i>
          <span>Services</span>
        </button>
        <button
          className={`nav-tab ${activeTab === "builder" ? "active" : ""}`}
          onClick={() => setActiveTab("builder")}
        >
          <i className="icon-builder"></i>
          <span>Builder</span>
        </button>
        <button
          className={`nav-tab ${activeTab === "portal" ? "active" : ""}`}
          onClick={() => setActiveTab("portal")}
        >
          <i className="icon-portal"></i>
          <span>Portal</span>
        </button>
        <button
          className={`nav-tab ${activeTab === "contact" ? "active" : ""}`}
          onClick={() => setActiveTab("contact")}
        >
          <i className="icon-contact"></i>
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
};
```

**Gesture Support:**

```jsx
const useSwipeGesture = (onSwipeLeft, onSwipeRight) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeft();
    }
    if (isRightSwipe) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
```

### 🔄 Background Sync

**Background Sync Implementation:**

```javascript
// Service Worker - Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

const doBackgroundSync = async () => {
  try {
    // Sync offline data
    const offlineData = await getOfflineData();

    for (const data of offlineData) {
      await syncToServer(data);
    }

    // Clear offline data after successful sync
    await clearOfflineData();
  } catch (error) {
    console.error("Background sync failed:", error);
  }
};

// Client-side background sync registration
const registerBackgroundSync = async () => {
  if (
    "serviceWorker" in navigator &&
    "sync" in window.ServiceWorkerRegistration.prototype
  ) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register("background-sync");
  }
};
```

### 📊 PWA Analytics

**PWA Performance Tracking:**

```javascript
// /utils/pwa-analytics.js
export const trackPWAInstall = () => {
  if ("serviceWorker" in navigator) {
    // Track installation
    gtag("event", "pwa_install", {
      event_category: "engagement",
      event_label: "pwa_installation",
    });
  }
};

export const trackOfflineUsage = () => {
  if (!navigator.onLine) {
    gtag("event", "offline_usage", {
      event_category: "engagement",
      event_label: "offline_mode",
    });
  }
};

export const trackAppLaunch = () => {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    gtag("event", "app_launch", {
      event_category: "engagement",
      event_label: "standalone_mode",
    });
  }
};
```

### 🎨 PWA UI Enhancements

**Splash Screen:**

```css
/* splash-screen.css */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeOut 0.5s ease-in-out 2s forwards;
}

.splash-logo {
  width: 120px;
  height: 120px;
  animation: pulse 2s infinite;
}

.splash-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  animation: slideUp 0.5s ease-out 0.5s both;
}

@keyframes fadeOut {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**App-like Loading States:**

```jsx
const AppLoadingSpinner = () => (
  <div className="app-loading">
    <div className="loading-spinner">
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
    <p>Loading...</p>
  </div>
);
```

### 🔧 PWA Configuration

**Next.js PWA Configuration:**

```javascript
// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "firebase-storage-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
  ],
});

module.exports = withPWA({
  // ... other Next.js config
});
```

### 📱 PWA Benefits

**User Experience:**

- **App-like Interface** with native navigation
- **Offline Functionality** for core features
- **Fast Loading** with service worker caching
- **Push Notifications** for engagement
- **Install Prompt** for easy app installation

**Business Benefits:**

- **Increased Engagement** through app-like experience
- **Better Mobile Performance** with optimized caching
- **Higher Conversion Rates** with offline capabilities
- **Reduced Bounce Rate** with faster loading
- **Enhanced Brand Presence** with app installation

**Technical Advantages:**

- **SEO Benefits** with improved Core Web Vitals
- **Reduced Server Load** with intelligent caching
- **Better User Retention** with offline support
- **Cross-platform Compatibility** (iOS, Android, Desktop)

### Lead Generation & Sales

- **Cold Calling Pipeline**: Track prospects, follow-ups, conversions in admin portal.
- **Industry Segmentation**: Filter leads by restaurant, retail, healthcare, real estate, etc.
- **Lead Capture**: Website forms and project builder save to Firestore for follow-up.
- **Location Intelligence**: Track IP, country, city, currency for targeted follow-up.
- **Project Builder Leads**: Comprehensive questionnaire generates qualified leads with detailed requirements.
- **Consultation Booking**: Calendar integration for sales calls.
- **Proposal Generation**: Automated proposals based on project requirements and industry.
- **Follow-up Automation**: Email reminders for lead nurturing.
- **Portfolio Showcase**: Industry-specific case studies and examples.
- **Competitive Messaging**: Highlight unlimited updates, better than DIY, faster delivery.
- **Risk Reversal**: Emphasize 30-day guarantee in sales conversations.

---

## ✅ Success Criteria

| Metric               | Target                                          |
| -------------------- | ----------------------------------------------- |
| Initial Load Time    | < 1.0 seconds                                   |
| Lighthouse SEO Score | ≥ 60                                            |
| Auth Flow            | Fully client-side, secure                       |
| Admin Access         | Hidden, role-locked                             |
| Project Lifecycle    | Setup fee → Monthly hosting → Unlimited updates |

---

## 🔒 Security Considerations

### Rate Limiting

- **Firebase Functions**: Implement rate limiting for API endpoints
- **Contact Forms**: Limit submissions per IP address (max 5/hour)
- **Login Attempts**: Block after 5 failed attempts for 15 minutes
- **reCAPTCHA**: Server-side verification for all form submissions

### Firestore Security Rules

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Clients can only access their own projects
match /projects/{projectId} {
  allow read, write: if request.auth != null &&
    (resource.data.clientId == request.auth.uid ||
     get(/databases/$(database.name)/documents/users/$(request.auth.uid)).data.role == 'admin');
}

// Leads only accessible by admins
match /leads/{leadId} {
  allow read, write: if request.auth != null &&
    get(/databases/$(database.name)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Pricing data read-only for public, full access for admins
match /pricing/{currency} {
  allow read: if true;
  allow write: if request.auth != null &&
    get(/databases/$(database.name)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

### Session Management

- **Token Expiration**: Firebase Auth tokens expire after 1 hour
- **Auto Refresh**: Implement automatic token refresh before expiration
- **Session Persistence**: Use Firebase Auth persistence for seamless UX
- **Logout Cleanup**: Clear all session data on logout

### Admin Access Control

- **Custom Claims**: Use Firebase Auth custom claims for admin roles
- **Server-Side Verification**: Verify admin status on Firebase Functions
- **Role Inheritance**: Admin role grants access to all client data
- **Audit Logging**: Log all admin actions for security monitoring

### Data Protection

- **Input Validation**: Sanitize all user inputs before Firestore storage
- **XSS Prevention**: Use React's built-in XSS protection
- **CSRF Protection**: Implement CSRF tokens for form submissions
- **Content Security Policy**: Set strict CSP headers for public pages

---

## 🚀 Optional Features

- Firebase Cloud Functions:
  - Auto-send email on ticket reply
  - Auto-generate invoice reminders
  - Lead follow-up automation
  - Proposal generation emails
- Real-time updates using Firestore listeners
- Offline caching for client dashboard

---

## 📅 Implementation Phases

### Phase 1: Public Website (2-3 weeks)

- **Home page** (`/`) - Match old_site/index.html design exactly
- **Services page** (`/services`) - Match old_site/services.html design exactly
- **About page** (`/about`) - Match old_site/about.html design exactly
- **FAQ page** (`/faq`) - Match old_site/faq.html design exactly
- **Contact page** (`/contact`) - Match old_site/contact.html design exactly
- **Project Builder** (`/builder`) - Comprehensive questionnaire with lead capture and location tracking
- **Lead capture forms** with Firebase integration and reCAPTCHA
- **Dynamic pricing system** with location detection
- **JavaScript fallback** for all pages (works without JS)
- **reCAPTCHA integration** on contact, signup, and login forms
- **SEO optimization** and static generation
- **Deploy to Firebase Hosting**

### Phase 2: Client Portal (3-4 weeks)

- **Authentication system** (Firebase Auth with reCAPTCHA)
- **Security implementation** (Firestore rules, rate limiting, session management)
- **Client dashboard** (`/client`)
- **Project management** with phase tracking
- **Communication system** (real-time chat)
- **Support tickets** system
- **Billing portal** with invoice tracking
- **File upload** and sharing capabilities

### Phase 3: Admin Portal (2-3 weeks)

- **Admin dashboard** (`/admin`)
- **Custom claims setup** for admin role verification
- **Lead management** with cold calling pipeline
- **Client management** system
- **Project oversight** and updates
- **Ticket management** for support
- **Pricing management** for all currencies
- **Analytics** and performance metrics
- **Sales pipeline** tracking
- **Audit logging** for security monitoring

### Phase 4: Advanced Features (2-3 weeks)

- **Blog system** with build-time generation
- **Project builder** wizard form
- **Advanced analytics** and reporting
- **Cloud Functions** automation
- **Real-time notifications**
- **Performance optimizations**

### Design Requirements

- **Public pages must exactly match** old_site folder design
- **Preserve all styling, layout, and content** from original pages
- **Convert to Next.js** while maintaining identical appearance
- **Keep all interactive elements** and functionality
