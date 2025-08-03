# Firebase Datastore Documentation

## Current Collections

### leads Collection

**Purpose**: Stores contact form submissions and lead information from authenticated users via the website contact page with comprehensive validation, background data collection, and reCAPTCHA v3 protection.

**Collection Path**: `leads/{leadId}`

**Fields**:

**User Input Fields**:

- `name` (string) - User's full name (validated for first and last name)
- `phone` (string) - User's phone number (validated for proper format)
- `email` (string) - User's email address (validated and checked against disposable domains)
- `message` (string) - User's inquiry or project description (validated for length and content)

**System Fields**:

- `timestamp` (timestamp) - Server timestamp when the lead was created
- `status` (string) - Lead status (default: 'new')
- `source` (string) - Source of the lead (default: 'website-form')
- `recaptchaToken` (string) - reCAPTCHA v3 token for security verification

**Authentication Fields**:

- `userId` (string) - Firebase Auth user ID
- `userEmail` (string) - Firebase Auth user email
- `authenticatedUser` (object) - Complete authenticated user data including uid, email, and displayName

**Background Data Fields** (collected automatically):

- `ipAddress` (string) - User's IP address
- `country` (string) - User's country
- `city` (string) - User's city
- `region` (string) - User's region/state
- `currency` (string) - User's local currency
- `timezone` (string) - User's timezone
- `userAgent` (string) - Browser and device information
- `language` (string) - User's browser language
- `platform` (string) - User's operating system
- `screenResolution` (string) - User's screen resolution

**Example Document**:

```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "email": "john.smith@example.com",
  "message": "I need a website for my restaurant business with online ordering system",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "new",
  "source": "website-form",
  "recaptchaToken": "03AGdBq27...",
  "userId": "user123456789",
  "userEmail": "john.smith@example.com",
  "authenticatedUser": {
    "uid": "user123456789",
    "email": "john.smith@example.com",
    "displayName": "John Smith"
  },
  "ipAddress": "192.168.1.1",
  "country": "United States",
  "city": "New York",
  "region": "New York",
  "currency": "USD",
  "timezone": "America/New_York",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "language": "en-US",
  "platform": "Win32",
  "screenResolution": "1920x1080"
}
```

**Validation Rules**:

**Name Validation**:

- Must contain both first and last name
- Only letters, spaces, hyphens, and apostrophes allowed
- Each name part must be at least 2 characters long

**Phone Validation**:

- Minimum 7 digits, maximum 15 digits
- Must contain at least 3 unique digits (prevents repeated numbers)
- Accepts international formats with country codes

**Email Validation**:

- Comprehensive email format validation
- Blocks common disposable email domains
- Ensures valid domain structure

**Message Validation**:

- Minimum 10 characters for meaningful content
- Maximum 1000 characters to prevent spam
- Must contain actual text content

**Security Features**:

- **Authentication Required**: Only authenticated users can submit contact forms
- **reCAPTCHA v3**: Invisible bot protection with action-based scoring
- **Token Verification**: Each submission includes a reCAPTCHA token
- **Background Validation**: Server-side token verification recommended
- **User Tracking**: All submissions are linked to authenticated user accounts

**Usage**:

- Contact form submissions are automatically saved to this collection
- Each submission creates a new document with a unique ID
- Only authenticated users can access the contact form
- Used for lead tracking and follow-up by the admin team
- Status field allows for pipeline management (new → contacted → qualified → closed)
- Source field helps identify where the lead came from for analytics
- Background data helps with lead qualification and geographic targeting
- reCAPTCHA token provides security against automated spam submissions
- User authentication data helps with lead qualification and user tracking

### quotes Collection

**Purpose**: Stores detailed quote information from the project builder, including all form data, package recommendations, pricing calculations, and user requirements.

**Collection Path**: `quotes/{quoteId}`

**Fields**:

**User Information**:

- `userId` (string) - Firebase Auth user ID
- `userEmail` (string) - User's email address
- `leadId` (string) - Reference to the associated lead document

**Quote Data**:

