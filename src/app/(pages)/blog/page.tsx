import type { Metadata } from 'next';
import Header from '@/layouts/header';
import { blogApi } from '@/network-request/apis';
import BlogList from './BlogList';

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

export default async function BlogPage() {
  const posts: BlogPost[] = await blogApi.getPosts(12);
  const featured = posts.find((p) => p.is_featured);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50/50">
        {/* Modern Mesh Gradient Hero */}
        <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32 px-4">
          {/* Gradients and background patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-950/50 via-slate-950 to-slate-950" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 global-container text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Our Travel Blog
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-none">
              Stories, Tips &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Inspiration
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Discover expert destination guides, local secrets, and travel hacks to make your next journey with PikPakGo unforgettable.
            </p>
          </div>
        </section>

        {/* Content list section */}
        <div className="global-container py-16 -mt-10 relative z-20">
          <BlogList initialPosts={posts} featuredPost={featured || null} />
        </div>
      </main>
    </>
  );
}

