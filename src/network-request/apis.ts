import axios from 'axios';

export const apiurl = {
  register: 'auth/register',
  logout: 'auth/logout',
  login: 'auth/login',
  updateProfile: 'auth/profile',
};

const BLOG_BASE = 'https://pickpackgo.in-sourceit.com/api';

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