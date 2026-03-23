import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}

export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'customising-the-starter',
    _status: 'published',
    authors: [author],
    excerpt: 'Tips for adapting this starter template to fit your next agency project.',
    tags: [{ tag: 'Resources' }, { tag: 'Updates' }],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            version: 1,
            children: [{ type: 'text', text: 'Customising the Starter', version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Add new collections, blocks, and globals to tailor this starter to your project. See the README for step-by-step instructions.',
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
      title: 'Customising the Starter',
      description: 'Tips for adapting this starter template to fit your next agency project.',
      image: heroImage,
    },
    publishedAt: new Date().toISOString(),
    title: 'Customising the Starter',
    populatedAuthors: [{ id: author.id, name: author.name ?? 'Demo Author' }],
  }
}
