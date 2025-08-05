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

- `timestamp` (timestamp) - Server timestamp when the lead was created (using serverTimestamp())
- `status` (string) - Lead status (default: 'new')
- `source` (string) - Source of the lead (default: 'website-form' or 'project-builder')
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

**Project Builder Specific Fields** (when source is 'project-builder'):

- `businessType` (string) - Type of business
- `industry` (string) - Industry classification
- `recommendedPackage` (string) - Package recommendation (static/dynamic/ecommerce)
- `recommendedAddons` (array) - Recommended add-ons
- `confidenceScore` (number) - Confidence score for recommendation

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

- `formData` (object) - Complete project builder form data including all sections:

  - Business information and type
  - Website requirements and features
  - E-commerce specifications
  - Content and design preferences
  - Technical requirements
  - Timeline and budget
  - Additional information and goals

- `recommendedPackage` (string) - Package recommendation (static/dynamic/ecommerce)
- `recommendedAddons` (array) - Recommended add-ons
- `confidenceScore` (number) - Confidence score for recommendation
- `totalPoints` (number) - Scoring points from the questionnaire
- `quote` (object) - Calculated pricing information:
  - `package` (string) - Package type
  - `setupFee` (number) - One-time setup fee
  - `monthlyFee` (number) - Monthly hosting fee
  - `currency` (string) - User's local currency
  - `addons` (array) - Additional features and their costs
  - `createdAt` (timestamp) - Quote creation timestamp

**Timestamps**:

- `createdAt` (timestamp) - When the quote was created (using new Date())

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
  "recommendedAddons": ["Logo Design", "Live Chat"],
  "confidenceScore": 100,
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
  "createdAt": "2024-01-15T10:30:00Z"
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

- `createdAt` (timestamp) - When the ticket was created (using serverTimestamp())
- `updatedAt` (timestamp) - Last modification timestamp (using serverTimestamp())

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
- Referenced by ticketResponses collection for threaded conversations

### ticketResponses Collection

**Purpose**: Stores responses and replies to support tickets, enabling threaded conversations between clients and support team.

**Collection Path**: `ticketResponses/{responseId}`

**Fields**:

**Response Information**:

- `ticketId` (string) - Reference to the parent ticket document
- `message` (string) - Response message content
- `isAdmin` (boolean) - Whether the response is from admin/support team (false for client responses)

**User Information**:

- `userId` (string) - Firebase Auth user ID of the responder
- `userEmail` (string) - User's email address

**Timestamps**:

- `createdAt` (timestamp) - When the response was created (using serverTimestamp())

**Example Document**:

