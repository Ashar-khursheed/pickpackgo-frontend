import axios from 'axios';

export const apiurl = {
  // Auth
  register: 'auth/register',
  login: 'auth/login',
  logout: 'auth/logout',
  updateProfile: 'auth/profile',

  // Properties
  properties: 'public/properties',
  propertyDetail: (id: number | string) => `public/properties/${id}`,
  propertyFeatured: 'public/properties/featured',
  propertyTopRated: 'public/properties/top-rated',
  propertyCheckAvailability: (id: number | string) => `public/properties/${id}/check-availability`,

  // Search
  searchHotels: 'public/search/hotels',
  searchAutocomplete: 'public/search/autocomplete',

  // Blog
  blogPosts: 'public/blog/posts',
  blogPost: (slug: string) => `public/blog/posts/${slug}`,

  // Newsletter
  newsletterSubscribe: 'public/newsletter/subscribe',
};

const BLOG_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export const blogApi = {
  async getPosts(perPage = 12) {
    try {
      const res = await axios.get(`${BLOG_BASE}/public/blog/posts?per_page=${perPage}`);
      return res.data?.data?.data ?? [];
    } catch {
      return [];
    }
  },

  async getPost(slug: string) {
    try {
      const res = await axios.get(`${BLOG_BASE}/public/blog/posts/${slug}`);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async getAllSlugs(): Promise<string[]> {
    try {
      const res = await axios.get(`${BLOG_BASE}/public/blog/posts?per_page=100`);
      return (res.data?.data?.data ?? []).map((p: { slug: string }) => p.slug);
    } catch {
      return [];
    }
  },
};