import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: 'dracula',
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}
