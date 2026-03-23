import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  author,
}) => {
  return {
    slug: 'getting-started-with-payload',
    _status: 'published',
    authors: [author],
    excerpt: 'Learn how to use Payload CMS to build flexible content-driven websites with Next.js.',
    tags: [{ tag: 'Tutorials' }, { tag: 'Updates' }],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            version: 1,
            children: [{ type: 'text', text: 'Welcome to Agency Starter', version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'This is a demo post seeded by the Agency Starter template. Replace this content with your own once your site is set up.',
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
      title: 'Getting Started with Payload',
      description: 'Learn how to use Payload CMS to build flexible content-driven websites.',
      image: heroImage,
    },
    publishedAt: new Date().toISOString(),
    title: 'Getting Started with Payload',
    populatedAuthors: [{ id: author.id, name: author.name ?? 'Demo Author' }],
  }
}
