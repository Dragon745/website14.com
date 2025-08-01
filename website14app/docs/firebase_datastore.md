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
