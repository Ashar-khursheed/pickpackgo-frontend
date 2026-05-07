import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import Header from '@/layouts/header';
import { blogApi } from '@/network-request/apis';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Travel Blog | PikPakGo — Tips, Guides & Destinations',
  description:
    'Explore travel guides, destination tips, and expert advice from the PikPakGo blog. Stay inspired for your next adventure.',
  openGraph: {
    title: 'Travel Blog | PikPakGo',
    description: 'Explore travel guides, destination tips, and expert advice.',
    type: 'website',
    url: 'https://pickpackgo.in-sourceit.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Blog | PikPakGo',
    description: 'Explore travel guides, destination tips, and expert advice.',
  },
};

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  published_at: string;
  read_time: number;
  is_featured: boolean;
  view_count: number;
  category: { id: number; name: string; slug: string; color: string };
  author: { id: number; first_name: string; last_name: string; profile_image: string | null };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

export default async function BlogPage() {
  const posts: BlogPost[] = await blogApi.getPosts(12);
  const featured = posts.find((p) => p.is_featured);
  const rest = posts.filter((p) => !p.is_featured || p.id !== featured?.id);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-[#0d1637] py-16 px-4">
          <div className="global-container text-center">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Our Blog
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Travel Tips &amp; Inspiration
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover destination guides, travel hacks, and expert advice to make every journey unforgettable.
            </p>
          </div>
        </section>

        <div className="global-container py-12">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No blog posts found.</p>
          ) : (
            <>
              {/* Featured post */}
              {featured && isValidUrl(featured.featured_image) && (
                <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                  <article className="relative rounded-2xl overflow-hidden shadow-xl bg-white">
                    <div className="relative h-72 md:h-[420px] w-full">
                      <Image
                        src={featured.featured_image}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <span
                        className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 text-white"
                        style={{ backgroundColor: featured.category.color }}
                      >
                        {featured.category.name}
                      </span>
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-gray-300 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(featured.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {featured.read_time} min read
                        </span>
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                          Featured
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                        {isValidUrl(post.featured_image) && (
                          <div className="relative h-52 w-full overflow-hidden">
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <span
                            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 text-white w-fit"
                            style={{ backgroundColor: post.category.color }}
                          >
                            {post.category.name}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-3 flex-1 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.read_time} min
                            </span>
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="flex items-center gap-1 text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded"
                                >
                                  <Tag className="w-2.5 h-2.5" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
