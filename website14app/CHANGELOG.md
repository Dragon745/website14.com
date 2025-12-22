# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.1.0] - Tuesday, 23 December, 2025 04:14:26 AM

### Added

- Created `docs/services-page-improvements.md` - Comprehensive guide with 15 detailed recommendations for enhancing the services page, including interactive features, social proof, FAQ section, and conversion optimization strategies
- Created `docs/theme.md` - Theme guide documenting colors, fonts, design style, and design concepts
- Enhanced homepage SEO with comprehensive structured data schemas
  - Added WebSite schema with SearchAction for better search engine understanding
  - Added Service schemas for Static Websites, Dynamic Websites, and E-commerce Solutions
  - Enhanced Organization schema with `areaServed` and `knowsAbout` fields
  - Multiple schema support in SEO component for richer structured data
- Added `aria-hidden="true"` attributes to decorative SVG icons for improved accessibility and SEO

### Changed

- **Complete redesign of services page** with new corporate theme
  - Updated hero section with purple/slate color scheme and new typography (Inter Display, Work Sans, Source Sans Pro)
  - Redesigned service cards (Static, Dynamic, E-commerce) with modern styling, icons, and improved visual hierarchy
  - Updated "Why Choose Website14" section with new design and purple accent colors
  - Redesigned testimonials section with improved card styling
  - Updated feature comparison table with new color scheme
  - Redesigned add-ons, hosting plans, and email hosting sections with consistent corporate styling
  - Added SEO component to services page
  - **All pricing logic and functionality preserved** - currency detection, dynamic pricing, discounts, and package selection remain intact
- Updated contact email address from `info@website14.com` to `contact@website14.com` in homepage structured data
- SEO component now supports both single structured data objects and arrays of multiple schemas
- Updated package.json version from `0.1.0` to `3.1.0` to match CHANGELOG versioning

## [3.0.0] - Monday, 22 December, 2025 07:53:15 PM

### Added

- Complete corporate redesign of homepage, header, and footer
- Professional top bar in header with contact information and trust indicators
- Enhanced header with improved navigation, logo design, and user menu
- Corporate hero section with gradient backgrounds and professional messaging
- Trust indicators section with key statistics
- Comprehensive services overview section with detailed service cards
- Key features section highlighting company advantages
- Professional CTA section with gradient background
- Multi-column corporate footer with organized sections (Company, Services, Resources)
- Professional footer bottom bar with copyright and legal links
- Custom SVG logo icon representing web development (browser window with code brackets)
- Standalone SVG logo file (`/public/logo-icon.svg`) for reuse across the application
- New favicon (`/public/favicon.svg`) using the custom logo icon design

### Changed

- Header: Redesigned with top bar, improved logo, better navigation structure, and enhanced user experience
- Homepage: Complete redesign with professional sections, better visual hierarchy, and corporate styling
- Footer: Transformed from simple single-row to comprehensive multi-column corporate layout with deep purple gradient background
- Logo Icon: Replaced text-based "W14" with custom SVG icon combining browser/window frame, code brackets, and grid lines to better represent web development services
- Logo Implementation: Updated Header and Footer components to use standalone SVG file (`/logo-icon.svg`) instead of inline SVG
- Favicon: Replaced default favicon with custom logo icon design for consistent branding
- SVG Icon Colors: Updated logo-icon.svg and favicon.svg to use purple gradient colors (purple-600, purple-700, purple-800) instead of blue
- Logo Icon Design: Enhanced logo icon with improved visual details
  - Added gradient border to browser frame for depth
  - Refined browser control dots for better visibility
  - Enhanced code brackets with better stroke weight
  - Added subtle accent dots representing web content
  - Improved grid lines with better opacity and positioning
  - Added browser header bar with gradient fill
  - Better overall visual hierarchy and polish
