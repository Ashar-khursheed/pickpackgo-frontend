import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag, Eye } from 'lucide-react';
import Header from '@/layouts/header';
import { blogApi } from '@/network-request/apis';

export const revalidate = 3600;

interface BlogDetail {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  tags: string[];
  published_at: string;
  read_time: number;
  is_featured: boolean;
  view_count: number;
  no_index: boolean;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  canonical_url: string | null;
  schema_markup: Record<string, unknown> | null;
  category: { id: number; name: string; slug: string; color: string };
  author: { id: number; first_name: string; last_name: string; profile_image: string | null };
  seo: {
    title: string;
    description: string;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_title: string;
    twitter_description: string;
    twitter_image: string;
    canonical: string;
    no_index: boolean;
    schema: Record<string, unknown>;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function generateStaticParams() {
  const slugs = await blogApi.getAllSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post: BlogDetail | null = await blogApi.getPost(slug);
  if (!post) return { title: 'Post Not Found | PikPakGo Blog' };

  const seo = post.seo;

  return {
    title: seo.title || post.title,
    description: seo.description || post.excerpt,
    robots: seo.no_index ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: seo.canonical || `https://pickpackgo.in-sourceit.com/blog/${slug}`,
    },
    openGraph: {
      title: seo.og_title || post.title,
      description: seo.og_description || post.excerpt,
      type: 'article',
      url: seo.canonical || `https://pickpackgo.in-sourceit.com/blog/${slug}`,
      publishedTime: post.published_at,
      authors: [`${post.author.first_name} ${post.author.last_name}`],
      ...(isValidUrl(seo.og_image)
        ? { images: [{ url: seo.og_image, alt: post.title }] }
        : isValidUrl(post.featured_image)
        ? { images: [{ url: post.featured_image, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitter_title || post.title,
      description: seo.twitter_description || post.excerpt,
      ...(isValidUrl(seo.twitter_image)
        ? { images: [seo.twitter_image] }
        : isValidUrl(post.featured_image)
        ? { images: [post.featured_image] }
        : {}),
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post: BlogDetail | null = await blogApi.getPost(slug);
  if (!post) notFound();

  const schemaJson = post.seo?.schema ?? post.schema_markup;

  return (
    <>
      <Header />

      {/* JSON-LD Schema */}
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}

      <main className="min-h-screen bg-gray-50">
        {/* Hero image */}
        <div className="relative w-full h-64 md:h-[480px] bg-gray-900">
          {isValidUrl(post.featured_image) && (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover opacity-80"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="global-container">
          {/* Article card */}
          <article className="bg-white rounded-2xl shadow-lg -mt-16 relative z-10 mb-16 overflow-hidden">
            <div className="p-6 md:p-10 lg:p-14">
              {/* Back link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {/* Category badge */}
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white mb-4"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-gray-500 text-base md:text-lg mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  {post.author.profile_image && isValidUrl(post.author.profile_image) ? (
                    <Image
                      src={post.author.profile_image}
                      alt={`${post.author.first_name} ${post.author.last_name}`}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      {post.author.first_name[0]}
                      {post.author.last_name[0]}
                    </div>
                  )}
                  <span className="font-medium text-gray-700">
                    {post.author.first_name} {post.author.last_name}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.read_time} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count} views
                </span>
              </div>

              {/* Content */}
              <div
                className="blog-content text-gray-800 leading-relaxed text-base md:text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
