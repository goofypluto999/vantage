import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  const { t } = useTheme();

  // Newest first
  const posts = [...blogPosts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      {/* Nav */}
      <nav className={`${t.nav} sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${t.text}`}>
            <Star className="w-5 h-5 text-violet-500" />
            <span className="font-bold tracking-tight">Vantage</span>
          </Link>
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm ${t.textSub} hover:opacity-80`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${t.text}`}
        >
          The Vantage Blog
        </motion.h1>
        <p className={`mt-3 text-lg ${t.textSub} max-w-2xl`}>
          Guides on AI job application prep, interview strategy, ATS-friendly CVs, cover letters,
          and job fit analysis. Written by the team building Vantage, for the people using it.
        </p>
      </header>

      {/* Posts */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="block group">
                <motion.article
                  whileHover={{ y: -2 }}
                  className={`${t.glass} rounded-2xl overflow-hidden transition`}
                >
                  <div className="p-6 sm:p-8">
                    <div className={`flex flex-wrap items-center gap-3 text-xs ${t.textMuted} mb-3`}>
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
                    <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.text} group-hover:text-violet-500 transition`}>
                      {post.title}
                    </h2>
                    <p className={`mt-3 ${t.textSub}`}>{post.excerpt}</p>
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
                    <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-500`}>
                      Read the post <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={`mt-16 ${t.glass} rounded-2xl p-8 text-center`}>
          <h3 className={`text-2xl font-bold ${t.text}`}>
            Stop prepping job applications by hand.
          </h3>
          <p className={`mt-2 ${t.textSub} max-w-xl mx-auto`}>
            One upload. One job link. Full prep pack in about 90 seconds — company intel, cover
            letter, mock interview questions, CV fit score.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            Try Vantage free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
