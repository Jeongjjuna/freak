export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  thumbnail?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
