import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Tag,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/layouts/header";
import { blogApi } from "@/network-request/apis";
import ShareButtons from "./ShareButtons";

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
  author: {
    id: number;
    first_name: string;
    last_name: string;
    profile_image: string | null;
  };
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post: BlogDetail | null = await blogApi.getPost(slug);
  if (!post) return { title: "Post Not Found | PikPakGo Blog" };

  const seo = post.seo;

  return {
    title: seo.title || post.title,
    description: seo.description || post.excerpt,
    robots: seo.no_index ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical:
        seo.canonical || `https://pickpackgo.in-sourceit.com/blog/${slug}`,
    },
    openGraph: {
      title: seo.og_title || post.title,
      description: seo.og_description || post.excerpt,
      type: "article",
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
      card: "summary_large_image",
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
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post: BlogDetail | null = await blogApi.getPost(slug);
  if (!post) notFound();

  // Fetch recommended articles
  const allPosts: BlogDetail[] = await blogApi.getPosts(6);
  const recommended = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

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

      <main className="min-h-screen bg-slate-50/50 pb-20">
        {/* Dynamic Dark Hero Banner */}
        <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28 px-4">
          {/* Featured Image Background with overlay */}
          {isValidUrl(post.featured_image) && (
            <div className="absolute inset-0 z-0">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover opacity-20 blur-xs scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950" />
            </div>
          )}

          <div className="relative z-10 global-container">
            {/* Breadcrumb / Back Link */}
            <div className="mb-6 flex items-center gap-2 text-xs md:text-sm text-slate-400">
              <Link
                href="/blog"
                className="hover:text-emerald-400 transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-300 truncate max-w-xs">
                {post.title}
              </span>
            </div>

            {/* Category badge */}
            <span
              className="inline-block text-xs font-bold px-3.5 py-1.5 rounded-full text-white shadow-md mb-6"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight max-w-5xl">
              {post.title}
            </h1>

            {/* Meta Row with glass cards */}
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300">
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full">
                {post.author.profile_image &&
                isValidUrl(post.author.profile_image) ? (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                    <Image
                      src={post.author.profile_image}
                      alt={`${post.author.first_name} ${post.author.last_name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {post.author.first_name[0]}
                    {post.author.last_name[0]}
                  </div>
                )}
                <span className="font-semibold">
                  {post.author.first_name} {post.author.last_name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 px-3.5 py-1.5 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(post.published_at)}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 px-3.5 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.read_time} min read</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 px-3.5 py-1.5 rounded-full">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.view_count} views</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article & Sidebar Layout */}
        <div className="global-container -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Article Body */}
            <div className="lg:col-span-8">
              <article className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-12 lg:p-16">
                {/* Back button link */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-wider mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Articles
                </Link>

                {/* Excerpt */}
                <p className="text-lg md:text-xl font-medium text-slate-500 leading-relaxed mb-10 pb-8 border-b border-slate-100">
                  {post.excerpt}
                </p>

                {/* Large Featured Image */}
                {isValidUrl(post.featured_image) && (
                  <div className="relative w-full h-[250px] md:h-[450px] rounded-3xl overflow-hidden mb-10 shadow-md">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />
                  </div>
                )}

                {/* Main Content Body */}
                <div
                  className="blog-content text-slate-800 leading-relaxed text-base md:text-lg prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tag Pills */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-12 pt-8 border-t border-slate-100">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3.5 py-2 rounded-xl transition-colors border border-slate-100"
                      >
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* About Author Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col items-center text-center">
                {post.author.profile_image &&
                isValidUrl(post.author.profile_image) ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-100 mb-4">
                    <Image
                      src={post.author.profile_image}
                      alt={`${post.author.first_name} ${post.author.last_name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl font-bold border border-emerald-100 mb-4">
                    {post.author.first_name[0]}
                    {post.author.last_name[0]}
                  </div>
                )}
                <h4 className="font-extrabold text-slate-800 text-lg">
                  {post.author.first_name} {post.author.last_name}
                </h4>
                <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
                  Travel Writer & Expert
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sharing travel inspirations, accommodation guides, and local
                  exploration secrets across the globe with PikPakGo.
                </p>
              </div>

              {/* ShareButtons Component */}
              <ShareButtons title={post.title} />

              {/* Recommended Articles Sidebar Widget */}
              {recommended.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 pb-4 border-b border-slate-50">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    Recommended Reading
                  </h3>
                  <div className="space-y-5">
                    {recommended.map((item) => (
                      <Link
                        key={item.id}
                        href={`/blog/${item.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-3.5 items-start">
                          {isValidUrl(item.featured_image) && (
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                              <Image
                                src={item.featured_image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span
                              className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full text-white mb-1.5"
                              style={{ backgroundColor: item.category.color }}
                            >
                              {item.category.name}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {item.read_time} min read
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
