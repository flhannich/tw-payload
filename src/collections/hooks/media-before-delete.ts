// Clean up image files from R2 before deletion

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { APIError, type CollectionBeforeDeleteHook } from 'payload'

export const mediaBeforeDelete: CollectionBeforeDeleteHook = async ({ req, id }) => {
    try {
        // Get the document first
        const doc = await req.payload.findByID({
            collection: 'media',
            id,
        })

        const cloudflare = getCloudflareContext()
        const r2 = cloudflare.env.R2

        // Delete original file
        if (doc.filename) {
            await r2.delete(`images/${doc.filename}`)
        }

        // Delete variants
        if (doc.variants) {
            for (const variantPath of Object.values(doc.variants)) {
                await r2.delete(variantPath as string)
            }
        }
    } catch (error) {
        new APIError('Failed to delete files')
        console.error('Failed to delete files:', error)
        // Don't prevent deletion if cleanup fails
    }
}
