import Head from 'next/head';

/**
 * SEO Component for comprehensive meta tags, Open Graph, Twitter Cards, and structured data
 * Works perfectly with Next.js static export - all tags are rendered into static HTML at build time
 * 
 * @param {Object} props - SEO configuration object
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Comma-separated keywords (optional)
 * @param {string} props.url - Canonical URL (optional, defaults to homepage)
 * @param {string} props.image - Open Graph/Twitter image URL (optional)
 * @param {string} props.type - Open Graph type (website, article, etc.) - defaults to 'website'
 * @param {Object} props.structuredData - JSON-LD structured data object (optional)
 * @param {string} props.author - Article author (optional, for articles)
 * @param {string} props.publishedTime - Article published time (optional, for articles)
 * @param {string[]} props.tags - Article tags (optional, for articles)
 */
export default function SEO({
    title = 'Website14 - Professional Web Development Services',
    description = 'Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses.',
    keywords,
    url = 'https://website14.com',
    image = 'https://website14.com/og-image.jpg',
    type = 'website',
    structuredData,
    author,
    publishedTime,
    tags = []
}) {
    const fullTitle = title.includes('Website14') ? title : `${title} | Website14`;
    const siteName = 'Website14';
    const twitterHandle = '@website14';

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={siteName} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Article specific meta tags */}
            {type === 'article' && (
                <>
                    {author && <meta property="article:author" content={author} />}
                    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
                    {tags.map((tag, index) => (
                        <meta key={index} property="article:tag" content={tag} />
                    ))}
                </>
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Favicons */}
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/favicon.svg" />

            {/* Structured Data (JSON-LD) - Supports single object or array of schemas */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
            )}
        </Head>
    );
}

