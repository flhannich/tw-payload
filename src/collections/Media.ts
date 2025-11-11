import type { CollectionConfig } from 'payload'
import { mediaAfterChange } from './hooks/media-after-change'
import { mediaBeforeDelete } from './hooks/media-before-delete'

export const Media: CollectionConfig = {
    slug: 'media',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        },
        // Hidden fields for image variants metadata
        {
            name: 'variants',
            type: 'json',
            admin: {
                hidden: true,
            },
        },
        {
            name: 'processing_status',
            type: 'text',
            admin: {
                hidden: true,
            },
            defaultValue: 'pending',
        },
    ],
    upload: {
        crop: false,
        focalPoint: false,
        staticDir: 'images',
        adminThumbnail: ({ doc }) => (doc.filename as string) || false,
        mimeTypes: ['image/*'],
    },
    hooks: {
        afterChange: [mediaAfterChange],
        beforeDelete: [mediaBeforeDelete],
    },
}
