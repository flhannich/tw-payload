// collections/hooks/media-after-change.ts
// Process images with Cloudflare Images after upload

import { processImageWithCloudflare } from '@/services/cloudflare-images'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { CollectionAfterChangeHook } from 'payload'
import { APIError } from 'payload'

export const mediaAfterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
    // Only process new uploads
    if (operation !== 'create' || !doc.filename) return doc

    try {
        const cloudflare = getCloudflareContext()
        const r2 = cloudflare.env.R2

        // Get original file from R2
        const originalFile = await r2.get(`images/${doc.filename}`)
        if (!originalFile) {
            console.warn('Original file not found in R2')
            return doc
        }

        const imageBuffer = await originalFile.arrayBuffer()

        // Process with Cloudflare Images
        const variants = await processImageWithCloudflare(imageBuffer, cloudflare.env)

        // Store variants in R2
        const variantMetadata: { [key: string]: string } = {}
        const baseName = doc.filename.split('.')[0]

        for (const [sizeName, buffer] of Object.entries(variants)) {
            const variantFilename = `${baseName}_${sizeName}.webp`
            const variantPath = `images/${variantFilename}`

            await r2.put(variantPath, buffer, {
                httpMetadata: { contentType: 'image/webp' },
            })

            variantMetadata[sizeName] = variantPath
        }

        // Update document with metadata (using any to bypass type checking)
        await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: {
                variants: variantMetadata,
                processing_status: 'completed',
            } as any,
        })
    } catch (error) {
        console.error('Image processing failed:', error)
        new APIError('Image processing failed')
        // Update status to failed but don't throw
        await req.payload
            .update({
                collection: 'media',
                id: doc.id,
                data: {
                    processing_status: 'failed',
                } as any,
            })
            .catch(() => {})
    }
    return doc
}