- `formData` (object) - Complete project builder form data including all 8 sections:

  - Business information and type
  - Website requirements and features
  - E-commerce specifications
  - Content and design preferences
  - Technical requirements
  - Timeline and budget
  - Additional information and goals

- `recommendedPackage` (string) - Package recommendation (static/dynamic/ecommerce)
- `totalPoints` (number) - Scoring points from the questionnaire
- `quote` (object) - Calculated pricing information:
  - `package` (string) - Package type
  - `setupFee` (number) - One-time setup fee
  - `monthlyFee` (number) - Monthly hosting fee
  - `currency` (string) - User's local currency
  - `addons` (array) - Additional features and their costs
  - `createdAt` (timestamp) - Quote creation timestamp

**Timestamps**:

- `createdAt` (timestamp) - When the quote was created
- `updatedAt` (timestamp) - Last modification timestamp

**Example Document**:

```json
{
  "userId": "user123456789",
  "userEmail": "john.smith@example.com",
  "leadId": "lead_abc123",
  "formData": {
    "businessType": "Restaurant & Food Service",
    "currentWebsite": "Yes, but it's outdated",
    "primaryPurpose": "Dynamic Website - Content management, blog, user accounts",
    "contentManagement": "Yes, I need full content management system",
    "userFeatures": "Yes, user dashboard and profiles",
    "productCount": "50",
    "paymentMethods": ["PayPal", "Credit/Debit Cards (Stripe)"],
    "pages": ["Home Page", "About Us", "Services/Products", "Blog/News"],
    "designStyle": "Modern & Minimal - Clean, simple design",
    "mobileOptimization": "Essential - Most of my customers use mobile",
    "timeline": "Standard - 3-4 weeks",
    "budget": "Premium - Advanced features and custom design"
  },
  "recommendedPackage": "dynamic",
  "totalPoints": 8,
  "quote": {
    "package": "dynamic",
    "setupFee": 120,
    "monthlyFee": 7.2,
    "currency": "USD",
    "addons": [
      {
        "name": "3 Extra Pages",
        "cost": 9,
        "recurring": false
      },
      {
        "name": "2 Extra Payment Gateways",
        "cost": 10,
        "recurring": true
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Created when users complete the project builder questionnaire
- Used for generating detailed quotes and proposals
- Referenced in client portal for project management
- Contains all requirements for project execution
- Used for billing and payment tracking
- Supports multiple currencies and dynamic pricing

### tickets Collection

**Purpose**: Stores support tickets created by clients for technical issues, billing questions, feature requests, and general support inquiries.

**Collection Path**: `tickets/{ticketId}`

**Fields**:

**Ticket Information**:

- `subject` (string) - Brief description of the issue
- `message` (string) - Detailed description of the problem or request
- `category` (string) - Ticket category (general/technical/billing/feature)
- `priority` (string) - Priority level (low/medium/high)
- `status` (string) - Ticket status (open/in-progress/resolved/closed)

**User Information**:

- `userId` (string) - Firebase Auth user ID
- `userEmail` (string) - User's email address

**Timestamps**:

- `createdAt` (timestamp) - When the ticket was created
- `updatedAt` (timestamp) - Last modification timestamp

**Example Document**:

```json
{
  "subject": "Website loading slowly",
  "message": "My website has been loading very slowly for the past few days. Pages take 10-15 seconds to load. This is affecting my business as customers are leaving before the site loads.",
  "category": "technical",
  "priority": "high",
  "status": "open",
  "userId": "user123456789",
  "userEmail": "john.smith@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Categories**:

- `general` - General support questions
- `technical` - Technical issues and bugs
- `billing` - Billing and payment questions
- `feature` - Feature requests and enhancements

**Priorities**:

- `low` - Minor issues, non-urgent
- `medium` - Standard issues, normal priority
- `high` - Urgent issues affecting business

**Statuses**:

- `open` - New ticket, not yet addressed
- `in-progress` - Being worked on by support team
- `resolved` - Issue resolved, waiting for confirmation
- `closed` - Ticket closed and resolved

**Usage**:

- Created through the client portal support system
- Used for tracking support requests and issues
- Enables communication between clients and support team
- Supports categorization and prioritization
- Provides audit trail for support interactions

### users Collection

**Purpose**: Stores user profile information and authentication data for both clients and administrators.

**Collection Path**: `users/{userId}`

**Fields**:

**Profile Information**:

- `name` (string) - User's full name
- `email` (string) - User's email address
- `role` (string) - User role (client/admin)

**Authentication Data**:

- `uid` (string) - Firebase Auth user ID
- `emailVerified` (boolean) - Whether email is verified
- `displayName` (string) - Display name from Firebase Auth

**Timestamps**:

- `createdAt` (timestamp) - Account creation timestamp
- `updatedAt` (timestamp) - Last profile update timestamp

**Example Document**:

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "client",
  "uid": "user123456789",
  "emailVerified": true,
  "displayName": "John Smith",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Roles**:

- `client` - Regular user with access to client portal
- `admin` - Administrator with access to admin portal

**Usage**:

- Created when users register for an account
- Used for authentication and authorization
- Controls access to different portal features
- Stores user preferences and profile data
- Enables role-based access control

### pricing Collection

**Purpose**: Stores dynamic pricing data for different currencies and packages, managed through the admin dashboard.

**Collection Path**: `pricing/{currency}`

**Fields**:

**Package Setup Fees**:

- `staticSetup` (number) - One-time setup fee for static websites
- `dynamicSetup` (number) - One-time setup fee for dynamic websites
- `ecommerceSetup` (number) - One-time setup fee for e-commerce websites

**Package Monthly Fees**:

- `staticMonthly` (number) - Monthly hosting fee for static websites
- `dynamicMonthly` (number) - Monthly hosting fee for dynamic websites
- `ecommerceMonthly` (number) - Monthly hosting fee for e-commerce websites

**Add-on Pricing**:

- `extraPage` (number) - Cost per additional page
- `extraProduct` (number) - Cost per additional product (e-commerce)
- `paymentGateway` (number) - Cost per additional payment gateway
- `emailAccount` (number) - Cost per email account

**Additional Features**:

- `contactForms` (number) - Cost for contact forms feature
- `newsletterSignup` (number) - Cost for newsletter signup feature
- `socialMediaIntegration` (number) - Cost for social media integration
- `googleMapsIntegration` (number) - Cost for Google Maps integration
- `bookingAppointmentSystem` (number) - Cost for booking/appointment system
- `liveChat` (number) - Cost for live chat feature
- `multiLanguageSupport` (number) - Cost for multi-language support
- `searchFunctionality` (number) - Cost for search functionality
- `imageGallery` (number) - Cost for image gallery feature
- `videoIntegration` (number) - Cost for video integration

**Discount Percentages**:

- `yearlyDiscount` (number) - Discount percentage for yearly billing
- `twoYearDiscount` (number) - Discount percentage for 2-year billing
- `threeYearDiscount` (number) - Discount percentage for 3-year billing

**System Fields**:

- `currency` (string) - Currency code (USD, EUR, GBP, etc.)
- `lastUpdated` (timestamp) - Last update timestamp

**Supported Currencies**:

- `USD` - US Dollar
- `EUR` - Euro
- `GBP` - British Pound
- `CAD` - Canadian Dollar
- `INR` - Indian Rupee
- `SAR` - Saudi Riyal
- `AED` - UAE Dirham
- `QAR` - Qatari Riyal
- `KWD` - Kuwaiti Dinar
- `BHD` - Bahraini Dinar
- `OMR` - Omani Rial

**Example Document (USD)**:

```json
{
  "staticSetup": 59,
  "staticMonthly": 5,
  "dynamicSetup": 120,
  "dynamicMonthly": 7.2,
  "ecommerceSetup": 180,
  "ecommerceMonthly": 11,
  "extraPage": 3,
  "extraProduct": 0.2,
  "paymentGateway": 5,
  "emailAccount": 2.4,
  "contactForms": 2,
  "newsletterSignup": 2.5,
  "socialMediaIntegration": 4,
  "googleMapsIntegration": 3,
  "bookingAppointmentSystem": 10,
  "liveChat": 5,
  "multiLanguageSupport": 8,
  "searchFunctionality": 2.5,
  "imageGallery": 2,
  "videoIntegration": 4,
  "yearlyDiscount": 10,
  "twoYearDiscount": 15,
  "threeYearDiscount": 20,
  "currency": "USD",
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Managed through admin dashboard pricing tab
- Used by services page for dynamic pricing display
- Used by order page for real-time pricing calculations
- Used by project builder for quote generation
- Supports multi-currency pricing
- Enables dynamic pricing updates without code changes

### blog Collection

**Purpose**: Stores blog posts for the website's content marketing and SEO purposes.

**Collection Path**: `blog/{postId}`

**Fields**:

**Content Information**:

- `title` (string) - Blog post title
- `slug` (string) - URL-friendly slug for the post
- `excerpt` (string) - Short description/summary of the post
- `content` (string) - Full blog post content (markdown supported)
- `tags` (array) - Array of tags for categorization
- `status` (string) - Post status (draft/published)

**SEO and Metadata**:

- `metaDescription` (string) - Meta description for SEO
- `metaKeywords` (string) - Meta keywords for SEO
- `featuredImage` (string) - URL to featured image
- `author` (string) - Author name

**Timestamps**:

- `createdAt` (timestamp) - When the post was created
- `updatedAt` (timestamp) - Last modification timestamp
- `publishedAt` (timestamp) - When the post was published

**Example Document**:

```json
{
  "title": "10 Essential Features Every Business Website Needs",
  "slug": "10-essential-features-business-website",
  "excerpt": "Discover the must-have features that will make your business website stand out and convert visitors into customers.",
  "content": "# 10 Essential Features Every Business Website Needs\n\nIn today's digital world...",
  "tags": ["web-design", "business", "features", "conversion"],
  "status": "published",
  "metaDescription": "Learn about the 10 essential features every business website needs to succeed online and convert visitors into customers.",
  "metaKeywords": "business website, web design, features, conversion, online business",
  "featuredImage": "https://website14.com/images/essential-features.jpg",
  "author": "Website14 Team",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "publishedAt": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Managed through admin dashboard blog tab
- Used for content marketing and SEO
- Supports static generation for better performance
- Enables blog post creation and editing
- Provides search and filtering functionality

### projects Collection

**Purpose**: Stores project information for client projects and project management.

**Collection Path**: `projects/{projectId}`

**Fields**:

**Project Information**:

- `title` (string) - Project title
- `status` (string) - Project status (active/completed/on-hold)
- `clientId` (string) - Reference to client user
- `orderId` (string) - Reference to associated order

**Project Details**:

- `industry` (string) - Industry type (restaurant/retail/healthcare/etc.)
- `requirements` (string) - Project requirements and specifications
- `timeline` (string) - Project timeline
- `budget` (string) - Project budget range

**Quote Information**:

- `quote` (object) - Associated quote data:
  - `finalPrice` (number) - Final project price
  - `currency` (string) - Currency code
  - `package` (string) - Package type

**Timestamps**:

- `timestamp` (timestamp) - Project creation timestamp
- `lastUpdate` (timestamp) - Last update timestamp

**Example Document**:

```json
{
  "title": "Restaurant Website with Online Ordering",
  "status": "active",
  "clientId": "user123456789",
  "orderId": "order_abc123",
  "industry": "restaurant",
  "requirements": "Modern restaurant website with online ordering system, menu management, and payment processing",
  "timeline": "3-4 weeks",
  "budget": "Premium",
  "quote": {
    "finalPrice": 1200,
    "currency": "USD",
    "package": "dynamic"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "lastUpdate": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Used for project management and tracking
- Referenced in admin dashboard for project oversight
- Used in client portal for project status
- Enables project lifecycle management

## Planned Collections (Future Implementation)

### orders Collection

**Purpose**: Will store order information for the new order flow.

**Collection Path**: `orders/{orderId}`

**Planned Fields**:

- `userId` (string) - Firebase Auth user ID
- `orderNumber` (string) - Unique order number
- `status` (string) - Order status (pending/paid/processing/completed/cancelled)
- `services` (object) - Selected services and packages
- `billing` (object) - Billing information and totals
- `project` (object) - Project details and requirements
- `payment` (object) - Payment method and status
- `createdAt` (timestamp) - Order creation timestamp
- `updatedAt` (timestamp) - Last update timestamp

### payments Collection

**Purpose**: Will store payment records for orders.

**Collection Path**: `payments/{paymentId}`

**Planned Fields**:

- `orderId` (string) - Reference to associated order
- `userId` (string) - Firebase Auth user ID
- `amount` (number) - Payment amount
- `currency` (string) - Currency code
- `method` (string) - Payment method (paypal/manual/bank-transfer/cash/check)
- `status` (string) - Payment status (pending/completed/failed/cancelled)
- `transactionId` (string) - External transaction ID
- `createdAt` (timestamp) - Payment creation timestamp
- `completedAt` (timestamp) - Payment completion timestamp
- `notes` (string) - Additional payment notes

### invoices Collection

**Purpose**: Will store invoice information for billing.

**Collection Path**: `invoices/{invoiceId}`

**Planned Fields**:

- `clientId` (string) - Reference to client
- `amount` (number) - Invoice amount
- `status` (string) - Invoice status
- `date` (timestamp) - Invoice date
- `paymentMethod` (string) - Payment method
- `dueDate` (timestamp) - Payment due date
- `items` (array) - Invoice line items
- `billingType` (string) - Billing type (setup/monthly/addon)
- `planType` (string) - Plan type (static/dynamic/ecommerce)
- `addons` (object) - Additional services

## Security Rules

**Access Control**:

- **leads**: Only authenticated users can create, admins can read/write all
- **quotes**: Users can read their own quotes, admins can read/write all
- **tickets**: Users can read/create their own tickets, admins can read/write all
- **users**: Users can read/write their own data, admins can read all
- **pricing**: Read-only for all authenticated users, write access for admins only
- **blog**: Read access for all users, write access for admins only
- **projects**: Users can read their own projects, admins can read/write all

**Authentication Requirements**:

- All collections require authentication for access
- User data is isolated to prevent unauthorized access
- Admin access is controlled through role verification
- Default deny-all policy for security

## Data Relationships

**Primary Relationships**:

- `users` ←→ `quotes` (One-to-Many)
- `users` ←→ `leads` (One-to-Many)
- `users` ←→ `tickets` (One-to-Many)
- `users` ←→ `projects` (One-to-Many)
- `leads` ←→ `quotes` (One-to-One)
- `orders` ←→ `payments` (One-to-Many) [Future]
- `orders` ←→ `projects` (One-to-One) [Future]

**Query Patterns**:

- Get user's quotes: `quotes?userId={uid}`
- Get user's leads: `leads?userId={uid}`
- Get user's tickets: `tickets?userId={uid}`
- Get user's projects: `projects?clientId={uid}`
- Get leads by status: `leads?status=new`
- Get pricing by currency: `pricing/{currency}`
- Get published blog posts: `blog?status=published`

## Indexing Strategy

**Required Indexes**:

- `quotes` collection: `userId` + `createdAt` (composite)
- `leads` collection: `userId` + `createdAt` (composite)
- `tickets` collection: `userId` + `createdAt` (composite)
- `leads` collection: `status` + `createdAt` (composite)
- `blog` collection: `status` + `publishedAt` (composite)
- `projects` collection: `clientId` + `timestamp` (composite)

**Performance Considerations**:

- All queries use indexed fields for optimal performance
- Composite indexes support complex filtering and sorting
- Timestamp-based queries for chronological ordering
- User-specific queries for data isolation
- Blog posts use static generation for better performance
