# Website14 Theme Guide

## Colors

### Primary Brand Colors

- **Purple**: `purple-800` (#6b21a8) / `purple-900` (#581c87)
- **Slate**: `slate-900` (#0f172a) / `slate-50` (#f8fafc) / `slate-600` (#475569) / `slate-700` (#334155)
- **White**: `white` (#ffffff)

### Accent Colors

- **Green**: `green-600` (#16a34a) - for success indicators, checkmarks
- **Red/Yellow/Green**: Browser window dots (decorative)

### Usage

- Primary buttons: `from-purple-800 to-purple-900` gradients
- Backgrounds: `slate-50`, `white`, `slate-900` (footer)
- Text: `slate-900` (headings), `slate-600` (body), `purple-800` (accents)
- Borders: `slate-200`, `slate-300`

## Typography

### Font Families

- **Logo**: `Bodoni Moda` (serif) - "WEBSITE14" all caps
- **Headings (H1, H2)**: `Inter Display` (700, 800 weights)
- **Subheadings (H3, H4)**: `Work Sans` (600 weight)
- **Body Text**: `Source Sans Pro` (400, 500 weights)
- **Code**: `JetBrains Mono` (monospace)

### Font Classes

- `.font-logo` - Bodoni Moda
- `.font-heading` - Inter Display
- `.font-subheading` - Work Sans
- `.font-body` - Source Sans Pro

## Design Style

### Overall Aesthetic

- **Corporate & Professional**
- Clean, modern, sophisticated
- Minimalist with strategic use of color
- Purple as accent, not dominant

### Design Concepts

**Gradients**

- Primary CTAs: `from-purple-800 to-purple-900`
- Hero backgrounds: `from-slate-50 via-white to-slate-50`
- Footer: `from-purple-800 via-purple-900 to-slate-900`

**Shadows**

- Cards: `shadow-lg`, `shadow-xl` on hover
- Buttons: `shadow-lg hover:shadow-xl`

**Borders & Radius**

- Rounded corners: `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px)
- Borders: `border-slate-200`, `border-slate-300`
- Hover states: `hover:border-purple-800`

**Spacing**

- Section padding: `py-20` (vertical), `px-4 sm:px-6 lg:px-8` (horizontal)
- Card padding: `p-8`
- Button padding: `px-8 py-4`

**Transitions**

- Duration: `transition-all duration-300`
- Hover effects: `hover:-translate-y-0.5` (subtle lift)

## Logo

- Text: "WEBSITE14" (all caps, Bodoni Moda)
- Tagline: "PROFESSIONAL IT SERVICES" (small caps, Work Sans)
- Icon: Custom SVG (`/logo-icon.svg`) - browser window with code brackets
- Tagline width dynamically matches logo width

## Component Patterns

**Buttons**

- Primary: Purple gradient, white text, shadow
- Secondary: White background, slate border, hover purple accent

**Cards**

- White background, rounded-xl, shadow-lg
- Hover: shadow-xl, border color change
- Featured card: `border-2 border-purple-800/30`

**Sections**

- Alternating backgrounds: `bg-white` / `bg-slate-50`
- Max width: `max-w-7xl mx-auto`
- Responsive padding: `px-4 sm:px-6 lg:px-8`

