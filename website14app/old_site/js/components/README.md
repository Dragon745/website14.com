# Modular Header and Footer Components

This directory contains reusable header and footer components that can be easily included across all pages of the website.

## Components

### 1. **Global Header** (`header.js`)
- **Usage**: Include in all pages except the home page
- **Features**: 
  - Responsive navigation menu
  - Links to Services, Blog, Contact, and Admin
  - Sticky positioning
  - Clean, modern design

### 2. **Global Footer** (`footer.js`)
- **Usage**: Include in all pages including the home page
- **Features**:
  - Consistent branding
  - Navigation links
  - Copyright information
  - Responsive design

### 3. **Admin Header** (`admin-header.js`)
- **Usage**: Include in admin pages only
- **Features**:
  - Admin-specific branding
  - Performance stats display
  - Admin email display
  - Blog admin link
  - Logout functionality

## How to Use

### **For Regular Pages (Services, Contact, Blog):**
```html
<!-- Include at the top of the body -->
<script src="js/components/header.js"></script>

<!-- Include at the bottom of the body -->
<script src="js/components/footer.js"></script>
```

### **For Admin Pages:**
```html
<!-- Include at the top of the body -->
<script src="js/components/admin-header.js"></script>

<!-- Include at the bottom of the body -->
<script src="js/components/footer.js"></script>
```

### **For Home Page (Footer Only):**
```html
<!-- Include only footer at the bottom of the body -->
<script src="js/components/footer.js"></script>
```

## File Structure

```
js/components/
├── header.js          # Global header for regular pages
├── footer.js          # Global footer for all pages
├── admin-header.js    # Special header for admin pages
└── README.md          # This documentation
```

## Features

### **Header Features:**
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Sticky Positioning**: Stays at top when scrolling
- ✅ **Consistent Navigation**: Same links across all pages
- ✅ **Brand Consistency**: Website14 branding
- ✅ **Smooth Transitions**: Hover effects and animations

### **Footer Features:**
- ✅ **Complete Navigation**: All important links
- ✅ **Brand Identity**: Consistent Website14 branding
- ✅ **Responsive Layout**: Adapts to mobile and desktop
- ✅ **Copyright Info**: Legal information
- ✅ **Clean Design**: Professional appearance

### **Admin Header Features:**
- ✅ **Admin Branding**: Clear admin interface identification
- ✅ **Performance Stats**: Real-time system status
- ✅ **User Info**: Shows logged-in admin email
- ✅ **Quick Links**: Easy access to blog admin
- ✅ **Logout Function**: Secure session management

## Customization

### **Modifying Header Links:**
Edit the `header.js` file to change navigation links:
```javascript
// In header.js
<div class="flex items-center space-x-8">
    <a href="/services.html" class="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
    <a href="/blog/index.html" class="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
    <a href="/contact.html" class="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
    <a href="/admin/dashboard.html" class="text-blue-600 hover:text-blue-800 transition-colors">Admin</a>
</div>
```

### **Modifying Footer Links:**
Edit the `footer.js` file to change footer links:
```javascript
// In footer.js
<ul class="flex gap-8 text-sm">
    <li><a href="/services.html" class="text-gray-300 hover:text-white transition-colors duration-300 font-inter">Services</a></li>
    <li><a href="/about.html" class="text-gray-300 hover:text-white transition-colors duration-300 font-inter">About</a></li>
    <li><a href="/contact.html" class="text-gray-300 hover:text-white transition-colors duration-300 font-inter">Contact</a></li>
    <li><a href="/blog/index.html" class="text-gray-300 hover:text-white transition-colors duration-300 font-inter">Blog</a></li>
</ul>
```

### **Styling Customization:**
All components use Tailwind CSS classes. You can modify:
- Colors (text colors, background colors)
- Spacing (padding, margins)
- Typography (font sizes, weights)
- Layout (flexbox, grid)
- Animations (transitions, hover effects)

## Implementation Notes

### **Loading Order:**
1. Header components should be loaded early in the `<body>`
2. Footer components should be loaded at the end of the `<body>`
3. Components auto-initialize when DOM is loaded

### **Dependencies:**
- Tailwind CSS (included via CDN)
- Font families (JetBrains Mono, Inter)
- No additional JavaScript libraries required

### **Browser Compatibility:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox support

## Maintenance

### **Adding New Pages:**
1. Copy the header/footer script tags from existing pages
2. Ensure proper file paths (relative to page location)
3. Test navigation links work correctly

### **Updating Links:**
1. Edit the component files directly
2. Changes will apply to all pages using the component
3. No need to update individual pages

### **Troubleshooting:**
- **Header not showing**: Check file path and script loading
- **Footer not showing**: Ensure script is loaded at end of body
- **Links not working**: Verify relative paths are correct
- **Styling issues**: Check Tailwind CSS is loaded

---

**Note**: These components are designed to be lightweight and fast-loading while providing consistent navigation across the entire website.