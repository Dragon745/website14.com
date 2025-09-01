# Website14 Project Overview

## Architecture & Technology Stack

**Framework**: Next.js 15.4.5 with React 18  
**Styling**: Tailwind CSS with custom font optimization  
**Database**: Firebase Firestore  
**Deployment**: Static export with Firebase Hosting  
**Build Output**: Static HTML/CSS/JS files in `out/` folder

## 1. Page Rendering & JavaScript Loading Strategy

### Static Site Generation (SSG)

- **Build-time rendering**: All pages are pre-rendered at build time using `getStaticProps` and `getStaticPaths`
- **Zero JavaScript dependency**: Pages render immediately without waiting for JS to load
- **Progressive enhancement**: Core content displays instantly, interactive features enhance after JS loads

### Font Loading Strategy

- **Critical fonts inlined**: Inter and JetBrains Mono fonts are inlined in `_document.js` for immediate display
- **Preconnect optimization**: Google Fonts preconnected for faster loading
- **Font-display: swap**: Prevents layout shift during font loading
- **Fallback support**: `noscript` fallback for users with JavaScript disabled

### JavaScript Loading

- **Deferred loading**: `NextScript` loads JS after initial HTML render
- **Prefetching**: Links use `prefetch={true}` for faster navigation
- **Progressive enhancement**: Core functionality works without JS, enhanced features load progressively

## 2. Blogging System

### Architecture

- **Firebase Firestore backend**: Blog posts stored in `blog` collection
- **Static generation**: All blog posts pre-rendered at build time
- **Dynamic routing**: Individual posts use `[slug].js` dynamic routes

### Features

- **Content management**: Posts support title, excerpt, content, tags, and SEO metadata
- **Markdown rendering**: Custom markdown parser supporting headers, lists, code blocks, and inline formatting
- **Search & filtering**: Client-side search by title, excerpt, content, and tags
- **Related posts**: Automatically suggests related content
- **SEO optimization**: Meta tags, Open Graph, and canonical URLs

### Data Flow

1. **Build time**: `getStaticPaths` generates all possible blog post routes
2. **Build time**: `getStaticProps` fetches post data from Firestore
3. **Runtime**: Static HTML served instantly
4. **Client-side**: Search and filtering handled by React state

## 3. Pre-loading System for Speed

### Page Preloading

- **Automatic preloading**: `usePreload` hook preloads all main pages after initial render
- **Smart prefetching**: Uses Next.js `router.prefetch()` for instant navigation
- **Blog post preloading**: First 3 blog posts preloaded when visiting blog index
- **Preload status indicator**: Development-only visual feedback showing preload completion

### Preloaded Pages

```
/, /services, /about, /faq, /contact, /login, /signup,
/builder, /blog, /tools/speed-test
```

### Performance Benefits

- **Instant navigation**: Preloaded pages navigate without loading delays
- **Reduced perceived latency**: Users experience faster page transitions
- **Background optimization**: Preloading happens after initial page load

## 4. Other Key Implementations

### Build & Deployment

- **Static export**: `output: 'export'` generates static files for CDN hosting
- **Pre-built deployment**: Local build process creates `out/` folder for deployment
- **CI/CD ready**: Build scripts support automated deployment workflows

### SEO & Performance

- **Sitemap generation**: Automated sitemap creation during build
- **Meta tag optimization**: Comprehensive Open Graph and Twitter Card support
- **Performance monitoring**: Speed test tool included in `/tools/speed-test`

### User Experience

- **Location-based pricing**: Currency detection for localized pricing
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Semantic HTML and ARIA-friendly components

### Development Workflow

- **Hot reloading**: Development server with instant updates
- **ESLint integration**: Code quality enforcement (disabled during builds)
- **Script automation**: NPM scripts for common development tasks

## 5. Performance Characteristics

### Core Web Vitals

- **LCP**: Optimized through static generation and font preloading
- **FID**: Minimal JavaScript execution on initial load
- **CLS**: Font-display swap and stable layouts prevent shift

### Loading Strategy

1. **HTML**: Served instantly from static files
2. **CSS**: Critical styles inlined, rest loaded progressively
3. **Fonts**: Critical fonts inlined, others loaded asynchronously
4. **JavaScript**: Loaded after initial render for progressive enhancement
5. **Navigation**: Preloaded pages for instant transitions

This architecture ensures maximum performance while maintaining rich functionality and excellent user experience.
