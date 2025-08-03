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

## Security Rules

**Access Control**:

- **leads**: Only authenticated users can create, admins can read/write all
- **quotes**: Users can read their own quotes, admins can read/write all
- **tickets**: Users can read/create their own tickets, admins can read/write all
- **users**: Users can read/write their own data, admins can read all

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
- `leads` ←→ `quotes` (One-to-One)

**Query Patterns**:

- Get user's quotes: `quotes?userId={uid}`
- Get user's leads: `leads?userId={uid}`
- Get user's tickets: `tickets?userId={uid}`
- Get leads by status: `leads?status=new`

## Indexing Strategy

**Required Indexes**:

- `quotes` collection: `userId` + `createdAt` (composite)
- `leads` collection: `userId` + `createdAt` (composite)
- `tickets` collection: `userId` + `createdAt` (composite)
- `leads` collection: `status` + `createdAt` (composite)

**Performance Considerations**:

- All queries use indexed fields for optimal performance
- Composite indexes support complex filtering and sorting
- Timestamp-based queries for chronological ordering
- User-specific queries for data isolation
