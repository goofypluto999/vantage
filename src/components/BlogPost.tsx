import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getPostBySlug, blogPosts, type BlogSection } from '../data/blogPosts';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTheme();

  if (!slug) return <Navigate to="/blog" replace />;
  const post = getPostBySlug(slug);
  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    image: `${SITE_URL}/og-image.png`,
    keywords: post.tags.join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  // HowTo schema for procedural posts. Extracts steps from the first
  // ordered-list section. Google heavily devalued HowTo rich-results in
  // 2024 but AI assistants (Claude/ChatGPT/Perplexity) still parse it as
  // structured procedural signal when answering "how to X" queries.
  const HOW_TO_SLUGS = new Set([
    'how-to-prep-for-any-interview-in-20-minutes',
    'how-to-spot-a-ghost-job-in-30-seconds',
    'how-to-use-chatgpt-to-prep-for-an-interview',
    'the-30-second-cv-review-recruiters-actually-run',
    'the-5-minute-interview-pitch-that-gets-you-remembered',
  ]);

  let howToSchema: object | null = null;
  if (HOW_TO_SLUGS.has(post.slug)) {
    const firstOl = post.sections.find((s) => s.type === 'ol');
    if (firstOl && firstOl.type === 'ol' && firstOl.items.length >= 3) {
      howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: post.title,
        description: post.description,
        image: `${SITE_URL}/og-image.png`,
        totalTime: post.slug.includes('20-minutes')
          ? 'PT20M'
          : post.slug.includes('30-second')
          ? 'PT30S'
          : post.slug.includes('5-minute')
          ? 'PT5M'
          : 'PT15M',
        step: firstOl.items.map((text, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: `Step ${i + 1}`,
          text,
        })),
      };
    }
  }

  const allSchemas = [articleSchema, breadcrumbSchema, ...(howToSchema ? [howToSchema] : [])];

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        articleMeta={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          author: post.author,
          tags: post.tags,
        }}
        jsonLd={allSchemas}
      />

      {/* Nav */}
      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link
            to="/blog"
            className={`inline-flex items-center gap-2 text-sm ${t.textSub} hover:opacity-80`}
          >
            <ArrowLeft className="w-4 h-4" /> All posts
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Header */}
        <header>
          <div className={`flex flex-wrap items-center gap-3 text-xs ${t.textMuted} mb-4`}>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}>
            {post.title}
          </h1>
          <p className={`mt-4 text-lg ${t.textSub} italic`}>{post.hook}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-1 rounded-full ${t.cardInner} ${t.textSub}`}
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Link to the markdown twin for LLMs / power users */}
          <a
            href={`/blog/${post.slug}.md`}
            className={`mt-4 inline-block text-xs ${t.textMuted} hover:underline`}
          >
            View as markdown →
          </a>
        </header>

        {/* AEO TL;DR — direct answer block for AI crawlers */}
        <aside
          className={`mt-8 ${t.cardInner} rounded-2xl p-5 border-l-4 border-violet-500`}
          aria-label="Quick answer"
        >
          <div className={`text-xs uppercase tracking-widest font-semibold ${t.textMuted} mb-2`}>
            Quick answer
          </div>
          <p className={`${t.text} text-base leading-relaxed`}>{post.excerpt}</p>
        </aside>

        {/* Body */}
        <div className={`mt-10 space-y-5 ${t.textSub} leading-relaxed text-base sm:text-lg`}>
          {post.sections.map((section, i) => (
            <RenderSection key={i} section={section} textClass={t.text} mutedClass={t.textMuted} cardClass={t.cardInner} />
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>Do all this in 90 seconds, not 20 minutes.</h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            Upload your CV. Paste a job link. Full prep pack back. That is Vantage.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try it free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h3 className={`text-sm uppercase tracking-widest ${t.textMuted} mb-4`}>Read next</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  className={`${t.glass} rounded-xl p-5 block hover:-translate-y-0.5 transition`}
                >
                  <h4 className={`font-bold ${t.text} group-hover:text-violet-500`}>{rel.title}</h4>
                  <p className={`mt-2 text-sm ${t.textSub}`}>{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

function RenderSection({
  section,
  textClass,
  mutedClass,
  cardClass,
}: {
  section: BlogSection;
  textClass: string;
  mutedClass: string;
  cardClass: string;
}) {
  switch (section.type) {
    case 'h2':
      return <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${textClass} mt-10 mb-2`}>{section.text}</h2>;
    case 'h3':
      return <h3 className={`text-xl font-semibold ${textClass} mt-6 mb-1`}>{section.text}</h3>;
    case 'p':
      return <p>{section.text}</p>;
    case 'ul':
      return (
        <ul className="list-disc pl-6 space-y-2">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="list-decimal pl-6 space-y-2">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className={`border-l-4 border-violet-500 pl-4 italic ${mutedClass}`}>
          {section.text}
          {section.cite && <span className="block text-xs not-italic mt-1">— {section.cite}</span>}
        </blockquote>
      );
    case 'callout':
      return (
        <aside className={`${cardClass} rounded-xl p-4 border-l-4 border-violet-500 text-sm`}>
          {section.text}
        </aside>
      );
    default:
      return null;
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
