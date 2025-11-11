import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
    slug: 'courses',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
        },
    ],
}
