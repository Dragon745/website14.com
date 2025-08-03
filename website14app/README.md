This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Blog System

The website includes a complete blog system with the following features:

### Admin Panel Integration

- Blog management is integrated into the admin panel at `/admin`
- Create, edit, and delete blog posts through the web interface
- Rich text editor with markdown support
- SEO meta tag management
- Post status management (draft/published)

### Blog Features

- **Public Blog Listing**: `/blog` - Displays all published posts with search and filtering
- **Individual Post Pages**: `/blog/[slug]` - Dynamic routes for each blog post
- **SEO Optimized**: Proper meta tags, Open Graph, and structured data
- **Search & Filter**: Client-side search and tag filtering
- **Related Posts**: Shows related posts on individual post pages
- **Reading Time**: Automatically calculates and displays reading time

### Technical Implementation

- **Firestore Storage**: All posts stored in `blog/` collection
- **Public Access**: Blog posts are publicly readable
- **Admin Only**: Only admins can create/edit posts
- **Static Generation**: Blog posts generated as static pages using `getStaticPaths` and `getStaticProps`
- **Dynamic Sitemap**: Blog posts automatically included in sitemap.xml
- **Build Integration**: Blog generation and sitemap generation integrated into build process

### Usage

#### Adding Sample Blog Post

```bash
npm run add-sample-blog
```

#### Generating Sitemap

```bash
npm run generate-sitemap
```

#### Building

```bash
npm run build
```

#### Deployment

```bash
npm run deploy
```

### Blog Post Structure

```javascript
{
  title: string,
  content: string (markdown),
  excerpt: string,
  slug: string (auto-generated),
  tags: string[],
  status: 'draft' | 'published',
  publishedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
  seo: {
    metaTitle: string,
    metaDescription: string,
    keywords: string
  }
}
```

### Workflow

1. **Create Post**: Use admin panel to create new blog post
2. **Edit Content**: Write content with markdown support
3. **Set SEO**: Add meta title, description, and keywords
4. **Publish**: Change status to "published"
5. **Build**: Run `npm run build` to generate static files (includes blog posts)
6. **Deploy**: Deploy to Firebase Hosting