```json
{
  "ticketId": "ticket_abc123",
  "message": "Thank you for reporting this issue. We have identified the problem and are working on a fix. We'll update you once it's resolved.",
  "isAdmin": true,
  "userId": "admin123456789",
  "userEmail": "support@website14.com",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Created when users or admins respond to support tickets
- Used for threaded ticket conversations
- Enables real-time communication between clients and support team
- Provides complete conversation history for each ticket
- Supports both client and admin responses

### users Collection

**Purpose**: Stores user profile information and authentication data for both clients and administrators.

**Collection Path**: `users/{userId}`

**Fields**:

**Profile Information**:

- `name` (string) - User's full name
- `firstName` (string) - User's first name (parsed from displayName or email)
- `lastName` (string) - User's last name (parsed from displayName or email)
- `email` (string) - User's email address
- `secondaryEmail` (string) - User's secondary email address
- `businessName` (string) - User's business name
- `phoneNo` (string) - User's phone number
- `whatsapp` (string) - User's WhatsApp number
- `telegram` (string) - User's Telegram username
- `discord` (string) - User's Discord username
- `billingAddress` (string) - User's billing address
- `role` (string) - User role (client/admin)
- `status` (string) - User status (active/inactive)

**Authentication Data**:

- `uid` (string) - Firebase Auth user ID (document ID)
- `emailVerified` (boolean) - Whether email is verified (from Firebase Auth)
- `displayName` (string) - Display name from Firebase Auth

**Timestamps**:

- `createdAt` (timestamp) - Account creation timestamp (using new Date())
- `updatedAt` (timestamp) - Last update timestamp (using new Date())

**Example Document**:

```json
{
  "name": "John Smith",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "secondaryEmail": "john.business@example.com",
  "businessName": "Smith's Restaurant",
  "phoneNo": "+1234567890",
  "whatsapp": "+1234567890",
  "telegram": "johnsmith",
  "discord": "johnsmith#1234",
  "billingAddress": "123 Main St, New York, NY 10001",
  "role": "client",
  "status": "active",
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

**Statuses**:

- `active` - User account is active and can access the system
- `inactive` - User account is suspended or deactivated

**Usage**:

- Created when users register for an account
- Used for authentication and authorization
- Controls access to different portal features
- Stores user preferences and profile data
- Enables role-based access control
- Profile section in client portal allows users to update contact information
- First name, last name, and email are pre-filled from Firebase Auth and cannot be edited
- Additional contact fields (secondary email, business name, phone, social media, billing address) are editable
- firstName and lastName fields are added during login if user document exists but these fields are missing

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
- `extraPaymentGateway` (number) - Cost per additional payment gateway
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
- `logoDesign` (number) - Cost for logo design service

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
  "extraPaymentGateway": 5,
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
  "logoDesign": 15,
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
- `slug` (string) - URL-friendly slug for the post (auto-generated from title)
- `excerpt` (string) - Short description/summary of the post
- `content` (string) - Full blog post content (markdown supported)
- `tags` (array) - Array of tags for categorization
- `status` (string) - Post status (draft/published)

**SEO and Metadata**:

- `seo` (object) - SEO metadata:
  - `metaTitle` (string) - Meta title for SEO
  - `metaDescription` (string) - Meta description for SEO
  - `keywords` (string) - Meta keywords for SEO

**Timestamps**:

- `createdAt` (timestamp) - When the post was created (using new Date())
- `updatedAt` (timestamp) - Last modification timestamp (using new Date())
- `publishedAt` (timestamp) - When the post was published (null for drafts)

**Example Document**:

```json
{
  "title": "10 Essential Features Every Business Website Needs",
  "slug": "10-essential-features-business-website",
  "excerpt": "Discover the must-have features that will make your business website stand out and convert visitors into customers.",
  "content": "# 10 Essential Features Every Business Website Needs\n\nIn today's digital world...",
  "tags": ["web-design", "business", "features", "conversion"],
  "status": "published",
  "seo": {
    "metaTitle": "10 Essential Features Every Business Website Needs",
    "metaDescription": "Learn about the 10 essential features every business website needs to succeed online and convert visitors into customers.",
    "keywords": "business website, web design, features, conversion, online business"
  },
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

- `userId` (string) - Firebase Auth user ID of the client
- `businessName` (string) - Business name for the project
- `domain` (string) - Domain name for the website
- `businessType` (string) - Type of business (e.g., "Restaurant", "E-commerce")
- `selectedPackage` (string) - Package type (static/dynamic/ecommerce)
- `status` (string) - Project status (pending/active/completed/on-hold)

**Project Details**:

- `hostingDuration` (string) - Hosting duration (monthly/yearly/twoYear/threeYear)
- `emailDuration` (string) - Email duration (monthly/yearly/twoYear/threeYear)
- `emailAccountQuantity` (number) - Number of email accounts
- `productCount` (string) - Number of products for e-commerce
- `extraProducts` (number) - Additional products beyond package limit
- `pagesNeeded` (array) - Array of required pages
- `selectedPages` (array) - Array of selected pages
- `customPages` (array) - Array of custom pages
- `featuresNeeded` (array) - Array of required features
- `addons` (array) - Array of selected add-ons
- `reasoning` (string) - Reasoning for package recommendation

**Quote Information**:

- `recommendedPackage` (string) - Recommended package type
- `confidenceScore` (number) - Confidence score for recommendation
- `reasoning` (string) - Reasoning for package recommendation
- `setupFee` (number) - One-time setup fee
- `monthlyFee` (number) - Monthly hosting fee
- `hostingDiscount` (number) - Discount percentage for hosting
- `emailDiscount` (number) - Discount percentage for email
- `currency` (string) - Currency code

**Timestamps**:

- `createdAt` (timestamp) - Project creation timestamp (using serverTimestamp())
- `updatedAt` (timestamp) - Last update timestamp (using serverTimestamp())

**Example Document**:

```json
{
  "userId": "user123456789",
  "businessName": "Smith's Restaurant",
  "domain": "smithsrestaurant.com",
  "businessType": "Restaurant",
  "selectedPackage": "dynamic",
  "status": "pending",
  "hostingDuration": "yearly",
  "emailDuration": "monthly",
  "emailAccountQuantity": 3,
  "productCount": "",
  "extraProducts": 0,
  "pagesNeeded": ["Home", "About", "Menu", "Contact"],
  "selectedPages": ["Home", "About", "Menu", "Contact"],
  "customPages": [],
  "featuresNeeded": ["Contact Form", "Google Maps"],
  "addons": ["Logo Design", "Live Chat"],
  "recommendedPackage": "dynamic",
  "confidenceScore": 100,
  "reasoning": "Package selected by user: dynamic",
  "setupFee": 135,
  "monthlyFee": 7.2,
  "hostingDiscount": 10,
  "emailDiscount": 0,
  "currency": "USD",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Created when clients submit new project requests
- Used for project management and tracking
- Referenced in admin dashboard for project oversight
- Used in client portal for project status
- Enables project lifecycle management

### invoices Collection

**Purpose**: Stores invoice information for billing and payment tracking.

**Collection Path**: `invoices/{invoiceId}`

**Fields**:

**Invoice Information**:

- `projectId` (string) - Reference to the associated project
- `userId` (string) - Firebase Auth user ID of the client
- `userEmail` (string) - User's email address
- `businessName` (string) - Business name for the project
- `domain` (string) - Domain name for the website
- `businessType` (string) - Type of business
- `packageType` (string) - Package type (static/dynamic/ecommerce)
- `status` (string) - Invoice status (pending/paid/overdue/cancelled)

**Billing Details**:

- `hostingDuration` (string) - Hosting duration (monthly/yearly/twoYear/threeYear)
- `emailDuration` (string) - Email duration (monthly/yearly/twoYear/threeYear)
- `emailAccountQuantity` (number) - Number of email accounts
- `productCount` (string) - Number of products for e-commerce
- `extraProducts` (number) - Additional products beyond package limit
- `setupFee` (number) - One-time setup fee
- `monthlyFee` (number) - Monthly hosting fee
- `hostingDiscount` (number) - Discount percentage for hosting
- `emailDiscount` (number) - Discount percentage for email
- `addons` (array) - Array of selected add-ons
- `addonCosts` (number) - Total cost of add-ons
- `currency` (string) - Currency code
- `projectId` (string) - Reference to the associated project

**Payment Information**:

- `invoiceNumber` (string) - Unique invoice number (format: INV-{timestamp})
- `dueDate` (timestamp) - Payment due date (7 days from creation)

**Timestamps**:

- `createdAt` (timestamp) - Invoice creation timestamp (using serverTimestamp())
- `updatedAt` (timestamp) - Last update timestamp (using serverTimestamp())

**Example Document**:

```json
{
  "projectId": "project_abc123",
  "userId": "user123456789",
  "userEmail": "john.smith@example.com",
  "businessName": "Smith's Restaurant",
  "domain": "smithsrestaurant.com",
  "businessType": "Restaurant",
  "packageType": "dynamic",
  "status": "pending",
  "hostingDuration": "yearly",
  "emailDuration": "monthly",
  "emailAccountQuantity": 3,
  "productCount": "",
  "extraProducts": 0,
  "setupFee": 135,
  "monthlyFee": 7.2,
  "hostingDiscount": 10,
  "emailDiscount": 0,
  "addons": ["Logo Design", "Live Chat"],
  "addonCosts": 20,
  "currency": "USD",
  "invoiceNumber": "INV-1705312200000",
  "dueDate": "2024-01-22T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Created automatically when a new project is submitted
- Used for billing and payment tracking
- Referenced in client portal for invoice management
- Used in admin dashboard for financial tracking
- Enables payment processing and status updates

### notifications Collection

**Purpose**: Stores notifications for admins about payment requests, system alerts, and other important events.

**Collection Path**: `notifications/{notificationId}`

**Fields**:

**Notification Information**:

- `type` (string) - Notification type (payment_request, system_alert, etc.)
- `title` (string) - Notification title
- `message` (string) - Detailed notification message
- `status` (string) - Notification status (pending, read, resolved)
- `read` (boolean) - Whether notification has been read by admin

**Payment Request Fields** (for payment_request type):

- `invoiceId` (string) - Reference to the associated invoice
- `userId` (string) - Firebase Auth user ID of the client
- `userEmail` (string) - User's email address
- `businessName` (string) - Business name for the project
- `invoiceNumber` (string) - Invoice number
- `amount` (number) - Payment amount
- `currency` (string) - Currency code
- `paymentMethod` (string) - Payment method (paypal, other)

**Timestamps**:

- `createdAt` (timestamp) - Notification creation timestamp
- `updatedAt` (timestamp) - Last update timestamp

**Example Document**:

```json
{
  "type": "payment_request",
  "title": "PayPal Payment Request",
  "message": "Client Smith's Restaurant (john.smith@example.com) has requested PayPal payment for invoice INV-1705312200000. Amount: $142.20",
  "invoiceId": "invoice_abc123",
  "userId": "user123456789",
  "userEmail": "john.smith@example.com",
  "businessName": "Smith's Restaurant",
  "invoiceNumber": "INV-1705312200000",
  "amount": 142.2,
  "currency": "USD",
  "paymentMethod": "paypal",
  "status": "pending",
  "read": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Usage**:

- Created when clients request payments through the billing portal
- Used by admin dashboard for payment request management
- Enables admin notification system for payment tracking
- Supports different notification types for system alerts

## Security Rules

**Access Control**:

- **leads**: Only authenticated users can create, users can read their own leads, admins can read/write all
- **quotes**: Users can read their own quotes, admins can read/write all
- **tickets**: Users can read/create their own tickets, admins can read/write all
- **users**: Users can read/write their own data, admins can read all
- **pricing**: Read-only for all users, write access for admins only
- **blog**: Read access for all users, write access for admins only
- **projects**: Users can read their own projects, admins can read/write all
- **invoices**: Users can read their own invoices, admins can read/write all
- **notifications**: Users can create notifications, admins can read/write all

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
- `users` ←→ `invoices` (One-to-Many)
- `users` ←→ `notifications` (One-to-Many)
- `leads` ←→ `quotes` (One-to-One)
- `projects` ←→ `invoices` (One-to-One)
- `invoices` ←→ `notifications` (One-to-Many)
- `tickets` ←→ `ticketResponses` (One-to-Many)

**Query Patterns**:

- Get user's quotes: `quotes?userId={uid}`
- Get user's leads: `leads?userId={uid}`
- Get user's tickets: `tickets?userId={uid}`
- Get user's projects: `projects?userId={uid}`
- Get user's invoices: `invoices?userId={uid}`
- Get admin notifications: `notifications?read=false`
- Get notifications by type: `notifications?type=payment_request`
- Get leads by status: `leads?status=new`
- Get pricing by currency: `pricing/{currency}`
- Get published blog posts: `blog?status=published`
- Get ticket responses: `ticketResponses?ticketId={ticketId}`

## Indexing Strategy

**Required Indexes**:

- `quotes` collection: `userId` + `createdAt` (composite)
- `leads` collection: `userId` + `createdAt` (composite)
- `tickets` collection: `userId` + `createdAt` (composite)
- `projects` collection: `userId` + `createdAt` (composite)
- `invoices` collection: `userId` + `createdAt` (composite)
- `notifications` collection: `read` + `createdAt` (composite)
- `notifications` collection: `type` + `createdAt` (composite)
- `leads` collection: `status` + `createdAt` (composite)
- `blog` collection: `status` + `publishedAt` (composite)
- `ticketResponses` collection: `ticketId` + `createdAt` (composite)

**Performance Considerations**:

- All queries use indexed fields for optimal performance
- Composite indexes support complex filtering and sorting
- Timestamp-based queries for chronological ordering
- User-specific queries for data isolation
- Blog posts use static generation for better performance

## Timestamp Implementation Notes

**Server Timestamps** (using serverTimestamp()):

- `leads.timestamp` - Server-generated timestamp for lead creation
- `tickets.createdAt` - Server-generated timestamp for ticket creation
- `tickets.updatedAt` - Server-generated timestamp for ticket updates
- `projects.createdAt` - Server-generated timestamp for project creation
- `projects.updatedAt` - Server-generated timestamp for project updates
- `invoices.createdAt` - Server-generated timestamp for invoice creation
- `invoices.updatedAt` - Server-generated timestamp for invoice updates
- `ticketResponses.createdAt` - Server-generated timestamp for response creation

**Client Timestamps** (using new Date()):

- `quotes.createdAt` - Client-generated timestamp for quote creation
- `users.createdAt` - Client-generated timestamp for user creation
- `users.updatedAt` - Client-generated timestamp for user updates
- `blog.createdAt` - Client-generated timestamp for blog post creation
- `blog.updatedAt` - Client-generated timestamp for blog post updates
- `blog.publishedAt` - Client-generated timestamp for blog post publication

**Best Practices**:

- Use serverTimestamp() for critical audit trails (leads, tickets, projects, invoices)
- Use new Date() for user-generated content (quotes, users, blog posts)
- Server timestamps are more reliable for chronological ordering
- Client timestamps are suitable for user-facing content
