'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag, Search, ArrowRight, BookOpen } from 'lucide-react';

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

interface BlogListProps {
  initialPosts: BlogPost[];
  featuredPost: BlogPost | null;
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

export default function BlogList({ initialPosts, featuredPost }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Map<string, { name: string; color: string }>();
    for (const post of initialPosts) {
      cats.set(post.category.slug, {
        name: post.category.name,
        color: post.category.color,
      });
    }
    return Array.from(cats.entries()).map(([slug, data]) => ({
      slug,
      name: data.name,
      color: data.color,
    }));
  }, [initialPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || post.category.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  return (
    <div className="w-full">
      {/* Search & Category Filter Section */}
      <div className="mb-12 bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col md:flex-row gap-6 justify-between items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  !isSelected ? 'bg-slate-50 hover:bg-slate-100 text-slate-600' : ''
                }`}
                style={{
                  backgroundColor: isSelected ? cat.color : undefined,
                  color: isSelected ? '#fff' : undefined,
                  boxShadow: isSelected ? `0 4px 12px ${cat.color}33` : undefined,
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles & guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-slate-50 focus:bg-white border border-slate-100 focus:border-slate-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Featured Post (only show if no filter/search is active, or if it matches) */}
      {featuredPost && selectedCategory === 'all' && searchQuery === '' && isValidUrl(featuredPost.featured_image) && (
        <div className="mb-14 group">
          <Link href={`/blog/${featuredPost.slug}`}>
            <article className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 grid md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative h-64 md:h-[450px] w-full overflow-hidden">
                <Image
                  src={featuredPost.featured_image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full text-white shadow-md"
                    style={{ backgroundColor: featuredPost.category.color }}
                  >
                    {featuredPost.category.name}
                  </span>
                  <span className="bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    Featured
                  </span>
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(featuredPost.published_at)}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {featuredPost.read_time} min read
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Author and Read link */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-3">
                    {featuredPost.author.profile_image && isValidUrl(featuredPost.author.profile_image) ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100">
                        <Image
                          src={featuredPost.author.profile_image}
                          alt={`${featuredPost.author.first_name} ${featuredPost.author.last_name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold border border-emerald-200">
                        {featuredPost.author.first_name[0]}
                        {featuredPost.author.last_name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {featuredPost.author.first_name} {featuredPost.author.last_name}
                      </h4>
                      <p className="text-[11px] text-slate-400">Author</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Read Post
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      )}

      {/* Grid of posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No articles found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Try adjusting your search keywords or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts
            // If featured post is visible in general list, let's filter it out when featuredPost section is active
            .filter((p) => !(featuredPost && selectedCategory === 'all' && searchQuery === '' && p.id === featuredPost.id))
            .map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                <article className="bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Card Image */}
                  {isValidUrl(post.featured_image) && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <span
                        className="absolute top-4 left-4 text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.published_at)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_time} min read
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2.5 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-5 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-slate-50">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Author Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-2.5">
                        {post.author.profile_image && isValidUrl(post.author.profile_image) ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-100">
                            <Image
                              src={post.author.profile_image}
                              alt={`${post.author.first_name} ${post.author.last_name}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-bold border border-slate-200">
                            {post.author.first_name[0]}
                            {post.author.last_name[0]}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-600">
                          {post.author.first_name} {post.author.last_name}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                        Read
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
