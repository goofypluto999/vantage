import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://vantage-livid.vercel.app';
const SITE_NAME = 'Vantage';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;                // e.g. '/pricing' — used for canonical + og:url
  image?: string;               // absolute URL
  noindex?: boolean;
  type?: 'website' | 'article';
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  jsonLd?: object | object[];   // additional JSON-LD to add (Article, BreadcrumbList, etc.)
}

/**
 * SEO wraps Helmet and renders a consistent set of per-route meta tags.
 * Defaults point at Vantage brand so callers only need to override what they change.
 */
export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  type = 'website',
  articleMeta,
  jsonLd,
}: SEOProps) {
  const canonical = `${SITE_URL}${path}`;
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : 'Vantage | AI Job Preparation: CV Fit, Cover Letters, Interview Prep in 90 Seconds';
  const metaDescription = description
    ?? 'Upload your CV, paste a job link, and get the full prep pack in ~90 seconds: company intel, tailored cover letter, mock interview questions, and a CV fit score.';

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Article-specific (for blog posts) */}
      {type === 'article' && articleMeta?.publishedTime && (
        <meta property="article:published_time" content={articleMeta.publishedTime} />
      )}
      {type === 'article' && articleMeta?.modifiedTime && (
        <meta property="article:modified_time" content={articleMeta.modifiedTime} />
      )}
      {type === 'article' && articleMeta?.author && (
        <meta property="article:author" content={articleMeta.author} />
      )}
      {type === 'article' && articleMeta?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Additional JSON-LD (Article, BreadcrumbList, etc.) */}
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