- Color Scheme: Complete transition from blue to purple color palette
  - Primary brand color: Purple-600 (#7c3aed) replacing blue
  - Logo gradients: Purple gradient backgrounds (from-purple-600 via-purple-700 to-purple-800)
  - Navigation: Purple accents for hover states and active indicators
  - Buttons: Purple-600 for primary CTAs with purple-700 hover states
  - Hero section: Purple-50 background tints, purple-600 headline text, purple gradient buttons
  - Service cards: Purple-100 icon backgrounds, purple-600 icons, purple borders for featured card
  - Features section: Purple-100 backgrounds for primary feature icons
  - CTA section: Purple gradient background (from-purple-600 via-purple-700 to-purple-800)
  - Footer: Deep purple gradient background (from-gray-900 via-gray-900 to-purple-950), purple-400 icons and hover states
  - Trust indicators: Purple-100 border accents
  - Background sections: Purple-50 tints for subtle depth
- Corporate Color Scheme Refinement: Enhanced professional appearance with deep slate-purple palette
  - Primary dark colors: Replaced gray-900 with slate-900 for more sophisticated, professional look
  - Accent colors: Upgraded from purple-600/700 to purple-800/900 for more authoritative, corporate feel
  - Backgrounds: Replaced purple-50 with slate-50 for cleaner, more neutral corporate aesthetic
  - Buttons: Deep purple-800/900 gradients with slate-900 hover states for premium appearance
  - Navigation: Slate-700 text with purple-800 hover accents for subtle, professional interactions
  - Footer: Slate-900 to slate-950 gradient (removed purple-950) for cohesive dark theme
  - Text colors: Updated gray-600/700 to slate-600/700 for better consistency
  - Icon colors: Purple-500 accents in footer (replacing purple-400) for better visibility
  - Overall: More restrained, sophisticated color usage with purple as strategic accent rather than dominant color
- Typography Upgrade: Implemented premium corporate font pairing
  - Headings: Plus Jakarta Sans (600, 700, 800 weights) - Bold, modern, professional sans-serif for all headings
  - Body Text: DM Sans (400, 500, 600, 700 weights) - Clean, highly readable sans-serif for body content
  - Code: JetBrains Mono (kept for code/monospace content)
  - Font Configuration: Updated Tailwind config with `font-heading` and `font-sans` utilities
  - Implementation: All headings (h1-h4) now use Plus Jakarta Sans, body text uses DM Sans
  - Benefits: Enhanced visual hierarchy, improved readability, more professional corporate appearance
  - Backward Compatibility: `font-inter` class now maps to DM Sans for seamless transition
- Typography System Refinement: Enhanced corporate typography with contrasting font families
  - Headings (H1, H2): Inter Display (700, 800 weights) - Bold, authoritative display font for main headings
  - Subheadings (H3, H4): Work Sans (600 weight) - Modern, professional sans-serif for section titles and subheadings
  - Body Text: Source Sans Pro (400, 500 weights) - Clean, highly readable sans-serif for all body content and navigation
  - Logo Text: Bodoni Moda (serif) - Elegant, distinctive serif font for brand logo "WEBSITE14" in all caps
  - Logo Tagline: Small caps styling with dynamic width matching for "PROFESSIONAL IT SERVICES"
  - Font Configuration: Updated Tailwind config with `font-heading`, `font-subheading`, `font-body`, and `font-logo` utilities
  - Implementation: Clear typographic hierarchy with contrasting font families for professional corporate appearance
  - Benefits: Enhanced visual contrast, improved readability, more sophisticated typographic system
- Overall design language: More professional, corporate, and polished appearance with distinctive purple branding
- Typography: Improved hierarchy and readability

### Design Improvements

- Added professional logo design with purple gradient background and custom web development icon
- Logo icon now visually represents the company's core services (web development and coding)
- Improved spacing and layout consistency
- Enhanced hover states and transitions (logo has scale and shadow effects on hover)
- Better visual hierarchy with proper sectioning
- Professional color palette with purple-600 (#7c3aed) as primary brand color
- Purple gradient accents throughout for modern, distinctive branding
- Subtle purple-50 background tints for depth while maintaining clean aesthetic
- Deep purple gradient footer background for premium feel
- Corporate-grade footer with organized information architecture and purple accent links
- Social media links with purple hover effects
- Newsletter signup with purple-themed styling
