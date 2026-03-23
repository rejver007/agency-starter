import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'building-your-first-page',
    _status: 'published',
    authors: [author],
    excerpt: 'Learn how to use the page builder to create flexible layouts with blocks and heroes.',
    tags: [{ tag: 'Tutorials' }],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            version: 1,
            children: [{ type: 'text', text: 'Building Your First Page', version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'The page builder allows you to compose pages from reusable blocks. Add a hero, then mix and match content, media, and call-to-action blocks.',
                version: 1,
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage,
    meta: {
      title: 'Building Your First Page',
      description: 'Learn how to use the page builder to create flexible layouts with blocks and heroes.',
      image: heroImage,
    },
    publishedAt: new Date().toISOString(),
    title: 'Building Your First Page',
    populatedAuthors: [{ id: author.id, name: author.name ?? 'Demo Author' }],
  }
}
