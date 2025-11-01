
export type PostFrontmatter = {
  title: string;
  date: string;
  summary: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
};
